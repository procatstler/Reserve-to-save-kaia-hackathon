import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("PRIVATE_KEY not set in .env file");
  }

  // Kairos RPC URL
  const provider = new ethers.JsonRpcProvider("https://public-en-kairos.node.kaia.io");
  
  // Create wallet from private key
  const wallet = new ethers.Wallet(privateKey, provider);
  
  console.log("Checking Kairos Testnet Account...");
  console.log("Address:", wallet.address);
  
  // Get balance
  const balance = await provider.getBalance(wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "KAIA");
  
  // Check if balance is sufficient for deployment
  const minRequired = ethers.parseEther("0.1"); // 0.1 KAIA minimum recommended
  if (balance < minRequired) {
    console.log("\n⚠️  Warning: Balance might be insufficient for deployment");
    console.log("Recommended minimum: 0.1 KAIA");
    console.log("Get testnet KAIA from: https://faucet.kaia.io/");
  } else {
    console.log("\n✅ Balance is sufficient for deployment");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});