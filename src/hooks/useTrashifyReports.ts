import { useTrashifyContract } from "@hooks/useTrashifyContract.ts";
import { useEffect, useState } from "react";
import { Trashify } from "@/typechain";
import { TrashifyReport } from "@models";

export const useTrashifyReports = () => {
  const { contract } = useTrashifyContract();
  const [reports, setReports] = useState<TrashifyReport[]>([]);

  const queryReports = async (contract: Trashify) => {
    const totalReports = await contract.totalReports();

    console.log("totalReports: ", totalReports.toNumber());

    for (let i = 0; i < totalReports.toNumber(); i++) {
      const report = await contract.reports(i);

      setReports((reports) => [
        ...reports,
        {
          totalRewards: report.totalRewards,
          id: report.id,
          creator: report.creator,
          metadata: report.metadata,
          state: report.state,
        },
      ]);
    }
  };

  useEffect(() => {
    setReports([]);
    queryReports(contract);
  }, [contract]);

  return {
    reports,
  };
};
