# R2S Smart Contracts

Reserve-to-Save (R2S) smart contracts for the Kaia blockchain hackathon.

## Overview

R2S is a decentralized savings and rewards platform that allows users to participate in merchant campaigns, earn discounts, and manage their savings through blockchain technology.

## Core Contracts

- **R2SCampaign.sol**: Main campaign management contract with escrow, rebate calculation, and settlement logic
- **MockUSDT.sol**: Mock USDT token for testing purposes

## Setup

### Install Dependencies

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
PRIVATE_KEY=your_private_key_here
KAIROS_RPC_URL=https://public-en-kairos.node.kaia.io
CYPRESS_RPC_URL=https://public-en-cypress.klaytn.net
```

## Development

### Compile Contracts

```bash
npm run compile
```

### Run Tests

```bash
npm run test
```

### Check Contract Sizes

```bash
npm run size
```

## Deployment

### Deploy to Local Network

```bash
npm run deploy:local
```

### Deploy to Kairos Testnet

```bash
npm run deploy:kairos
```

### Deploy to Cypress Mainnet

```bash
npm run deploy:cypress
```

## Contract Addresses

Deployment addresses are saved in `deployments/` directory after each deployment.

## Testing

All contracts are developed using TDD (Test-Driven Development). Run the test suite:

```bash
npm test
```

Test Coverage:
- MockUSDT: 100% coverage
- R2SCampaign: Core functionality covered including:
  - Campaign creation and management
  - User participation
  - Settlement processing
  - Refund mechanisms
  - Access control
  - Emergency functions

## Security Features

- Role-based access control (RBAC)
- Reentrancy protection
- Pausable mechanism for emergencies
- Upgradeable proxy pattern (UUPS)
- Input validation and bounds checking
- SafeERC20 for token operations

## License

GPL-3.0