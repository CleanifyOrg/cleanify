import { useTrashifyContract } from "@hooks/useTrashifyContract.ts";
import { useEffect, useState } from "react";
import { Trashify } from "@/typechain";
import { TrashifyReport } from "@models";
import { BigNumberish } from "ethers";

export const useTrashifyReports = () => {
  const { contract } = useTrashifyContract();
  const [reports, setReports] = useState<TrashifyReport[]>([]);

  const queryReports = async (contract: Trashify) => {
    const totalReports = await contract.totalReports();

    console.log("totalReports: ", totalReports.toNumber());

    const allReports = await Promise.all(
      Array.from(Array(totalReports.toNumber()).keys()).map((i) =>
        contract.reports(i)
      )
    ).then((reports) => {
      return reports.map((report) => {
        return {
          id: report.id.toNumber(),
          creator: report.creator,
          metadata: report.metadata,
          totalRewards: report.totalRewards,
          state: report.state,
        };
      });
    });

    setReports(allReports);
  };

  useEffect(() => {
    setReports([]);
    queryReports(contract);
  }, [contract]);

  return {
    reports,
  };
};
