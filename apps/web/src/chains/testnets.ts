import { ChainWithSafeConfig } from "@models";
import { baseGoerli, goerli } from "viem/chains";
import { toHexString } from "@/utils";

const baseGoerliWithSafeConfig: ChainWithSafeConfig = {
  ...baseGoerli,
  id: toHexString(baseGoerli.id),
  isStripePaymentsEnabled: false,
  isMoneriumPaymentsEnabled: false,
  transactionServiceUrl: "https://safe-transaction-base-testnet.safe.global",
  color: "#3e6957",
  icon: "/icons/base.png",
  contractAddress: "0xd4e71f1409a81e3a7af9c8cde7a400cb83d6f2fe",
};

const goerliWithSafeConfig: ChainWithSafeConfig = {
  ...goerli,
  id: toHexString(goerli.id),
  color: "#fbc02d",
  transactionServiceUrl: "https://safe-transaction-goerli.safe.global",
  isStripePaymentsEnabled: false,
  isMoneriumPaymentsEnabled: true,
  icon: "/icons/ethereum.png",
  contractAddress: "0x45a89a58b17177663976a1877818e16284826df5",
};

export const testnets: ChainWithSafeConfig[] = [
  baseGoerliWithSafeConfig,
  goerliWithSafeConfig,
];

export const defaultTestnetChain = goerliWithSafeConfig;
