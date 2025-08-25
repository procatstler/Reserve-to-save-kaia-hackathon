import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          },
          viaIR: true
        }
      },
      {
        version: "0.8.22",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          },
          viaIR: true
        }
      }
    ]
  },
  networks: {
    hardhat: {
      chainId: 31337
    },
    kairos: {
      url: process.env.KAIROS_RPC_URL || "https://public-en-kairos.node.kaia.io",
      chainId: 1001,
      accounts: process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length === 64 ? [`0x${process.env.PRIVATE_KEY}`] : process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.startsWith('0x') ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 250000000000, // 250 ston
      gas: 8500000
    },
    cypress: {
      url: process.env.CYPRESS_RPC_URL || "https://public-en-cypress.klaytn.net",
      chainId: 8217,
      accounts: process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length === 64 ? [`0x${process.env.PRIVATE_KEY}`] : process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.startsWith('0x') ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 250000000000,
      gas: 8500000
    }
  },
  etherscan: {
    apiKey: {
      kairos: process.env.KAIASCOPE_API_KEY || "",
      cypress: process.env.KAIASCOPE_API_KEY || ""
    },
    customChains: [
      {
        network: "kairos",
        chainId: 1001,
        urls: {
          apiURL: "https://api-kairos.kaiascope.com/api",
          browserURL: "https://kairos.kaiascope.com"
        }
      },
      {
        network: "cypress",
        chainId: 8217,
        urls: {
          apiURL: "https://api.kaiascope.com/api",
          browserURL: "https://kaiascope.com"
        }
      }
    ]
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    gasPrice: 250,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    only: []
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
};

export default config;