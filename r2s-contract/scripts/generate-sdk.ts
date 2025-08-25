import fs from "fs";
import path from "path";

interface ContractArtifact {
  abi: any[];
  bytecode: string;
  deployedBytecode: string;
}

interface DeploymentData {
  network: string;
  chainId: string;
  deployer: string;
  timestamp: string;
  contracts: {
    MockUSDT: string;
    R2SCampaign: string;
  };
  configuration: {
    usdt: string;
    treasury: string;
    feeCollector: string;
  };
}

async function generateSDK() {
  console.log("🚀 Generating Multi-Language SDKs...\n");

  // Read deployment data
  const deploymentPath = path.join(__dirname, "../deployments/31337.json");
  const deploymentData: DeploymentData = JSON.parse(
    fs.readFileSync(deploymentPath, "utf8")
  );

  // Read contract artifacts and extract ABIs
  const contracts = ["MockUSDT", "R2SCampaign"];
  const abis: Record<string, any[]> = {};

  for (const contractName of contracts) {
    const artifactPath = path.join(
      __dirname,
      `../artifacts/contracts/${contractName === "MockUSDT" ? "mocks/" : ""}${contractName}.sol/${contractName}.json`
    );
    
    if (fs.existsSync(artifactPath)) {
      const artifact: ContractArtifact = JSON.parse(
        fs.readFileSync(artifactPath, "utf8")
      );
      abis[contractName] = artifact.abi;
    }
  }

  // Create SDK directory
  const sdkDir = path.join(__dirname, "../sdk");
  fs.mkdirSync(sdkDir, { recursive: true });

  // 1. Generate JavaScript SDK
  generateJavaScriptSDK(abis, deploymentData, sdkDir);

  // 2. Generate TypeScript SDK
  generateTypeScriptSDK(abis, deploymentData, sdkDir);

  // 3. Generate Golang SDK
  generateGolangSDK(abis, deploymentData, sdkDir);

  // 4. Save raw ABIs
  const abiDir = path.join(sdkDir, "abi");
  fs.mkdirSync(abiDir, { recursive: true });
  
  for (const [name, abi] of Object.entries(abis)) {
    fs.writeFileSync(
      path.join(abiDir, `${name}.json`),
      JSON.stringify(abi, null, 2)
    );
  }

  console.log("✅ SDK Generation Complete!");
  console.log("\n📁 Generated Files:");
  console.log("  - sdk/javascript/r2s-sdk.js");
  console.log("  - sdk/typescript/r2s-sdk.ts");
  console.log("  - sdk/golang/contracts/");
  console.log("  - sdk/abi/*.json");
}

