import { useTrashifyContract } from "@hooks/useTrashifyContract.ts";
import { useEffect, useState } from "react";
import { Trashify } from "@/typechain";
import {BaseReport} from "@models/report.ts"

export const useTrashifyReports = () => {
  const { contract } = useTrashifyContract();
  const [baseReports, setBaseReports] = useState<BaseReport[]>([]);

  const queryReports = async (contract: Trashify) => {
    const totalReports = await contract.totalReports();

    console.log("totalReports: ", totalReports.toNumber());

    const allReports: BaseReport[] = await Promise.all(
      Array.from(Array(totalReports.toNumber()).keys()).map((i) =>
        contract.reports(i)
      )
    ).then((reports) => {
      return reports.map((report) => {
        const baseReport: BaseReport = {
          id: report.id.toNumber(),
          creator: report.creator,
          metadata: report.metadata,
          totalRewards: report.totalRewards,
          state: report.state,
        };

        return baseReport;
      });
    });

    setBaseReports(allReports);
  };

  useEffect(() => {
    setBaseReports([]);
    queryReports(contract);
  }, [contract]);

  return {
    baseReports,
  };
};
