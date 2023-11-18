import { useTrashifyContract } from "@hooks";

export const useSubscribeToClean = () => {
  const { contract } = useTrashifyContract();

  const subscribeToClean = async (reportId: string) => {
    const tx = await contract.subscribeToClean(reportId);

    await tx.wait();
  };
  return { subscribeToClean };
};
