package main

import (
	"context"
	"fmt"
	"log"
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	r2s "../golang"
)

func main() {
	// Connect to local node
	client, err := ethclient.Dial("http://localhost:8545")
	if err != nil {
		log.Fatal("Failed to connect to the Ethereum client:", err)
	}
	defer client.Close()

	fmt.Println("🚀 R2S SDK Golang Example\n")
	
	// Contract addresses
	mockUSDTAddress := common.HexToAddress("0x5FbDB2315678afecb367f032d93F642f64180aa3")
	r2sCampaignAddress := common.HexToAddress("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0")
	
	fmt.Printf("Contract Addresses:\n")
	fmt.Printf("  MockUSDT: %s\n", mockUSDTAddress.Hex())
	fmt.Printf("  R2SCampaign: %s\n", r2sCampaignAddress.Hex())

	// Initialize SDK with private key (optional)
	sdk, err := r2s.NewSDK("http://localhost:8545", "")
	if err != nil {
		log.Fatal("Failed to initialize SDK:", err)
	}

	// Example 1: Check USDT balance
	userAddress := common.HexToAddress("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
	balance, err := sdk.MockUSDT.BalanceOf(nil, userAddress)
	if err != nil {
		log.Printf("Failed to get balance: %v", err)
	} else {
		// Convert balance from wei (6 decimals for USDT)
		balanceInUSDT := new(big.Float).SetInt(balance)
		divisor := new(big.Float).SetFloat64(1e6)
		balanceInUSDT.Quo(balanceInUSDT, divisor)
		fmt.Printf("\n💰 USDT Balance: %s USDT\n", balanceInUSDT.String())
	}

	// Example 2: Get campaign details (if campaign 0 exists)
	campaignId := big.NewInt(0)
	
	// Note: In a real implementation, you would call the getCampaign method
	// This is a simplified example
	fmt.Println("\n📋 Campaign Operations:")
	fmt.Println("  - Create Campaign: sdk.R2SCampaign.CreateCampaign(auth, params...)")
	fmt.Println("  - Participate: sdk.R2SCampaign.Participate(auth, campaignId, amount)")
	fmt.Println("  - Get Campaign: sdk.R2SCampaign.GetCampaign(nil, campaignId)")
	fmt.Println("  - Settle Campaign: sdk.R2SCampaign.SettleCampaign(auth, campaignId)")
	
	// Example 3: Create campaign parameters
	createCampaignParams := r2s.CreateCampaignParams{
		Title:            "Summer Sale Campaign",
		Description:      "Get 10% discount on all purchases",
		ImageURL:         "https://example.com/campaign.jpg",
		TargetAmount:     big.NewInt(10000000000), // 10,000 USDT (with 6 decimals)
		MinDeposit:       big.NewInt(100000000),   // 100 USDT
		MaxDeposit:       big.NewInt(1000000000),  // 1,000 USDT
		DiscountRate:     big.NewInt(1000),        // 10% (1000 basis points)
		Duration:         big.NewInt(2592000),     // 30 days in seconds
		SettlementPeriod: big.NewInt(604800),      // 7 days in seconds
	}
	
	fmt.Println("\n📝 Campaign Parameters Ready:")
	fmt.Printf("  Title: %s\n", createCampaignParams.Title)
	fmt.Printf("  Target Amount: %s (wei)\n", createCampaignParams.TargetAmount.String())
	fmt.Printf("  Discount Rate: %s basis points\n", createCampaignParams.DiscountRate.String())
	
	// Example 4: Check latest block
	header, err := client.HeaderByNumber(context.Background(), nil)
	if err != nil {
		log.Printf("Failed to get latest block: %v", err)
	} else {
		fmt.Printf("\n🔗 Latest Block: %d\n", header.Number.Uint64())
	}
	
	fmt.Println("\n✅ SDK Example Complete!")
}