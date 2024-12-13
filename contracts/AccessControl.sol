// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract LandRegistryAccess is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant INSPECTOR_ROLE = keccak256("INSPECTOR_ROLE");
    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    event RoleGranted(bytes32 indexed role, address indexed account);
    event RoleRevoked(bytes32 indexed role, address indexed account);

    constructor(address initialAdmin) {
        _setupRole(DEFAULT_ADMIN_ROLE, initialAdmin);
        _setupRole(ADMIN_ROLE, initialAdmin);
    }

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");
        _;
    }

    modifier onlyInspector() {
        require(hasRole(INSPECTOR_ROLE, msg.sender), "Caller is not an inspector");
        _;
    }

    modifier onlyVerifier() {
        require(hasRole(VERIFIER_ROLE, msg.sender), "Caller is not a verifier");
        _;
    }

    function addRole(address account, bytes32 role) public onlyAdmin {
        grantRole(role, account);
        emit RoleGranted(role, account);
    }

    function removeRole(address account, bytes32 role) public onlyAdmin {
        revokeRole(role, account);
        emit RoleRevoked(role, account);
    }

    function checkRole(address account, bytes32 role) public view returns (bool) {
        return hasRole(role, account);
    }
}
