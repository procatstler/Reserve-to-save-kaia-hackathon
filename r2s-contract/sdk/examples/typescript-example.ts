/**
 * R2S SDK TypeScript Usage Example
 */

import R2SSDK, { CampaignParams, Campaign, CampaignStatus } from '../typescript/r2s-sdk';

async function main(): Promise<void> {
  // Initialize SDK (using local hardhat node)
  const sdk = new R2SSDK('http://localhost:8545');
  
  console.log('🚀 R2S SDK TypeScript Example\n');
  console.log('Contract Addresses:', sdk.getContractAddresses());
  
  try {
    // Example 1: Check USDT balance
    const balance: string = await sdk.getUSDTBalance('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    console.log('\n💰 USDT Balance:', balance, 'USDT');
    
    // Example 2: Create a campaign with type safety
    const campaignParams: CampaignParams = {
      title: 'Summer Sale Campaign',
      description: 'Get 10% discount on all purchases',
      imageUrl: 'https://example.com/campaign.jpg',
      targetAmount: 10000, // 10,000 USDT
      minDeposit: 100,     // 100 USDT minimum
      maxDeposit: 1000,    // 1,000 USDT maximum
      discountRate: 1000,  // 10% (1000 basis points)
      duration: 30 * 24 * 60 * 60, // 30 days
      settlementPeriod: 7 * 24 * 60 * 60 // 7 days
    };
    
    const campaignId = await sdk.createCampaign(campaignParams);
    console.log('\n📢 Campaign Created! ID:', campaignId?.toString());
    
    // Example 3: Get campaign details with type safety
    if (campaignId !== null) {
      const campaign: Campaign = await sdk.getCampaign(campaignId);
      console.log('\n📋 Campaign Details:');
      console.log('  Title:', campaign.title);
      console.log('  Target Amount:', campaign.targetAmount, 'USDT');
      console.log('  Current Amount:', campaign.currentAmount, 'USDT');
      console.log('  Discount Rate:', parseInt(campaign.discountRate) / 100 + '%');
      
      // Using the enum for status
      const statusName = CampaignStatus[campaign.status];
      console.log('  Status:', statusName);
      console.log('  Start Time:', campaign.startTime.toLocaleString());
      console.log('  End Time:', campaign.endTime.toLocaleString());
      console.log('  Verified:', campaign.isVerified ? 'Yes' : 'No');
    }
    
    // Example 4: Participate in a campaign (requires USDT balance)
    // await sdk.participate(campaignId, 500); // Participate with 500 USDT
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
main().catch(console.error);