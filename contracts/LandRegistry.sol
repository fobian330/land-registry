// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract LandRegistry is LandRegistryAccess, ERC721 {
    using Counters for Counters.Counter;
    
    struct Property {
        uint256 propertyId;
        string location;
        string coordinates;
        uint256 area;
        uint256 value;
        address owner;
        bool isVerified;
        uint256 lastTransferDate;
        string ipfsHash;  // For property documents
        PropertyStatus status;
    }

    struct TransferRequest {
        uint256 requestId;
        uint256 propertyId;
        address from;
        address to;
        uint256 requestDate;
        TransferStatus status;
        string reason;
        uint256 price;
    }

    enum PropertyStatus { Available, PendingTransfer, Locked }
    enum TransferStatus { Pending, Approved, Rejected, Completed, Cancelled }

    Counters.Counter private _propertyIds;
    Counters.Counter private _transferIds;

    mapping(uint256 => Property) public properties;
    mapping(uint256 => TransferRequest) public transferRequests;
    mapping(address => uint256[]) public userProperties;
    
    uint256 public transferWaitingPeriod = 7 days;
    uint256 public disputePeriod = 3 days;

    event PropertyRegistered(uint256 indexed propertyId, address indexed owner);
    event TransferRequested(uint256 indexed requestId, uint256 indexed propertyId);
    event TransferStatusUpdated(uint256 indexed requestId, TransferStatus status);
    event PropertyVerified(uint256 indexed propertyId);
    event DocumentsUpdated(uint256 indexed propertyId, string ipfsHash);

    constructor() 
        ERC721("Land Registry", "LAND")
        LandRegistryAccess(msg.sender)
    {}

    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        virtual 
        override(ERC721, AccessControl) 
        returns (bool) 
    {
        return super.supportsInterface(interfaceId);
    }

    function registerProperty(
        string memory location,
        string memory coordinates,
        uint256 area,
        uint256 value,
        string memory ipfsHash
    ) public {
        _propertyIds.increment();
        uint256 newPropertyId = _propertyIds.current();

        properties[newPropertyId] = Property({
            propertyId: newPropertyId,
            location: location,
            coordinates: coordinates,
            area: area,
            value: value,
            owner: msg.sender,
            isVerified: false,
            lastTransferDate: block.timestamp,
            ipfsHash: ipfsHash,
            status: PropertyStatus.Available
        });

        userProperties[msg.sender].push(newPropertyId);
        _mint(msg.sender, newPropertyId);
        
        emit PropertyRegistered(newPropertyId, msg.sender);
    }

    function verifyProperty(uint256 propertyId) public onlyVerifier {
        require(properties[propertyId].propertyId != 0, "Property does not exist");
        require(!properties[propertyId].isVerified, "Property already verified");
        
        properties[propertyId].isVerified = true;
        emit PropertyVerified(propertyId);
    }

    function initiateTransfer(
        uint256 propertyId,
        address to,
        uint256 price
    ) public {
        require(ownerOf(propertyId) == msg.sender, "Not the property owner");
        require(properties[propertyId].isVerified, "Property not verified");
        require(properties[propertyId].status == PropertyStatus.Available, "Property not available");

        _transferIds.increment();
        uint256 newTransferId = _transferIds.current();

        transferRequests[newTransferId] = TransferRequest({
            requestId: newTransferId,
            propertyId: propertyId,
            from: msg.sender,
            to: to,
            requestDate: block.timestamp,
            status: TransferStatus.Pending,
            reason: "",
            price: price
        });

        properties[propertyId].status = PropertyStatus.PendingTransfer;
        
        emit TransferRequested(newTransferId, propertyId);
    }

    function approveTransfer(uint256 requestId) public onlyInspector {
        TransferRequest storage request = transferRequests[requestId];
        require(request.status == TransferStatus.Pending, "Invalid transfer status");
        
        request.status = TransferStatus.Approved;
        emit TransferStatusUpdated(requestId, TransferStatus.Approved);
    }

    function executeTransfer(uint256 requestId) public {
        TransferRequest storage request = transferRequests[requestId];
        require(request.status == TransferStatus.Approved, "Transfer not approved");
        require(
            block.timestamp >= request.requestDate + transferWaitingPeriod,
            "Waiting period not over"
        );

        Property storage property = properties[request.propertyId];
        
        // Update property details
        property.owner = request.to;
        property.lastTransferDate = block.timestamp;
        property.status = PropertyStatus.Available;
        
        // Update user properties arrays
        removePropertyFromUser(request.from, request.propertyId);
        userProperties[request.to].push(request.propertyId);
        
        // Update transfer status
        request.status = TransferStatus.Completed;
        
        // Transfer NFT
        _transfer(request.from, request.to, request.propertyId);
        
        emit TransferStatusUpdated(requestId, TransferStatus.Completed);
    }

    function updateDocuments(uint256 propertyId, string memory ipfsHash) public {
        require(properties[propertyId].owner == msg.sender || hasRole(ADMIN_ROLE, msg.sender), 
                "Not authorized");
        
        properties[propertyId].ipfsHash = ipfsHash;
        emit DocumentsUpdated(propertyId, ipfsHash);
    }

    function getProperty(uint256 propertyId) public view returns (Property memory) {
        return properties[propertyId];
    }

    function getTransferRequest(uint256 requestId) public view returns (TransferRequest memory) {
        return transferRequests[requestId];
    }

    function getUserProperties(address user) public view returns (uint256[] memory) {
        return userProperties[user];
    }

    // Internal functions
    function removePropertyFromUser(address user, uint256 propertyId) internal {
        uint256[] storage userProps = userProperties[user];
        for (uint i = 0; i < userProps.length; i++) {
            if (userProps[i] == propertyId) {
                userProps[i] = userProps[userProps.length - 1];
                userProps.pop();
                break;
            }
        }
    }
}
