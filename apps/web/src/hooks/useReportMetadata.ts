import { useCallback, useEffect, useState } from "react";
import { getFromIPFS, isIpfsCid } from "@/utils";
import { BaseReport, ReportMetadata, Report } from "@models/report.ts";

export const useReportMetadata = (baseReport?: BaseReport) => {
  const [report, setReport] = useState<Report>();

  const fetchMetadata = useCallback(async (baseReport: BaseReport) => {
    const metadata: ReportMetadata = JSON.parse(
      await getFromIPFS(baseReport.metadata)
    );

    metadata.images = await Promise.all(
      metadata.images.map((image) => {
        if (isIpfsCid(image)) return getFromIPFS(image);

        return image;
      })
    );

    const report: Report = {
      ...baseReport,
      metadata,
    };

    report.metadata.location;

    setReport(report);
  }, []);

  useEffect(() => {
    if (baseReport)
      fetchMetadata(baseReport).catch((e) => {
        console.error("Error fetching metadata:", e);
      });
  }, [fetchMetadata, baseReport]);

  return {
    report,
  };
};
