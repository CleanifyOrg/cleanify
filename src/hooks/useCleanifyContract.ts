import { useCurrentChain } from "@store";
import { useMemo } from "react";
import { Cleanify__factory as CleanifyFactory } from "@/typechain";
import { useWeb3Provider } from "@hooks/useWeb3Provider.ts";

export const useCleanifyContract = () => {
    const chain = useCurrentChain();
    const { providerOrSigner } = useWeb3Provider();

    const contract = useMemo(() => {
        return CleanifyFactory.connect(chain.contractAddress, providerOrSigner);
    }, [chain, providerOrSigner]);

    return {
        contract,
        providerOrSigner,
        chain,
    };
};
