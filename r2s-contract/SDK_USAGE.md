# R2S Smart Contract SDK Usage Guide

This guide explains how to use the R2S smart contract SDKs in JavaScript, TypeScript, and Golang.

## Contract Addresses (Local Deployment)

```
MockUSDT:    0x5FbDB2315678afecb367f032d93F642f64180aa3
R2SCampaign: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
```

## JavaScript SDK

### Installation

```bash
cd sdk/javascript
npm install
```

### Usage

```javascript
const { R2SSDK } = require('@r2s/sdk-js');

// Initialize SDK
const sdk = new R2SSDK('http://localhost:8545');

// Create a campaign
const campaignId = await sdk.createCampaign({
  title: 'Summer Sale',
  description: 'Get 10% off',
  imageUrl: 'https://example.com/image.jpg',
  targetAmount: 10000,
  minDeposit: 100,
  maxDeposit: 1000,
  discountRate: 1000, // 10%
  duration: 2592000, // 30 days
  settlementPeriod: 604800 // 7 days
});

// Participate in a campaign
await sdk.participate(campaignId, 500); // 500 USDT

// Get campaign details
const campaign = await sdk.getCampaign(campaignId);
console.log(campaign);
```

### Available Methods

- `mintUSDT(to, amount)` - Mint test USDT tokens
- `getUSDTBalance(address)` - Get USDT balance
- `approveUSDT(spender, amount)` - Approve USDT spending
- `createCampaign(params)` - Create a new campaign
- `participate(campaignId, amount)` - Participate in a campaign
- `getCampaign(campaignId)` - Get campaign details
- `settleCampaign(campaignId)` - Settle a campaign (merchant only)
- `refund(participationId)` - Request refund

## TypeScript SDK

### Installation

```bash
cd sdk/typescript
npm install
npm run build
```

### Usage

```typescript
import R2SSDK, { CampaignParams, Campaign, CampaignStatus } from '@r2s/sdk-ts';

// Initialize SDK
const sdk = new R2SSDK('http://localhost:8545');

// Create a campaign with type safety
const params: CampaignParams = {
  title: 'Summer Sale',
  description: 'Get 10% off',
  imageUrl: 'https://example.com/image.jpg',
  targetAmount: 10000,
  minDeposit: 100,
  maxDeposit: 1000,
  discountRate: 1000,
  duration: 2592000,
  settlementPeriod: 604800
};

const campaignId = await sdk.createCampaign(params);

// Get campaign with typed response
const campaign: Campaign = await sdk.getCampaign(campaignId);

// Check campaign status using enum
if (campaign.status === CampaignStatus.Active) {
  console.log('Campaign is active');
}
```

### Types

- `CampaignParams` - Parameters for creating a campaign
- `Campaign` - Campaign details structure
- `CampaignStatus` - Enum for campaign status
- `ContractTransactionResponse` - Transaction response type

## Golang SDK

### Installation

```bash
cd sdk/golang
go mod download
```

### Usage

```go
package main

import (
    "fmt"
    "log"
    "math/big"
    
    r2s "github.com/r2s/sdk-go"
)

func main() {
    // Initialize SDK
    sdk, err := r2s.NewSDK("http://localhost:8545", "private-key-optional")
    if err != nil {
        log.Fatal(err)
    }
    
    // Check USDT balance
    balance, err := sdk.MockUSDT.BalanceOf(nil, address)
    if err != nil {
        log.Fatal(err)
    }
    
    // Create campaign parameters
    params := r2s.CreateCampaignParams{
        Title:            "Summer Sale",
        Description:      "Get 10% off",
        ImageURL:         "https://example.com/image.jpg",
        TargetAmount:     big.NewInt(10000000000), // 10,000 USDT (6 decimals)
        MinDeposit:       big.NewInt(100000000),   // 100 USDT
        MaxDeposit:       big.NewInt(1000000000),  // 1,000 USDT
        DiscountRate:     big.NewInt(1000),        // 10%
        Duration:         big.NewInt(2592000),     // 30 days
        SettlementPeriod: big.NewInt(604800),      // 7 days
    }
    
    // Create campaign (requires auth)
    tx, err := sdk.R2SCampaign.CreateCampaign(sdk.GetAuth(), params...)
    if err != nil {
        log.Fatal(err)
    }
}
```

### Available Types

- `SDK` - Main SDK struct
- `ContractAddresses` - Contract address container
- `Campaign` - Campaign structure
- `CreateCampaignParams` - Campaign creation parameters

## ABI Files

Raw ABI files are available in `sdk/abi/` directory:
- `MockUSDT.json` - Mock USDT token ABI
- `R2SCampaign.json` - Campaign contract ABI

These can be used with any Web3 library directly.

## Examples

Complete working examples are available in `sdk/examples/`:
- `javascript-example.js` - JavaScript usage example
- `typescript-example.ts` - TypeScript usage example
- `golang-example.go` - Golang usage example

## Network Configuration

### Local Development
- RPC URL: `http://localhost:8545`
- Chain ID: 31337

### Kairos Testnet
- RPC URL: `https://public-en-kairos.node.kaia.io`
- Chain ID: 1001

### Cypress Mainnet
- RPC URL: `https://public-en-cypress.klaytn.net`
- Chain ID: 8217

## Common Operations

### 1. Setup Test Environment
```javascript
// Mint test USDT
await sdk.mintUSDT(userAddress, 10000);

// Approve campaign contract
await sdk.approveUSDT(campaignAddress, 10000);
```

### 2. Campaign Lifecycle
```javascript
// Create campaign
const id = await sdk.createCampaign(params);

// Users participate
await sdk.participate(id, 500);

// Merchant settles after campaign ends
await sdk.settleCampaign(id);
```

### 3. User Operations
```javascript
// Check balance
const balance = await sdk.getUSDTBalance(address);

// Get user's participations
const participations = await sdk.getUserParticipations(address);

// Request refund
await sdk.refund(participationId);
```

## Error Handling

All SDK methods may throw errors. Always use try-catch:

```javascript
try {
  const campaign = await sdk.getCampaign(id);
} catch (error) {
  console.error('Failed to get campaign:', error);
}
```

## Security Notes

1. **Private Keys**: Never expose private keys in frontend code
2. **Approvals**: Always approve exact amounts needed
3. **Validation**: Validate all user inputs before contract calls
4. **Gas Limits**: Set appropriate gas limits for transactions

## Support

For issues or questions:
- GitHub: https://github.com/your-repo/r2s-contracts
- Documentation: See contract source code for detailed function descriptions