function generateJavaScriptSDK(
  abis: Record<string, any[]>,
  deployment: DeploymentData,
  sdkDir: string
) {
  const jsDir = path.join(sdkDir, "javascript");
  fs.mkdirSync(jsDir, { recursive: true });

  const jsContent = `/**
 * R2S Smart Contract SDK for JavaScript
 * Generated on ${new Date().toISOString()}
 */

const { ethers } = require('ethers');

// Contract ABIs
const CONTRACT_ABIS = ${JSON.stringify(abis, null, 2)};

// Contract Addresses (Local Network)
const CONTRACT_ADDRESSES = ${JSON.stringify(deployment.contracts, null, 2)};

class R2SSDK {
  constructor(providerUrl = 'http://localhost:8545', privateKey) {
    this.provider = new ethers.JsonRpcProvider(providerUrl);
    
    if (privateKey) {
      this.signer = new ethers.Wallet(privateKey, this.provider);
    } else {
      // Use first account from provider
      this.signer = null;
    }
    
    this.contracts = {};
    this.initializeContracts();
  }
  
  async initializeContracts() {
    if (!this.signer) {
      const accounts = await this.provider.listAccounts();
      if (accounts.length > 0) {
        this.signer = await this.provider.getSigner(0);
      }
    }
    
    // Initialize MockUSDT contract
    this.contracts.mockUSDT = new ethers.Contract(
      CONTRACT_ADDRESSES.MockUSDT,
      CONTRACT_ABIS.MockUSDT,
      this.signer || this.provider
    );
    
    // Initialize R2SCampaign contract
    this.contracts.r2sCampaign = new ethers.Contract(
      CONTRACT_ADDRESSES.R2SCampaign,
      CONTRACT_ABIS.R2SCampaign,
      this.signer || this.provider
    );
  }
  
  // MockUSDT Methods
  async mintUSDT(to, amount) {
    const tx = await this.contracts.mockUSDT.mint(to, ethers.parseUnits(amount.toString(), 6));
    return await tx.wait();
  }
  
  async getUSDTBalance(address) {
    const balance = await this.contracts.mockUSDT.balanceOf(address);
    return ethers.formatUnits(balance, 6);
  }
  
  async approveUSDT(spender, amount) {
    const tx = await this.contracts.mockUSDT.approve(spender, ethers.parseUnits(amount.toString(), 6));
    return await tx.wait();
  }
  
  // R2SCampaign Methods
  async createCampaign(params) {
    const tx = await this.contracts.r2sCampaign.createCampaign(
      params.title,
      params.description,
      params.imageUrl,
      CONTRACT_ADDRESSES.MockUSDT, // Using MockUSDT as token
      ethers.parseUnits(params.targetAmount.toString(), 6),
      ethers.parseUnits(params.minDeposit.toString(), 6),
      ethers.parseUnits(params.maxDeposit.toString(), 6),
      params.discountRate, // in basis points (e.g., 1000 = 10%)
      params.duration, // in seconds
      params.settlementPeriod // in seconds
    );
    const receipt = await tx.wait();
    
    // Extract campaign ID from events
    const event = receipt.logs.find(log => {
      try {
        const parsed = this.contracts.r2sCampaign.interface.parseLog(log);
        return parsed?.name === 'CampaignCreated';
      } catch {
        return false;
      }
    });
    
    if (event) {
      const parsed = this.contracts.r2sCampaign.interface.parseLog(event);
      return parsed.args[0]; // campaignId
    }
    return null;
  }
  
  async participate(campaignId, amount) {
    // First approve the campaign contract to spend USDT
    await this.approveUSDT(CONTRACT_ADDRESSES.R2SCampaign, amount);
    
    // Then participate
    const tx = await this.contracts.r2sCampaign.participate(
      campaignId,
      ethers.parseUnits(amount.toString(), 6)
    );
    return await tx.wait();
  }
  
  async getCampaign(campaignId) {
    const campaign = await this.contracts.r2sCampaign.getCampaign(campaignId);
    return {
      id: campaign.id.toString(),
      title: campaign.title,
      description: campaign.description,
      imageUrl: campaign.imageUrl,
      merchant: campaign.merchant,
      token: campaign.token,
      targetAmount: ethers.formatUnits(campaign.targetAmount, 6),
      currentAmount: ethers.formatUnits(campaign.currentAmount, 6),
      minDeposit: ethers.formatUnits(campaign.minDeposit, 6),
      maxDeposit: ethers.formatUnits(campaign.maxDeposit, 6),
      discountRate: campaign.discountRate.toString(),
      startTime: new Date(Number(campaign.startTime) * 1000),
      endTime: new Date(Number(campaign.endTime) * 1000),
      settlementDate: new Date(Number(campaign.settlementDate) * 1000),
      totalParticipants: campaign.totalParticipants.toString(),
      status: campaign.status,
      isVerified: campaign.isVerified
    };
  }
  
  async settleCampaign(campaignId) {
    const tx = await this.contracts.r2sCampaign.settleCampaign(campaignId);
    return await tx.wait();
  }
  
  async refund(participationId) {
    const tx = await this.contracts.r2sCampaign.refund(participationId);
    return await tx.wait();
  }
  
  // Utility methods
  getContractAddresses() {
    return CONTRACT_ADDRESSES;
  }
  
  getProvider() {
    return this.provider;
  }
  
  getSigner() {
    return this.signer;
  }
}

module.exports = { R2SSDK, CONTRACT_ADDRESSES, CONTRACT_ABIS };
`;

  fs.writeFileSync(path.join(jsDir, "r2s-sdk.js"), jsContent);
  
  // Create package.json for JavaScript SDK
  const packageJson = {
    name: "@r2s/sdk-js",
    version: "1.0.0",
    description: "R2S Smart Contract JavaScript SDK",
    main: "r2s-sdk.js",
    dependencies: {
      ethers: "^6.0.0"
    }
  };
  
  fs.writeFileSync(
    path.join(jsDir, "package.json"),
    JSON.stringify(packageJson, null, 2)
  );
}

