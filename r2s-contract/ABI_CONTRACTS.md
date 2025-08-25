# R2S Smart Contract ABIs

## Contract Addresses (Local Deployment)

```json
{
  "MockUSDT": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  "R2SCampaign": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
}
```

## MockUSDT ABI

### Key Functions
- `mint(address to, uint256 amount)` - Mint new tokens
- `burn(uint256 value)` - Burn tokens
- `transfer(address to, uint256 value)` - Transfer tokens
- `approve(address spender, uint256 value)` - Approve spending
- `balanceOf(address account)` - Get balance
- `allowance(address owner, address spender)` - Check allowance
- `decimals()` - Returns 6 (USDT decimals)

### Full ABI Location
`sdk/abi/MockUSDT.json`

### Simplified ABI for Common Operations
```json
[
  {
    "name": "mint",
    "type": "function",
    "inputs": [
      {"name": "to", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "outputs": []
  },
  {
    "name": "transfer",
    "type": "function",
    "inputs": [
      {"name": "to", "type": "address"},
      {"name": "value", "type": "uint256"}
    ],
    "outputs": [{"type": "bool"}]
  },
  {
    "name": "approve",
    "type": "function",
    "inputs": [
      {"name": "spender", "type": "address"},
      {"name": "value", "type": "uint256"}
    ],
    "outputs": [{"type": "bool"}]
  },
  {
    "name": "balanceOf",
    "type": "function",
    "inputs": [{"name": "account", "type": "address"}],
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view"
  },
  {
    "name": "decimals",
    "type": "function",
    "inputs": [],
    "outputs": [{"type": "uint8"}],
    "stateMutability": "pure"
  }
]
```

## R2SCampaign ABI

### Key Functions
- `initialize(address admin, address feeCollector, address treasury)` - Initialize contract
- `createCampaign(...)` - Create new campaign
- `participate(uint256 campaignId, uint256 amount)` - Participate in campaign
- `settleCampaign(uint256 campaignId)` - Settle campaign
- `refund(uint256 participationId)` - Request refund
- `getCampaign(uint256 campaignId)` - Get campaign details
- `getParticipation(uint256 participationId)` - Get participation details

### Campaign Structure
```solidity
struct Campaign {
    uint256 id;
    string title;
    string description;
    string imageUrl;
    address merchant;
    address token;
    uint256 targetAmount;
    uint256 currentAmount;
    uint256 minDeposit;
    uint256 maxDeposit;
    uint256 discountRate;
    uint256 startTime;
    uint256 endTime;
    uint256 settlementDate;
    uint256 totalParticipants;
    uint256 totalSettled;
    uint8 status;
    bool isVerified;
}
```

### Campaign Status Enum
```
0 = Draft
1 = Pending
2 = Active
3 = Completed
4 = Settling
5 = Settled
6 = Cancelled
```

### Full ABI Location
`sdk/abi/R2SCampaign.json`

### Simplified ABI for Common Operations
```json
[
  {
    "name": "createCampaign",
    "type": "function",
    "inputs": [
      {"name": "title", "type": "string"},
      {"name": "description", "type": "string"},
      {"name": "imageUrl", "type": "string"},
      {"name": "token", "type": "address"},
      {"name": "targetAmount", "type": "uint256"},
      {"name": "minDeposit", "type": "uint256"},
      {"name": "maxDeposit", "type": "uint256"},
      {"name": "discountRate", "type": "uint256"},
      {"name": "duration", "type": "uint256"},
      {"name": "settlementPeriod", "type": "uint256"}
    ],
    "outputs": [{"type": "uint256"}]
  },
  {
    "name": "participate",
    "type": "function",
    "inputs": [
      {"name": "campaignId", "type": "uint256"},
      {"name": "amount", "type": "uint256"}
    ],
    "outputs": []
  },
  {
    "name": "getCampaign",
    "type": "function",
    "inputs": [{"name": "campaignId", "type": "uint256"}],
    "outputs": [{"type": "tuple", "components": [...]}],
    "stateMutability": "view"
  },
  {
    "name": "settleCampaign",
    "type": "function",
    "inputs": [{"name": "campaignId", "type": "uint256"}],
    "outputs": []
  },
  {
    "name": "refund",
    "type": "function",
    "inputs": [{"name": "participationId", "type": "uint256"}],
    "outputs": []
  }
]
```

## Events

