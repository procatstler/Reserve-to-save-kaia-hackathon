// Package r2s provides Go bindings for R2S smart contracts
package r2s

import (
	"context"
	"crypto/ecdsa"
	"math/big"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
)

// ContractAddresses holds the deployed contract addresses
type ContractAddresses struct {
	MockUSDT    common.Address
	R2SCampaign common.Address
}

// DefaultAddresses are the local deployment addresses
var DefaultAddresses = ContractAddresses{
	MockUSDT:    common.HexToAddress("0x5FbDB2315678afecb367f032d93F642f64180aa3"),
	R2SCampaign: common.HexToAddress("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"),
}

// SDK is the main SDK struct
type SDK struct {
	client      *ethclient.Client
	auth        *bind.TransactOpts
	addresses   ContractAddresses
	MockUSDT    *MockUSDT
	R2SCampaign *R2SCampaign
}

// NewSDK creates a new SDK instance
func NewSDK(rpcURL string, privateKey string) (*SDK, error) {
	client, err := ethclient.Dial(rpcURL)
	if err != nil {
		return nil, err
	}

	var auth *bind.TransactOpts
	if privateKey != "" {
		key, err := crypto.HexToECDSA(privateKey)
		if err != nil {
			return nil, err
		}

		publicKey := key.Public()
		publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
		if !ok {
			return nil, err
		}

		fromAddress := crypto.PubkeyToAddress(*publicKeyECDSA)
		
		nonce, err := client.PendingNonceAt(context.Background(), fromAddress)
		if err != nil {
			return nil, err
		}

		gasPrice, err := client.SuggestGasPrice(context.Background())
		if err != nil {
			return nil, err
		}

		auth = bind.NewKeyedTransactor(key)
		auth.Nonce = big.NewInt(int64(nonce))
		auth.Value = big.NewInt(0)
		auth.GasLimit = uint64(3000000)
		auth.GasPrice = gasPrice
	}

	// Initialize contracts
	mockUSDT, err := NewMockUSDT(DefaultAddresses.MockUSDT, client)
	if err != nil {
		return nil, err
	}

	r2sCampaign, err := NewR2SCampaign(DefaultAddresses.R2SCampaign, client)
	if err != nil {
		return nil, err
	}

	return &SDK{
		client:      client,
		auth:        auth,
		addresses:   DefaultAddresses,
		MockUSDT:    mockUSDT,
		R2SCampaign: r2sCampaign,
	}, nil
}

// GetClient returns the ethereum client
func (s *SDK) GetClient() *ethclient.Client {
	return s.client
}

// GetAuth returns the transaction options
func (s *SDK) GetAuth() *bind.TransactOpts {
	return s.auth
}

// GetAddresses returns the contract addresses
func (s *SDK) GetAddresses() ContractAddresses {
	return s.addresses
}

// Campaign represents a campaign
type Campaign struct {
	ID               *big.Int
	Title            string
	Description      string
	ImageURL         string
	Merchant         common.Address
	Token            common.Address
	TargetAmount     *big.Int
	CurrentAmount    *big.Int
	MinDeposit       *big.Int
	MaxDeposit       *big.Int
	DiscountRate     *big.Int
	StartTime        *big.Int
	EndTime          *big.Int
	SettlementDate   *big.Int
	TotalParticipants *big.Int
	Status           uint8
	IsVerified       bool
}

// CreateCampaignParams holds parameters for creating a campaign
type CreateCampaignParams struct {
	Title            string
	Description      string
	ImageURL         string
	TargetAmount     *big.Int
	MinDeposit       *big.Int
	MaxDeposit       *big.Int
	DiscountRate     *big.Int
	Duration         *big.Int
	SettlementPeriod *big.Int
}
