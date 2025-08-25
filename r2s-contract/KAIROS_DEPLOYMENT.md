# Kairos Testnet Deployment

## 🚀 Deployment Information

**Network**: Kaia Kairos Testnet  
**Chain ID**: 1001  
**Date**: 2025-08-25  
**Deployer**: `0x9f6D4f5dFAcf340B5Ba0b8768aEf5144bb685Ddc`

## 📋 Contract Addresses

| Contract | Address | Explorer |
|----------|---------|----------|
| **MockUSDT** | `0xA18399D0a2Ae3713498f6b9b40290D0f7eD27C15` | [View on KaiaScope](https://kairos.kaiascope.com/address/0xA18399D0a2Ae3713498f6b9b40290D0f7eD27C15) |
| **R2SCampaign** | `0x9c14193b5470327Fa3F428E1589546AcDC717FE2` | [View on KaiaScope](https://kairos.kaiascope.com/address/0x9c14193b5470327Fa3F428E1589546AcDC717FE2) |

## 🔧 Configuration

- **Treasury**: `0x9f6D4f5dFAcf340B5Ba0b8768aEf5144bb685Ddc`
- **Fee Collector**: `0x9f6D4f5dFAcf340B5Ba0b8768aEf5144bb685Ddc`
- **Platform Fee**: 2.5% (250 basis points)
- **Merchant Fee**: 1% (100 basis points)
- **Early Withdraw Penalty**: 5% (500 basis points)

## 🌐 Network Information

- **RPC URL**: https://public-en-kairos.node.kaia.io
- **Block Explorer**: https://kairos.kaiascope.com
- **Faucet**: https://faucet.kaia.io/

## 📝 How to Interact

### Using JavaScript/TypeScript SDK

```javascript
const { R2SSDK } = require('./sdk/javascript/r2s-sdk');

// Update contract addresses for Kairos
const KAIROS_ADDRESSES = {
  MockUSDT: '0xA18399D0a2Ae3713498f6b9b40290D0f7eD27C15',
  R2SCampaign: '0x9c14193b5470327Fa3F428E1589546AcDC717FE2'
};

// Initialize SDK with Kairos RPC
const sdk = new R2SSDK(
  'https://public-en-kairos.node.kaia.io',
  'your-private-key' // Optional
);
```

### Using Ethers.js Directly

```javascript
const { ethers } = require('ethers');

// Connect to Kairos
const provider = new ethers.JsonRpcProvider('https://public-en-kairos.node.kaia.io');

// Contract instances
const mockUSDT = new ethers.Contract(
  '0xA18399D0a2Ae3713498f6b9b40290D0f7eD27C15',
  require('./sdk/abi/MockUSDT.json'),
  provider
);

const r2sCampaign = new ethers.Contract(
  '0x9c14193b5470327Fa3F428E1589546AcDC717FE2',
  require('./sdk/abi/R2SCampaign.json'),
  provider
);
```

### Using Web3.js

```javascript
const Web3 = require('web3');
const web3 = new Web3('https://public-en-kairos.node.kaia.io');

const mockUSDT = new web3.eth.Contract(
  require('./sdk/abi/MockUSDT.json'),
  '0xA18399D0a2Ae3713498f6b9b40290D0f7eD27C15'
);

const r2sCampaign = new web3.eth.Contract(
  require('./sdk/abi/R2SCampaign.json'),
  '0x9c14193b5470327Fa3F428E1589546AcDC717FE2'
);
```

## 🧪 Testing the Deployment

### 1. Check Contract Deployment

```bash
# Check MockUSDT
curl -X POST https://public-en-kairos.node.kaia.io \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getCode","params":["0xA18399D0a2Ae3713498f6b9b40290D0f7eD27C15","latest"],"id":1}'

# Check R2SCampaign
curl -X POST https://public-en-kairos.node.kaia.io \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getCode","params":["0x9c14193b5470327Fa3F428E1589546AcDC717FE2","latest"],"id":1}'
```

### 2. Test Script

Create `test-kairos.js`:

```javascript
const { ethers } = require('ethers');

async function test() {
  const provider = new ethers.JsonRpcProvider('https://public-en-kairos.node.kaia.io');
  
  // Check MockUSDT
  const mockUSDTAbi = ['function name() view returns (string)', 'function symbol() view returns (string)'];
  const mockUSDT = new ethers.Contract('0xA18399D0a2Ae3713498f6b9b40290D0f7eD27C15', mockUSDTAbi, provider);
  
  console.log('MockUSDT Name:', await mockUSDT.name());
  console.log('MockUSDT Symbol:', await mockUSDT.symbol());
  
  // Check R2SCampaign
  const r2sCampaignAbi = ['function platformFee() view returns (uint256)', 'function merchantFee() view returns (uint256)'];
  const r2sCampaign = new ethers.Contract('0x9c14193b5470327Fa3F428E1589546AcDC717FE2', r2sCampaignAbi, provider);
  
  console.log('Platform Fee:', (await r2sCampaign.platformFee()).toString(), 'basis points');
  console.log('Merchant Fee:', (await r2sCampaign.merchantFee()).toString(), 'basis points');
}

test().catch(console.error);
```

## 🔑 Admin Functions

The deployer address (`0x9f6D4f5dFAcf340B5Ba0b8768aEf5144bb685Ddc`) has admin privileges for:
- Whitelisting tokens
- Updating fees
- Pausing/unpausing contracts
- Emergency withdrawals
- Upgrading contracts (UUPS pattern)

## 📊 Transaction Details

- **MockUSDT Deployment TX**: Check on [KaiaScope](https://kairos.kaiascope.com/tx/)
- **R2SCampaign Deployment TX**: Check on [KaiaScope](https://kairos.kaiascope.com/tx/)

## 🔄 Next Steps

1. **Test Campaign Creation**
   - Create a test campaign
   - Participate with test accounts
   - Test settlement process

2. **Frontend Integration**
   - Update frontend to use Kairos addresses
   - Configure Kaia wallet connection
   - Test user flows

3. **Backend Integration**
   - Update backend service with Kairos addresses
   - Configure event listeners
   - Set up monitoring

## 📚 Resources

- [Kaia Documentation](https://docs.kaia.io/)
- [Kairos Faucet](https://faucet.kaia.io/)
- [KaiaScope Explorer](https://kairos.kaiascope.com/)
- [Contract ABIs](./sdk/abi/)
- [SDKs](./sdk/)