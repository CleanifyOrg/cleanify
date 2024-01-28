import { testnets } from "./testnets";
import { mainnets } from "./mainnets";

export * from "./mainnets";
export * from "./testnets";

export const getChain = (chainId?: string) => {
  const chain = chains.find((chain) => chain.id === chainId);

  return chain;
};

export const chains = [...mainnets, ...testnets];
