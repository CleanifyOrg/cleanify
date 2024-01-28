import { useReportMetadata } from "@hooks/useReportMetadata.ts";
import { BaseReport } from "@models/report.ts";
import { useCallback, useEffect, useState } from "react";
import { useCleanifyContract } from "@hooks/useCleanifyContract.ts";

export const useReportById = (id: number) => {
  const { contract } = useCleanifyContract();

  const [baseReport, setBaseReport] = useState<BaseReport>();

  const { report } = useReportMetadata(baseReport);

  const getReport = useCallback(async () => {
    contract.getReportById(id).then((_baseReport) => {
      setBaseReport(undefined);
      setBaseReport({
        id: _baseReport.id.toNumber(),
        creator: _baseReport.creator,
        metadata: _baseReport.metadata,
        totalRewards: _baseReport.totalRewards.toString(),
        state: _baseReport.state,
      });
    });
  }, [contract, id]);

  useEffect(() => {
    getReport();
  }, [getReport]);

  const refreshReport = () => {
    getReport();
  };

  return {
    report,
    refreshReport,
  };
};
