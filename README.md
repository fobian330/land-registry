# Blockchain-Based Land Registry System

A decentralized application (DApp) for managing land registry records using Ethereum blockchain, IPFS for document storage, and MERN stack for the application layer.

## Features

- **Blockchain-based Property Registration**
  - Immutable property records
  - Secure ownership tracking
  - Document verification

- **Role-Based Access Control**
  - Admin
  - Property Inspector
  - Property Owner
  - Verifier

- **Property Transfer System**
  - Secure transfer process
  - 7-day waiting period
  - Dispute resolution mechanism
  - Transfer verification

- **Document Management**
  - IPFS integration for document storage
  - Document verification
  - Historical record tracking

## Tech Stack

- **Blockchain**
  - Solidity (Smart Contracts)
  - Truffle (Development Framework)
  - Ganache (Local Blockchain)
  - Web3.js (Blockchain Interaction)

- **Frontend**
  - React.js
  - Material-UI
  - Styled Components
  - Web3.js
  - IPFS Client

- **Backend**
  - Node.js
  - Express
  - MongoDB
  - Mongoose

## Prerequisites

- Node.js (v14+)
- MongoDB
- Ganache
- MetaMask Browser Extension
- Truffle (`npm install -g truffle`)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd land-registry
   ```

2. Install dependencies:
   ```bash
   npm run install:all
   ```

3. Configure environment variables:
   Create `.env` files in both server and client directories:

   Server (.env):
   ```
   MONGODB_URI=<your-mongodb-uri>
   PORT=5000
   JWT_SECRET=<your-jwt-secret>
   ETHEREUM_NODE_URL=<your-ethereum-node-url>
   CONTRACT_ADDRESS=<deployed-contract-address>
   ```

   Client (.env):
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_IPFS_PROJECT_ID=<your-ipfs-project-id>
   REACT_APP_IPFS_PROJECT_SECRET=<your-ipfs-project-secret>
   ```

4. Start Ganache:
   ```bash
   ganache-cli
   ```

5. Deploy smart contracts:
   ```bash
   truffle migrate --reset
   ```

6. Start the development servers:
   ```bash
   npm run start:dev
   ```

## Smart Contract Deployment

1. Configure `truffle-config.js` with your network settings
2. Deploy to local network:
   ```bash
   truffle migrate --network development
   ```
3. Deploy to testnet:
   ```bash
   truffle migrate --network ropsten
   ```

## Testing

Run smart contract tests:
```bash
truffle test
```

Run frontend tests:
```bash
cd client
npm test
```

## Project Structure

```
land-registry/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── contracts/    # Contract ABIs
│   │   ├── pages/       # Page components
│   │   └── utils/       # Utility functions
│   └── public/          # Static files
├── contracts/           # Solidity smart contracts
├── migrations/          # Truffle migrations
├── server/             # Express backend
│   ├── controllers/    # Route controllers
│   ├── models/        # Mongoose models
│   └── routes/        # Express routes
└── test/              # Smart contract tests
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security Considerations

- All smart contracts are immutable once deployed
- Role-based access control for sensitive operations
- Waiting period for property transfers
- Document verification through IPFS
- Secure API endpoints with JWT authentication

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
