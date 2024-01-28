import { useAccountAbstraction, useCurrentChain } from "@store";
import { useMemo } from "react";
import { ethers } from "ethers";

export const useWeb3Provider = () => {
    const { web3Provider, relayTransaction } = useAccountAbstraction();
    const chain = useCurrentChain();

    const providerOrSigner = useMemo(() => {
        if (web3Provider) {
            const signer = web3Provider.getSigner();

            // signer.sendTransaction = async (
            //   transaction: ethers.providers.TransactionRequest
            // ): Promise<ethers.providers.TransactionResponse> => {
            //   const txHash = await relayTransaction({
            //     data: transaction.data
            //       ? ethers.utils.hexlify(transaction.data)
            //       : "0x",
            //     to: transaction.to ? transaction.to : "",
            //     value: transaction.value
            //       ? ethers.utils.hexlify(transaction.value)
            //       : "0x0",
            //   });
            //
            //   return await signer.provider.getTransaction(txHash);
            // };

            return signer;
        } 
            return new ethers.providers.JsonRpcProvider(
                chain.rpcUrls.default.http[0]
            );
        
    }, [web3Provider, chain]);

    return {
        providerOrSigner,
    };
};
