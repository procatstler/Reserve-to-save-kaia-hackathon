const { ethers } = require('ethers');

async function test() {
  console.log('🧪 Testing Kairos Deployment...\n');
  
  const provider = new ethers.JsonRpcProvider('https://public-en-kairos.node.kaia.io');
  
  // Check MockUSDT
  console.log('📍 MockUSDT Contract: 0xA18399D0a2Ae3713498f6b9b40290D0f7eD27C15');
  const mockUSDTAbi = [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
    'function totalSupply() view returns (uint256)'
  ];
  const mockUSDT = new ethers.Contract('0xA18399D0a2Ae3713498f6b9b40290D0f7eD27C15', mockUSDTAbi, provider);
  
  try {
    console.log('  Name:', await mockUSDT.name());
    console.log('  Symbol:', await mockUSDT.symbol());
    console.log('  Decimals:', await mockUSDT.decimals());
    const totalSupply = await mockUSDT.totalSupply();
    console.log('  Total Supply:', ethers.formatUnits(totalSupply, 6), 'mUSDT');
  } catch (error) {
    console.error('  ❌ Error reading MockUSDT:', error.message);
  }
  
  // Check R2SCampaign
  console.log('\n📍 R2SCampaign Contract: 0x9c14193b5470327Fa3F428E1589546AcDC717FE2');
  const r2sCampaignAbi = [
    'function platformFee() view returns (uint256)',
    'function merchantFee() view returns (uint256)',
    'function earlyWithdrawPenalty() view returns (uint256)',
    'function feeCollector() view returns (address)',
    'function treasury() view returns (address)',
    'function paused() view returns (bool)',
    'function nextCampaignId() view returns (uint256)'
  ];
  const r2sCampaign = new ethers.Contract('0x9c14193b5470327Fa3F428E1589546AcDC717FE2', r2sCampaignAbi, provider);
  
  try {
    console.log('  Platform Fee:', (await r2sCampaign.platformFee()).toString(), 'basis points (2.5%)');
    console.log('  Merchant Fee:', (await r2sCampaign.merchantFee()).toString(), 'basis points (1%)');
    console.log('  Early Withdraw Penalty:', (await r2sCampaign.earlyWithdrawPenalty()).toString(), 'basis points (5%)');
    console.log('  Fee Collector:', await r2sCampaign.feeCollector());
    console.log('  Treasury:', await r2sCampaign.treasury());
    console.log('  Paused:', await r2sCampaign.paused());
    console.log('  Next Campaign ID:', (await r2sCampaign.nextCampaignId()).toString());
  } catch (error) {
    console.error('  ❌ Error reading R2SCampaign:', error.message);
  }
  
  console.log('\n✅ Deployment verification complete!');
  console.log('\n📋 Summary:');
  console.log('  Network: Kaia Kairos Testnet');
  console.log('  Chain ID: 1001');
  console.log('  MockUSDT: 0xA18399D0a2Ae3713498f6b9b40290D0f7eD27C15');
  console.log('  R2SCampaign: 0x9c14193b5470327Fa3F428E1589546AcDC717FE2');
  console.log('\n🔗 View on Explorer:');
  console.log('  https://kairos.kaiascope.com/address/0xA18399D0a2Ae3713498f6b9b40290D0f7eD27C15');
  console.log('  https://kairos.kaiascope.com/address/0x9c14193b5470327Fa3F428E1589546AcDC717FE2');
}

test().catch(console.error);