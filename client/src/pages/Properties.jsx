import React, { useState, useEffect } from 'react';
import { ContractService } from '../services/contractService';

const Properties = ({ web3, account }) => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProperties = async () => {
            if (web3 && account) {
                try {
                    const contractService = new ContractService(web3, account);
                    const props = await contractService.getProperties();
                    setProperties(props);
                } catch (error) {
                    console.error("Error loading properties:", error);
                    toast.error("Failed to load properties");
                } finally {
                    setLoading(false);
                }
            }
        };

        loadProperties();
    }, [web3, account]);

    // Render your properties...
}; 