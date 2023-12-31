import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@typechain/hardhat";
import fs from "fs";
import "@nomicfoundation/hardhat-verify";
import "dotenv/config";

const infuraProjectID = fs.existsSync(".infura") ? fs.readFileSync(".infura").toString().trim() : ""
const mnemonic = fs.existsSync(".mnemonic") ? fs.readFileSync(".mnemonic").toString().trim() : ""
const accounts = {
  mnemonic,
  path: "m/44'/60'/0'/0",
  initialIndex: 0,
  count: 20,
};

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  typechain: {
    outDir: "src/typechain",
  },
  networks: {
    "base-mainnet": {
      url: "https://mainnet.base.org",
      accounts: accounts,
    },
    zkEVM: {
      url: `https://zkevm-rpc.com`,
      accounts: accounts,
    },
    // celo: {
    //   url: "https://forno.celo.org",
    //   accounts: [fs.existsSync(".privateKey") ? fs.readFileSync(".privateKey").toString().trim() : ""],
    //   chainId: 42220
    // },
    gnosis: {
      url: "https://rpc.gnosischain.com",
      accounts: accounts,
    },
    arbitrumOne: {
      url: 'https://arb1.arbitrum.io/rpc',
      accounts: accounts,
    },

    // for testnet
    "base-goerli": {
      url: "https://goerli.base.org",
      accounts: accounts,
      gasPrice: 1000000000,
    },
    goerli: {
      url: "https://goerli.infura.io/v3/" + infuraProjectID,
      accounts: accounts,
    },
  },
  etherscan: {
    apiKey: {
      goerli: process.env.GOERLI_ETHERSCAN_API_KEY || "",
      mainnet: process.env.ETHERSCAN_API_KEY || "",
      "base": process.env.BASE_ETHERSCAN_API_KEY || "",
      polygonZkEVM: process.env.ZKEVM_ETHERSCAN_API_KEY || "",
      celo: process.env.CELO_ETHERSCAN_API_KEY || "",
      gnosis: process.env.GNOSIS_ETHERSCAN_API_KEY || "",
      arbitrumOne: process.env.ARBITRUM_ETHERSCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "gnosis",
        chainId: 100,
        urls: {
          apiURL: "https://api.gnosisscan.io/api",
          browserURL: "https://gnosisscan.io/",
          // Blockscout
          //apiURL: "https://blockscout.com/xdai/mainnet/api",
          //browserURL: "https://blockscout.com/xdai/mainnet",
        },
      },
      {
        network: "celo",
        chainId: 42220,
        urls: {
          apiURL: "https://api.celoscan.io/api",
          browserURL: "https://celoscan.io/",
        },
      }
    ],
  },
  sourcify: {
    // Disabled by default
    // Doesn't need an API key
    enabled: false,
  },
};

export default config;
