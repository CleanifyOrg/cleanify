import { Chain } from "viem";

export type ChainWithSafeConfig = Omit<Chain, "id"> & {
  id: string;
  color?: string;
  icon?: string;
  transactionServiceUrl?: string;
  isStripePaymentsEnabled: boolean;
  isMoneriumPaymentsEnabled: boolean;
  faucetUrl?: string;
  contractAddress: string;
};
