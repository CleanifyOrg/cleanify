import { toHexString } from "@/utils";
import { ChainWithSafeConfig } from "@models";
import { baseGoerli, goerli } from "viem/chains";

const baseGoerliWithSafeConfig: ChainWithSafeConfig = {
  ...baseGoerli,
  id: toHexString(baseGoerli.id),
  isStripePaymentsEnabled: false,
  isMoneriumPaymentsEnabled: false,
  transactionServiceUrl: "https://safe-transaction-base-testnet.safe.global",
  color: "#3e6957",
  icon: "/icons/base.png",
  contractAddress: "0xa4a3f1fa20995f9bf9805f226db4e5a042f8628b",
};

const goerliWithSafeConfig: ChainWithSafeConfig = {
  ...goerli,
  id: toHexString(goerli.id),
  color: "#fbc02d",
  transactionServiceUrl: "https://safe-transaction-goerli.safe.global",
  isStripePaymentsEnabled: false,
  isMoneriumPaymentsEnabled: true,
  icon: "/icons/ethereum.png",
  contractAddress: "0xa4a3f1fa20995f9bf9805f226db4e5a042f8628b",
};

export const testnets: ChainWithSafeConfig[] = [
  baseGoerliWithSafeConfig,
  goerliWithSafeConfig,
];

export const defaultTestnetChain = goerliWithSafeConfig;
