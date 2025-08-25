import { ethers, upgrades, run } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  console.log("Starting R2S deployment...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));
  
  const network = await ethers.provider.getNetwork();
  console.log("Network:", network.name, "Chain ID:", network.chainId);
  
  // Configuration
  const config = {
    kairos: {
      usdt: "0x6b519E2b90Ba5f1cF9fa27629904D5DA4C653F9e", // Kairos USDT (if exists)
      treasury: process.env.TREASURY_ADDRESS || deployer.address,
      feeCollector: process.env.FEE_COLLECTOR_ADDRESS || deployer.address
    },
    cypress: {
      usdt: "0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167", // Cypress oUSDT
      treasury: process.env.TREASURY_ADDRESS || deployer.address,
      feeCollector: process.env.FEE_COLLECTOR_ADDRESS || deployer.address
    },
    hardhat: {
      usdt: "", // Will be deployed
      treasury: deployer.address,
      feeCollector: deployer.address
    }
  };
  
  const networkName = network.chainId === 1001n ? "kairos" : 
                      network.chainId === 8217n ? "cypress" : "hardhat";
  const networkConfig = config[networkName as keyof typeof config];
  
  // Deploy contracts
  const contracts: any = {};
  
  try {
    // 1. Deploy MockUSDT (for testnet)
    if (networkName === "hardhat" || networkName === "kairos") {
      console.log("\n1. Deploying MockUSDT...");
      const MockUSDT = await ethers.getContractFactory("MockUSDT");
      const mockUSDT = await MockUSDT.deploy();
      await mockUSDT.waitForDeployment();
      contracts.MockUSDT = await mockUSDT.getAddress();
      networkConfig.usdt = contracts.MockUSDT;
      console.log("MockUSDT deployed to:", contracts.MockUSDT);
    }
    
    // 2. Deploy R2SCampaign
    console.log("\n2. Deploying R2SCampaign...");
    const R2SCampaign = await ethers.getContractFactory("R2SCampaign");
    const campaign = await upgrades.deployProxy(R2SCampaign, [
      deployer.address,
      networkConfig.feeCollector,
      networkConfig.treasury
    ]);
    await campaign.waitForDeployment();
    contracts.R2SCampaign = await campaign.getAddress();
    console.log("R2SCampaign deployed to:", contracts.R2SCampaign);
    
    // Configuration
    console.log("\n3. Configuring contracts...");
    
    // Whitelist USDT in campaign
    const campaignContract = await ethers.getContractAt("R2SCampaign", contracts.R2SCampaign);
    await campaignContract.whitelistToken(networkConfig.usdt, true);
    console.log("Whitelisted USDT in R2SCampaign");
    
    // Save deployment addresses
    const deploymentData = {
      network: networkName,
      chainId: network.chainId.toString(),
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      contracts: contracts,
      configuration: networkConfig
    };
    
    const deploymentPath = path.join(__dirname, `../deployments/${network.chainId}.json`);
    fs.mkdirSync(path.dirname(deploymentPath), { recursive: true });
    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentData, null, 2));
    console.log(`\nDeployment data saved to ${deploymentPath}`);
    
    // Verify contracts (only on Kaia networks)
    if (networkName === "kairos" || networkName === "cypress") {
      console.log("\n4. Verifying contracts...");
      
      for (const [name, address] of Object.entries(contracts)) {
        try {
          await run("verify:verify", {
            address: address,
            constructorArguments: name === "MockUSDT" ? [] : undefined,
          });
          console.log(`${name} verified successfully`);
        } catch (error: any) {
          if (error.message.includes("Already Verified")) {
            console.log(`${name} already verified`);
          } else {
            console.error(`Failed to verify ${name}:`, error.message);
          }
        }
      }
    }
    
    console.log("\n✅ Deployment completed successfully!");
    console.log("\nContract Addresses:");
    console.log("===================");
    for (const [name, address] of Object.entries(contracts)) {
      console.log(`${name}: ${address}`);
    }
    
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});