### MockUSDT Events
```json
[
  {
    "name": "Transfer",
    "type": "event",
    "inputs": [
      {"indexed": true, "name": "from", "type": "address"},
      {"indexed": true, "name": "to", "type": "address"},
      {"indexed": false, "name": "value", "type": "uint256"}
    ]
  },
  {
    "name": "Approval",
    "type": "event",
    "inputs": [
      {"indexed": true, "name": "owner", "type": "address"},
      {"indexed": true, "name": "spender", "type": "address"},
      {"indexed": false, "name": "value", "type": "uint256"}
    ]
  }
]
```

### R2SCampaign Events
```json
[
  {
    "name": "CampaignCreated",
    "type": "event",
    "inputs": [
      {"indexed": true, "name": "campaignId", "type": "uint256"},
      {"indexed": true, "name": "merchant", "type": "address"},
      {"indexed": false, "name": "title", "type": "string"},
      {"indexed": false, "name": "targetAmount", "type": "uint256"},
      {"indexed": false, "name": "discountRate", "type": "uint256"},
      {"indexed": false, "name": "startTime", "type": "uint256"},
      {"indexed": false, "name": "endTime", "type": "uint256"}
    ]
  },
  {
    "name": "ParticipationCreated",
    "type": "event",
    "inputs": [
      {"indexed": true, "name": "participationId", "type": "uint256"},
      {"indexed": true, "name": "campaignId", "type": "uint256"},
      {"indexed": true, "name": "participant", "type": "address"},
      {"indexed": false, "name": "amount", "type": "uint256"},
      {"indexed": false, "name": "expectedDiscount", "type": "uint256"}
    ]
  },
  {
    "name": "ParticipationSettled",
    "type": "event",
    "inputs": [
      {"indexed": true, "name": "participationId", "type": "uint256"},
      {"indexed": true, "name": "campaignId", "type": "uint256"},
      {"indexed": true, "name": "participant", "type": "address"},
      {"indexed": false, "name": "settlementAmount", "type": "uint256"},
      {"indexed": false, "name": "discount", "type": "uint256"}
    ]
  },
  {
    "name": "RefundProcessed",
    "type": "event",
    "inputs": [
      {"indexed": true, "name": "participationId", "type": "uint256"},
      {"indexed": true, "name": "campaignId", "type": "uint256"},
      {"indexed": true, "name": "participant", "type": "address"},
      {"indexed": false, "name": "amount", "type": "uint256"}
    ]
  }
]
```

## Usage Examples

### Web3.js
```javascript
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

// Load ABIs
const mockUSDTABI = require('./sdk/abi/MockUSDT.json');
const r2sCampaignABI = require('./sdk/abi/R2SCampaign.json');

// Create contract instances
const mockUSDT = new web3.eth.Contract(
  mockUSDTABI,
  '0x5FbDB2315678afecb367f032d93F642f64180aa3'
);

const r2sCampaign = new web3.eth.Contract(
  r2sCampaignABI,
  '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
);

// Use contracts
const balance = await mockUSDT.methods.balanceOf(address).call();
```

### Ethers.js
```javascript
const { ethers } = require('ethers');
const provider = new ethers.JsonRpcProvider('http://localhost:8545');

// Load ABIs
const mockUSDTABI = require('./sdk/abi/MockUSDT.json');
const r2sCampaignABI = require('./sdk/abi/R2SCampaign.json');

// Create contract instances
const mockUSDT = new ethers.Contract(
  '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  mockUSDTABI,
  provider
);

const r2sCampaign = new ethers.Contract(
  '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  r2sCampaignABI,
  provider
);

// Use contracts
const balance = await mockUSDT.balanceOf(address);
```

### Direct JSON-RPC Call
```javascript
const request = {
  jsonrpc: "2.0",
  method: "eth_call",
  params: [{
    to: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    data: "0x70a08231000000000000000000000000..." // balanceOf(address) encoded
  }, "latest"],
  id: 1
};
```

## File Locations

- **Full ABIs**: `sdk/abi/`
  - `MockUSDT.json` - Complete MockUSDT ABI
  - `R2SCampaign.json` - Complete R2SCampaign ABI

- **SDKs**: `sdk/`
  - `javascript/r2s-sdk.js` - JavaScript SDK with embedded ABIs
  - `typescript/r2s-sdk.ts` - TypeScript SDK with type definitions
  - `golang/` - Go bindings with ABI embedded

## Notes

1. **Decimals**: MockUSDT uses 6 decimals (like real USDT)
2. **Basis Points**: Rates are in basis points (10000 = 100%)
3. **Time**: All timestamps are in Unix seconds
4. **Amounts**: All token amounts need to account for decimals (multiply by 10^6 for USDT)