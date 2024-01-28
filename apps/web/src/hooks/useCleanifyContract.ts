import { useCurrentChain } from "@store";
import { useMemo } from "react";
import { useWeb3Provider } from "@hooks/useWeb3Provider.ts";
import { Cleanify__factory as CleanifyFactory } from "@/typechain";

export const useCleanifyContract = () => {
    const chain = useCurrentChain();
    const { providerOrSigner } = useWeb3Provider();

    const contract = useMemo(() => CleanifyFactory.connect(chain.contractAddress, providerOrSigner), [chain, providerOrSigner]);

    return {
        contract,
        providerOrSigner,
        chain,
    };
};
