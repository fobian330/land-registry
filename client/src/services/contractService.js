import Web3 from 'web3';
import { CONTRACT_ADDRESS } from '../config';
import LandRegistry from '../contracts/LandRegistry.json';

export class ContractService {
    constructor(web3, account) {
        this.web3 = web3;
        this.account = account;
        this.contract = new web3.eth.Contract(LandRegistry.abi, CONTRACT_ADDRESS);
    }

    // Example methods to interact with your contract
    async registerProperty(location, area, price, documents) {
        try {
            return await this.contract.methods
                .registerProperty(location, area, price, documents)
                .send({ from: this.account });
        } catch (error) {
            console.error("Error registering property:", error);
            throw error;
        }
    }

    async getProperties() {
        try {
            return await this.contract.methods
                .getAllProperties()
                .call({ from: this.account });
        } catch (error) {
            console.error("Error getting properties:", error);
            throw error;
        }
    }

    async transferProperty(propertyId, newOwner) {
        try {
            return await this.contract.methods
                .transferProperty(propertyId, newOwner)
                .send({ from: this.account });
        } catch (error) {
            console.error("Error transferring property:", error);
            throw error;
        }
    }
} 