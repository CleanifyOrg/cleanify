import { testnets } from "./testnets";
import { mainnets } from "./mainnets";

export * from "./mainnets";
export * from "./testnets";

export const chains = [...mainnets, ...testnets];

export const getChain = (chainId?: string) => {
  const chain = chains.find((_chain) => _chain.id === chainId);

  return chain;
};
