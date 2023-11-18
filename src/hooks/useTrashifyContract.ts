import { useAccountAbstraction } from "@store";
import { useMemo } from "react";
import { Trashify__factory as TrashifyFactory } from "@/typechain";
import { useWeb3Provider } from "@hooks/useWeb3Provider.ts";

export const useTrashifyContract = () => {
  const { chain } = useAccountAbstraction();
  const { providerOrSigner } = useWeb3Provider();

  const contract = useMemo(() => {
    return TrashifyFactory.connect(chain.contractAddress, providerOrSigner);
  }, [chain.contractAddress, providerOrSigner]);

  return {
    contract,
    providerOrSigner,
  };
};
