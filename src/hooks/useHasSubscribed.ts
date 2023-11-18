import { useCleanifyContract } from "@hooks/useCleanifyContract.ts";
import { useEffect, useState } from "react";
import { useAccountAbstraction } from "@store";

export const useHasSubscribed = (id: number) => {
  const [hasSubscribed, setHasSubscribed] = useState<boolean>(false);

  const { contract } = useCleanifyContract();

  const { getSafeAccount } = useAccountAbstraction();

  const checkCanClean = async () => {
    const ownerAddress = await getSafeAccount();

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
  }, [id, getSafeAccount]);

  return {
    hasSubscribed,
  };
};
