import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

// Components
import Navigation from './components/Navigation';
import Properties from './pages/Properties';
import RegisterProperty from './components/RegisterProperty';
import TransferRequests from './pages/TransferRequests';
import Profile from './pages/Profile';
import { theme } from './styles/theme';

// Web3 and Contract
import Web3 from 'web3';
import LandRegistry from './contracts/LandRegistry.json';
import { CONTRACT_ADDRESS, SUPPORTED_NETWORKS } from './config';

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
`;

const LoadingText = styled.p`
    margin-top: ${props => props.theme.spacing.md};
    color: ${props => props.theme.colors.navy};
    font-size: 1.1rem;
`;

const Spinner = styled.div`
    width: 50px;
    height: 50px;
    border: 3px solid ${props => props.theme.colors.lightGray};
    border-top: 3px solid ${props => props.theme.colors.blue};
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

const App = () => {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initWeb3 = async () => {
            try {
                if (window.ethereum) {
                    const web3Instance = new Web3(window.ethereum);
                    try {
                        await window.ethereum.request({ method: 'eth_requestAccounts' });
                        setWeb3(web3Instance);

                        // Listen for account changes
                        window.ethereum.on('accountsChanged', (accounts) => {
                            setAccount(accounts[0]);
                        });

                        // Listen for chain changes
                        window.ethereum.on('chainChanged', () => {
                            window.location.reload();
                        });

                        // Check network
                        await checkNetwork(web3Instance);

                    } catch (error) {
                        console.error("User denied account access");
                        toast.error("Please allow access to your wallet");
                    }
                }
                // Legacy DApp browsers
                else if (window.web3) {
                    const web3Instance = new Web3(window.web3.currentProvider);
                    setWeb3(web3Instance);
                }
                // Non-DApp browsers
                else {
                    console.log('Non-Ethereum browser detected. Consider installing MetaMask!');
                    toast.error("Please install MetaMask to use this application");
                }
            } catch (error) {
                console.error("Error initializing web3:", error);
                toast.error("Failed to connect to blockchain network");
            } finally {
                setLoading(false);
            }
        };

        initWeb3();

        // Cleanup function
        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', () => {});
                window.ethereum.removeListener('chainChanged', () => {});
            }
        };
    }, []);

    useEffect(() => {
        const initContract = async () => {
            if (web3) {
                try {
                    const networkId = await web3.eth.net.getId();
                    
                    // Check if we're on a supported network
                    if (!SUPPORTED_NETWORKS[networkId]) {
                        toast.error(`Please connect to a supported network. Current network ID: ${networkId}`);
                        return;
                    }

                    const instance = new web3.eth.Contract(
                        LandRegistry.abi,
                        CONTRACT_ADDRESS
                    );
                    setContract(instance);

                    // Get connected account
                    const accounts = await web3.eth.getAccounts();
                    setAccount(accounts[0]);

                    // Test contract connection
                    try {
                        // Call a view function from your contract
                        const result = await instance.methods.someViewFunction().call();
                        console.log("Contract connected successfully:", result);
                    } catch (error) {
                        console.error("Error testing contract connection:", error);
                        toast.error("Failed to connect to smart contract");
                    }

                } catch (error) {
                    console.error("Error initializing contract:", error);
                    toast.error("Failed to initialize contract");
                }
            }
        };

        initContract();
    }, [web3]);

    const handleConnectWallet = async () => {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);
        } catch (error) {
            console.error("Error connecting wallet:", error);
        }
    };

    const checkNetwork = async (web3Instance) => {
        const networkId = await web3Instance.eth.net.getId();
        const supportedNetworks = [1, 4, 5]; // mainnet, rinkeby, goerli
        if (!supportedNetworks.includes(networkId)) {
            toast.warning("Please connect to a supported network");
        }
    };

    if (loading) {
        return (
            <LoadingContainer>
                <Spinner />
                <LoadingText>Connecting to blockchain network...</LoadingText>
            </LoadingContainer>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <Router>
                <div>
                    <Navigation account={account} onConnect={handleConnectWallet} />
                    <div style={{ paddingTop: '80px' }}>
                        <Routes>
                            <Route 
                                path="/" 
                                element={<Properties web3={web3} contract={contract} account={account} />} 
                            />
                            <Route 
                                path="/properties" 
                                element={<Properties web3={web3} contract={contract} account={account} />} 
                            />
                            <Route 
                                path="/register" 
                                element={<RegisterProperty web3={web3} contract={contract} account={account} />} 
                            />
                            <Route 
                                path="/transfers" 
                                element={<TransferRequests web3={web3} contract={contract} account={account} />} 
                            />
                            <Route 
                                path="/profile" 
                                element={<Profile web3={web3} contract={contract} account={account} />} 
                            />
                        </Routes>
                    </div>
                    <ToastContainer position="bottom-right" />
                </div>
            </Router>
        </ThemeProvider>
    );
};

export default App;
