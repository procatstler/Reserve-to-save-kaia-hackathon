/**
 * R2S SDK JavaScript Usage Example
 */

const { R2SSDK } = require('../javascript/r2s-sdk');

async function main() {
  // Initialize SDK (using local hardhat node)
  const sdk = new R2SSDK('http://localhost:8545');
  
  console.log('🚀 R2S SDK JavaScript Example\n');
  console.log('Contract Addresses:', sdk.getContractAddresses());
  
  try {
    // Example 1: Check USDT balance
    const balance = await sdk.getUSDTBalance('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    console.log('\n💰 USDT Balance:', balance, 'USDT');
    
    // Example 2: Create a campaign
    const campaignId = await sdk.createCampaign({
      title: 'Summer Sale Campaign',
      description: 'Get 10% discount on all purchases',
      imageUrl: 'https://example.com/campaign.jpg',
      targetAmount: 10000, // 10,000 USDT
      minDeposit: 100,     // 100 USDT minimum
      maxDeposit: 1000,    // 1,000 USDT maximum
      discountRate: 1000,  // 10% (1000 basis points)
      duration: 30 * 24 * 60 * 60, // 30 days
      settlementPeriod: 7 * 24 * 60 * 60 // 7 days
    });
    
    console.log('\n📢 Campaign Created! ID:', campaignId?.toString());
    
    // Example 3: Get campaign details
    if (campaignId !== null) {
      const campaign = await sdk.getCampaign(campaignId);
      console.log('\n📋 Campaign Details:');
      console.log('  Title:', campaign.title);
      console.log('  Target Amount:', campaign.targetAmount, 'USDT');
      console.log('  Current Amount:', campaign.currentAmount, 'USDT');
      console.log('  Discount Rate:', campaign.discountRate / 100 + '%');
      console.log('  Status:', ['Draft', 'Pending', 'Active', 'Completed', 'Settling', 'Settled', 'Cancelled'][campaign.status]);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
main().catch(console.error);