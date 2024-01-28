import { ChainWithSafeConfig } from "@models";
import {
  polygonZkEvm,
  base,
  gnosis,
  arbitrum,
  mainnet,
  celo,
} from "viem/chains";
import { ethers } from "ethers";
import { toHexString } from "@/utils";

const baseWithSafeConfig: ChainWithSafeConfig = {
  ...base,
  id: toHexString(base.id),
  isStripePaymentsEnabled: false,
  isMoneriumPaymentsEnabled: false,
  color: "#3e6957",
  transactionServiceUrl: "https://safe-transaction-base.safe.global",
  icon: "/icons/base.png",
  contractAddress: "0x8fc968b4ef4d50798b45e7c734a452d83e04b014",
};

const celoWithSafeConfig: ChainWithSafeConfig = {
  ...celo,
  id: toHexString(celo.id),
  isStripePaymentsEnabled: false,
  isMoneriumPaymentsEnabled: false,
  transactionServiceUrl: "https://safe-transaction-celo.safe.global",
  icon: "/icons/celo-logo.png",
  contractAddress: "0x151892c5dcf44afe384d09c4ff9b54012ac441c2",
};

const gnosisWithSafeConfig: ChainWithSafeConfig = {
  ...gnosis,
  id: toHexString(gnosis.id),
  isStripePaymentsEnabled: false,
  isMoneriumPaymentsEnabled: false,
  color: "#3e6957",
  transactionServiceUrl: "https://safe-transaction-gnosis-chain.safe.global",
  icon: "/icons/gnosis.png",
  contractAddress: "0x151892c5dcf44afe384d09c4ff9b54012ac441c2",
};

const polygonZkEvmWithSafeConfig: ChainWithSafeConfig = {
  ...polygonZkEvm,
  id: toHexString(polygonZkEvm.id),
  isStripePaymentsEnabled: false,
  isMoneriumPaymentsEnabled: false,
  color: "#8248E5",
  transactionServiceUrl: "https://safe-transaction-zkevm.safe.global",
  icon: "/icons/zkevm.png",
  contractAddress: "0x8fc968b4ef4d50798b45e7c734a452d83e04b014",
};

const arbitrumWithSafeConfig: ChainWithSafeConfig = {
  ...arbitrum,
  id: toHexString(arbitrum.id),
  isStripePaymentsEnabled: false,
  isMoneriumPaymentsEnabled: false,
  color: "#3e6957",
  transactionServiceUrl: "https://safe-transaction-arbitrum.safe.global",
  icon: "/icons/arbitrum.png",
  contractAddress: "0x8fc968b4ef4d50798b45e7c734a452d83e04b014",
};

const mainnetWithSafeConfig: ChainWithSafeConfig = {
  ...mainnet,
  id: toHexString(mainnet.id),
  isStripePaymentsEnabled: false,
  isMoneriumPaymentsEnabled: false,
  color: "#DDDDDD",
  transactionServiceUrl: "https://safe-transaction-mainnet.safe.global",
  icon: "/icons/ethereum.png",
  // TODO
  contractAddress: ethers.constants.AddressZero,
};

export const mainnets: ChainWithSafeConfig[] = [
  celoWithSafeConfig,
  // mainnetWithSafeConfig,
  polygonZkEvmWithSafeConfig,
  // zkSyncWithSafeConfig,
  baseWithSafeConfig,
  gnosisWithSafeConfig,
  arbitrumWithSafeConfig,
];

export const defaultMainnetChain = baseWithSafeConfig;