function generateTypeScriptSDK(
  abis: Record<string, any[]>,
  deployment: DeploymentData,
  sdkDir: string
) {
  const tsDir = path.join(sdkDir, "typescript");
  fs.mkdirSync(tsDir, { recursive: true });

  const tsContent = `/**
 * R2S Smart Contract SDK for TypeScript
 * Generated on ${new Date().toISOString()}
 */

import { ethers, Contract, ContractTransactionResponse, JsonRpcProvider, Wallet, Signer } from 'ethers';

// Contract ABIs
export const CONTRACT_ABIS = ${JSON.stringify(abis, null, 2)} as const;

// Contract Addresses (Local Network)
export const CONTRACT_ADDRESSES = {
  MockUSDT: "${deployment.contracts.MockUSDT}",
  R2SCampaign: "${deployment.contracts.R2SCampaign}"
} as const;

// Types
export interface CampaignParams {
  title: string;
  description: string;
  imageUrl: string;
  targetAmount: number | string;
  minDeposit: number | string;
  maxDeposit: number | string;
  discountRate: number; // basis points
  duration: number; // seconds
  settlementPeriod: number; // seconds
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  merchant: string;
  token: string;
  targetAmount: string;
  currentAmount: string;
  minDeposit: string;
  maxDeposit: string;
  discountRate: string;
  startTime: Date;
  endTime: Date;
  settlementDate: Date;
  totalParticipants: string;
  status: number;
  isVerified: boolean;
}

export enum CampaignStatus {
  Draft = 0,
  Pending = 1,
  Active = 2,
  Completed = 3,
  Settling = 4,
  Settled = 5,
  Cancelled = 6
}

export class R2SSDK {
  private provider: JsonRpcProvider;
  private signer: Signer | null;
  private contracts: {
    mockUSDT: Contract;
    r2sCampaign: Contract;
  };

  constructor(providerUrl: string = 'http://localhost:8545', privateKey?: string) {
    this.provider = new ethers.JsonRpcProvider(providerUrl);
    
    if (privateKey) {
      this.signer = new ethers.Wallet(privateKey, this.provider);
    } else {
      this.signer = null;
    }
    
    this.contracts = {} as any;
    this.initializeContracts();
  }
  
  private async initializeContracts(): Promise<void> {
    if (!this.signer) {
      const accounts = await this.provider.listAccounts();
      if (accounts.length > 0) {
        this.signer = await this.provider.getSigner(0);
      }
    }
    
    // Initialize MockUSDT contract
    this.contracts.mockUSDT = new ethers.Contract(
      CONTRACT_ADDRESSES.MockUSDT,
      CONTRACT_ABIS.MockUSDT,
      this.signer || this.provider
    );
    
    // Initialize R2SCampaign contract
    this.contracts.r2sCampaign = new ethers.Contract(
      CONTRACT_ADDRESSES.R2SCampaign,
      CONTRACT_ABIS.R2SCampaign,
      this.signer || this.provider
    );
  }
  
  // MockUSDT Methods
  async mintUSDT(to: string, amount: number | string): Promise<ContractTransactionResponse> {
    const tx = await this.contracts.mockUSDT.mint(
      to, 
      ethers.parseUnits(amount.toString(), 6)
    );
    return await tx.wait();
  }
  
  async getUSDTBalance(address: string): Promise<string> {
    const balance = await this.contracts.mockUSDT.balanceOf(address);
    return ethers.formatUnits(balance, 6);
  }
  
  async approveUSDT(spender: string, amount: number | string): Promise<ContractTransactionResponse> {
    const tx = await this.contracts.mockUSDT.approve(
      spender,
      ethers.parseUnits(amount.toString(), 6)
    );
    return await tx.wait();
  }
  
  // R2SCampaign Methods
  async createCampaign(params: CampaignParams): Promise<bigint | null> {
    const tx = await this.contracts.r2sCampaign.createCampaign(
      params.title,
      params.description,
      params.imageUrl,
      CONTRACT_ADDRESSES.MockUSDT,
      ethers.parseUnits(params.targetAmount.toString(), 6),
      ethers.parseUnits(params.minDeposit.toString(), 6),
      ethers.parseUnits(params.maxDeposit.toString(), 6),
      params.discountRate,
      params.duration,
      params.settlementPeriod
    );
    const receipt = await tx.wait();
    
    // Extract campaign ID from events
    const event = receipt?.logs.find((log: any) => {
      try {
        const parsed = this.contracts.r2sCampaign.interface.parseLog(log);
        return parsed?.name === 'CampaignCreated';
      } catch {
        return false;
      }
    });
    
    if (event) {
      const parsed = this.contracts.r2sCampaign.interface.parseLog(event);
      return parsed?.args[0];
    }
    return null;
  }
  
  async participate(campaignId: number | bigint, amount: number | string): Promise<ContractTransactionResponse> {
    // First approve the campaign contract to spend USDT
    await this.approveUSDT(CONTRACT_ADDRESSES.R2SCampaign, amount);
    
    // Then participate
    const tx = await this.contracts.r2sCampaign.participate(
      campaignId,
      ethers.parseUnits(amount.toString(), 6)
    );
    return await tx.wait();
  }
  
  async getCampaign(campaignId: number | bigint): Promise<Campaign> {
    const campaign = await this.contracts.r2sCampaign.getCampaign(campaignId);
    return {
      id: campaign.id.toString(),
      title: campaign.title,
      description: campaign.description,
      imageUrl: campaign.imageUrl,
      merchant: campaign.merchant,
      token: campaign.token,
      targetAmount: ethers.formatUnits(campaign.targetAmount, 6),
      currentAmount: ethers.formatUnits(campaign.currentAmount, 6),
      minDeposit: ethers.formatUnits(campaign.minDeposit, 6),
      maxDeposit: ethers.formatUnits(campaign.maxDeposit, 6),
      discountRate: campaign.discountRate.toString(),
      startTime: new Date(Number(campaign.startTime) * 1000),
      endTime: new Date(Number(campaign.endTime) * 1000),
      settlementDate: new Date(Number(campaign.settlementDate) * 1000),
      totalParticipants: campaign.totalParticipants.toString(),
      status: Number(campaign.status),
      isVerified: campaign.isVerified
    };
  }
  
  async settleCampaign(campaignId: number | bigint): Promise<ContractTransactionResponse> {
    const tx = await this.contracts.r2sCampaign.settleCampaign(campaignId);
    return await tx.wait();
  }
  
  async refund(participationId: number | bigint): Promise<ContractTransactionResponse> {
    const tx = await this.contracts.r2sCampaign.refund(participationId);
    return await tx.wait();
  }
  
  // Utility methods
  getContractAddresses(): typeof CONTRACT_ADDRESSES {
    return CONTRACT_ADDRESSES;
  }
  
  getProvider(): JsonRpcProvider {
    return this.provider;
  }
  
  getSigner(): Signer | null {
    return this.signer;
  }
}

export default R2SSDK;
`;

  fs.writeFileSync(path.join(tsDir, "r2s-sdk.ts"), tsContent);
  
  // Create package.json for TypeScript SDK
  const packageJson = {
    name: "@r2s/sdk-ts",
    version: "1.0.0",
    description: "R2S Smart Contract TypeScript SDK",
    main: "dist/r2s-sdk.js",
    types: "dist/r2s-sdk.d.ts",
    scripts: {
      build: "tsc"
    },
    dependencies: {
      ethers: "^6.0.0"
    },
    devDependencies: {
      typescript: "^5.0.0",
      "@types/node": "^20.0.0"
    }
  };
  
  fs.writeFileSync(
    path.join(tsDir, "package.json"),
    JSON.stringify(packageJson, null, 2)
  );
  
  // Create tsconfig.json
  const tsConfig = {
    compilerOptions: {
      target: "ES2020",
      module: "commonjs",
      lib: ["ES2020"],
      declaration: true,
      outDir: "./dist",
      rootDir: "./",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true
    },
    include: ["*.ts"],
    exclude: ["node_modules", "dist"]
  };
  
  fs.writeFileSync(
    path.join(tsDir, "tsconfig.json"),
    JSON.stringify(tsConfig, null, 2)
  );
}

