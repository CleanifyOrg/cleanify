import { useCleanifyContract } from "@hooks/useCleanifyContract.ts";
import { useEffect, useState } from "react";
import { useAccountAbstraction } from "@store";

export const useHasSubscribed = (id: number) => {
  const [hasSubscribed, setHasSubscribed] = useState<boolean>(false);

  const { contract } = useCleanifyContract();

  const { getSafeAccount, ownerAddress } = useAccountAbstraction();

  const checkCanClean = async () => {
    if (!ownerAddress) return

    console.log("ownerAddress: ", ownerAddress);

    const isSubscribed = await contract.isUserSubscribedAsCleaner(
      id,
      ownerAddress
    );

    console.log("isSubscribed: ", isSubscribed, ownerAddress);

    setHasSubscribed(isSubscribed);
  };

  useEffect(() => {
    checkCanClean();
  }, [id, getSafeAccount, ownerAddress]);

  return {
    hasSubscribed,
  };
};
