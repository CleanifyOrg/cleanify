import { useReportMetadata } from "@hooks/useReportMetadata.ts";
import { BaseReport } from "@models/report.ts";
import { useEffect, useState } from "react";
import { useCleanifyContract } from "@hooks/useCleanifyContract.ts";

export const useReportById = (id: number) => {
  const { contract } = useCleanifyContract();

  const [baseReport, setBaseReport] = useState<BaseReport>();

  const { report } = useReportMetadata(baseReport);

  const getReport = async () => {
    if (contract) {
      contract.getReportById(id).then((baseReport) => {
        setBaseReport({
          id: baseReport.id.toNumber(),
          creator: baseReport.creator,
          metadata: baseReport.metadata,
          totalRewards: baseReport.totalRewards.toNumber(),
          state: baseReport.state,
        });
      });
    }
  };

  useEffect(() => {
    getReport();
  }, []);

  return {
    report,
  };
};
