import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@typechain/hardhat"

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  typechain: {
    outDir: "src/typechain",
  }
};

export default config;