function generateGolangSDK(
  abis: Record<string, any[]>,
  deployment: DeploymentData,
  sdkDir: string
) {
  const goDir = path.join(sdkDir, "golang");
  const contractsDir = path.join(goDir, "contracts");
  fs.mkdirSync(contractsDir, { recursive: true });

  // Generate Go bindings for each contract
  for (const [name, abi] of Object.entries(abis)) {
    const goContent = generateGoBinding(name, abi, deployment.contracts[name as keyof typeof deployment.contracts]);
    fs.writeFileSync(
      path.join(contractsDir, `${name.toLowerCase()}.go`),
      goContent
    );
  }

  // Create main SDK file
  const mainSDK = `// Package r2s provides Go bindings for R2S smart contracts
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
	MockUSDT:    common.HexToAddress("${deployment.contracts.MockUSDT}"),
	R2SCampaign: common.HexToAddress("${deployment.contracts.R2SCampaign}"),
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
`;

  fs.writeFileSync(path.join(goDir, "sdk.go"), mainSDK);

  // Create go.mod file
  const goMod = `module github.com/r2s/sdk-go

go 1.21

require (
	github.com/ethereum/go-ethereum v1.13.0
)
`;

  fs.writeFileSync(path.join(goDir, "go.mod"), goMod);

  // Create README for Go SDK
  const goReadme = `# R2S Go SDK

## Installation

\`\`\`bash
go get github.com/r2s/sdk-go
\`\`\`

## Usage

\`\`\`go
package main

import (
    "fmt"
    "log"
    
    r2s "github.com/r2s/sdk-go"
)

func main() {
    // Initialize SDK
    sdk, err := r2s.NewSDK("http://localhost:8545", "your-private-key")
    if err != nil {
        log.Fatal(err)
    }
    
    // Use the SDK
    balance, err := sdk.MockUSDT.BalanceOf(nil, sdk.GetAddresses().MockUSDT)
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("Balance: %s\\n", balance.String())
}
\`\`\`
`;

  fs.writeFileSync(path.join(goDir, "README.md"), goReadme);
}

