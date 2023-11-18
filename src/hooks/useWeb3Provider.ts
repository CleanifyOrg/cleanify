import { useAccountAbstraction } from "@store";
import { useMemo } from "react";
import { ethers } from "ethers";

export const useWeb3Provider = () => {
  const { web3Provider, chain, relayTransaction } = useAccountAbstraction();

  const providerOrSigner = useMemo(() => {
    if (web3Provider) {
      const signer = web3Provider.getSigner();

      //TODO: Uncomment below to use relayer
      // signer.sendTransaction = async (
      //   transaction: ethers.providers.TransactionRequest
      // ): Promise<ethers.providers.TransactionResponse> => {
      //   const txHash = await relayTransaction({
      //     data: transaction.data,
      //     to: transaction.to,
      //     value: transaction.value,
      //   });
      //
      //   return await signer.provider.getTransaction(txHash);
      // };

      return signer;
    } else {
      return new ethers.providers.JsonRpcProvider(
        chain.rpcUrls.default.http[0]
      );
    }
  }, [web3Provider, chain]);

  return {
    providerOrSigner,
  };
};
