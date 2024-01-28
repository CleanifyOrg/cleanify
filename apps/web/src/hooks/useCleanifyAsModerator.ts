import { useAccountAbstraction, useCurrentChain } from "@store";
import { useMemo } from "react";
import { ethers } from "ethers";
import { Cleanify__factory as CleanifyFactory } from "@/typechain";

export const useCleanifyAsModerator = () => {
    const { web3Provider } = useAccountAbstraction();
    const chain = useCurrentChain();

    const provider = useMemo(() => {
        if (web3Provider) {
            return web3Provider.getSigner();
        } 
            return new ethers.providers.JsonRpcProvider(
                chain.rpcUrls.default.http[0]
            );
        
    }, [web3Provider, chain]);

    const contract = useMemo(() => CleanifyFactory.connect(chain.contractAddress, provider), [chain.contractAddress, provider]);

    return {
        contractAsModerator: contract,
        provider,
    };
};