function generateGoBinding(contractName: string, abi: any[], address: string): string {
  // Simplified Go binding generation
  // In production, you would use abigen tool
  return `// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package r2s

import (
	"math/big"
	"strings"

	ethereum "github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/event"
)

// ${contractName}ABI is the input ABI used to generate the binding from.
const ${contractName}ABI = \`${JSON.stringify(abi)}\`

// ${contractName} is an auto generated Go binding around an Ethereum contract.
type ${contractName} struct {
	${contractName}Caller     // Read-only binding to the contract
	${contractName}Transactor // Write-only binding to the contract
	${contractName}Filterer   // Log filterer for contract events
}

// ${contractName}Caller is an auto generated read-only Go binding around an Ethereum contract.
type ${contractName}Caller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// ${contractName}Transactor is an auto generated write-only Go binding around an Ethereum contract.
type ${contractName}Transactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// ${contractName}Filterer is an auto generated log filtering Go binding around an Ethereum contract events.
type ${contractName}Filterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// ${contractName}Session is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type ${contractName}Session struct {
	Contract     *${contractName}  // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// ${contractName}CallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type ${contractName}CallerSession struct {
	Contract *${contractName}Caller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts          // Call options to use throughout this session
}

// ${contractName}TransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type ${contractName}TransactorSession struct {
	Contract     *${contractName}Transactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts          // Transaction auth options to use throughout this session
}

// ${contractName}Raw is an auto generated low-level Go binding around an Ethereum contract.
type ${contractName}Raw struct {
	Contract *${contractName} // Generic contract binding to access the raw methods on
}

// ${contractName}CallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type ${contractName}CallerRaw struct {
	Contract *${contractName}Caller // Generic read-only contract binding to access the raw methods on
}

// ${contractName}TransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type ${contractName}TransactorRaw struct {
	Contract *${contractName}Transactor // Generic write-only contract binding to access the raw methods on
}

// New${contractName} creates a new instance of ${contractName}, bound to a specific deployed contract.
func New${contractName}(address common.Address, backend bind.ContractBackend) (*${contractName}, error) {
	contract, err := bind${contractName}(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &${contractName}{${contractName}Caller: ${contractName}Caller{contract: contract}, ${contractName}Transactor: ${contractName}Transactor{contract: contract}, ${contractName}Filterer: ${contractName}Filterer{contract: contract}}, nil
}

// bind${contractName} binds a generic wrapper to an already deployed contract.
func bind${contractName}(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := abi.JSON(strings.NewReader(${contractName}ABI))
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, parsed, caller, transactor, filterer), nil
}
`;
}

// Run the SDK generation
generateSDK().catch(console.error);