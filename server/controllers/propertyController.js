const Property = require('../models/Property');
const TransferRequest = require('../models/TransferRequest');
const Web3 = require('web3');
const LandRegistry = require('../contracts/LandRegistry.json');

class PropertyController {
    constructor() {
        this.web3 = new Web3(process.env.ETHEREUM_NODE_URL);
        this.contract = new this.web3.eth.Contract(
            LandRegistry.abi,
            process.env.CONTRACT_ADDRESS
        );
    }

    // Register a new property
    async registerProperty(req, res) {
        try {
            const {
                location,
                coordinates,
                area,
                value,
                ipfsHash,
                metadata
            } = req.body;

            // Interact with smart contract
            const accounts = await this.web3.eth.getAccounts();
            const result = await this.contract.methods.registerProperty(
                location,
                coordinates,
                area,
                value,
                ipfsHash
            ).send({ from: accounts[0] });

            // Create property in MongoDB
            const property = new Property({
                propertyId: result.events.PropertyRegistered.returnValues.propertyId,
                location,
                coordinates,
                area,
                value,
                owner: accounts[0],
                ipfsHash,
                metadata
            });

            await property.save();

            res.status(201).json({
                success: true,
                data: property,
                transaction: result.transactionHash
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Get all properties
    async getProperties(req, res) {
        try {
            const properties = await Property.find()
                .sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                count: properties.length,
                data: properties
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Get properties by owner
    async getPropertiesByOwner(req, res) {
        try {
            const { address } = req.params;
            const properties = await Property.find({ owner: address })
                .sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                count: properties.length,
                data: properties
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Initiate property transfer
    async initiateTransfer(req, res) {
        try {
            const { propertyId, to, price } = req.body;
            const accounts = await this.web3.eth.getAccounts();

            // Interact with smart contract
            const result = await this.contract.methods.initiateTransfer(
                propertyId,
                to,
                this.web3.utils.toWei(price.toString(), 'ether')
            ).send({ from: accounts[0] });

            // Create transfer request in MongoDB
            const transferRequest = new TransferRequest({
                requestId: result.events.TransferRequested.returnValues.requestId,
                propertyId,
                from: accounts[0],
                to,
                price,
                status: 'Pending'
            });

            await transferRequest.save();

            // Update property status
            await Property.findOneAndUpdate(
                { propertyId },
                { status: 'PendingTransfer' }
            );

            res.status(201).json({
                success: true,
                data: transferRequest,
                transaction: result.transactionHash
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Approve transfer request
    async approveTransfer(req, res) {
        try {
            const { requestId } = req.params;
            const accounts = await this.web3.eth.getAccounts();

            // Verify inspector role
            const isInspector = await this.contract.methods.hasRole(
                await this.contract.methods.INSPECTOR_ROLE().call(),
                accounts[0]
            ).call();

            if (!isInspector) {
                return res.status(403).json({
                    success: false,
                    error: 'Not authorized as inspector'
                });
            }

            // Interact with smart contract
            const result = await this.contract.methods.approveTransfer(requestId)
                .send({ from: accounts[0] });

            // Update transfer request in MongoDB
            const transferRequest = await TransferRequest.findOneAndUpdate(
                { requestId },
                {
                    status: 'Approved',
                    approvedBy: accounts[0],
                    approvalDate: new Date()
                },
                { new: true }
            );

            res.status(200).json({
                success: true,
                data: transferRequest,
                transaction: result.transactionHash
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Execute transfer
    async executeTransfer(req, res) {
        try {
            const { requestId } = req.params;
            const accounts = await this.web3.eth.getAccounts();

            // Interact with smart contract
            const result = await this.contract.methods.executeTransfer(requestId)
                .send({ from: accounts[0] });

            // Update transfer request and property in MongoDB
            const transferRequest = await TransferRequest.findOne({ requestId });
            
            await TransferRequest.findOneAndUpdate(
                { requestId },
                {
                    status: 'Completed',
                    completionDetails: {
                        transactionHash: result.transactionHash,
                        completionDate: new Date(),
                        verifiedBy: accounts[0]
                    }
                }
            );

            await Property.findOneAndUpdate(
                { propertyId: transferRequest.propertyId },
                {
                    owner: transferRequest.to,
                    status: 'Available',
                    $push: {
                        transferHistory: {
                            from: transferRequest.from,
                            to: transferRequest.to,
                            date: new Date(),
                            price: transferRequest.price,
                            transactionHash: result.transactionHash
                        }
                    }
                }
            );

            res.status(200).json({
                success: true,
                transaction: result.transactionHash
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new PropertyController();
