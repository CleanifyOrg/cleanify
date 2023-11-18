import {useCallback, useEffect, useState} from "react";
import {getFromIPFS} from "@/utils";
import {BaseReport, ReportMetadata} from "@models/report.ts"

export const useReportMetadata = (baseReport: BaseReport) => {
  const [report,setReport] = useState<BaseReport>(baseReport)

  const fetchMetadata = useCallback(async (baseReport: BaseReport) => {
    const metadata = JSON.parse(await getFromIPFS(baseReport.metadata)) as ReportMetadata;

    metadata.images = await Promise.all(
      metadata.images.map((image) => getFromIPFS(image))
    );

    setReport({
      ...baseReport,
      metadata,
    })
  }, []);

  useEffect(() => {
    fetchMetadata(baseReport).catch((e) => {
      console.error("Error fetching metadata:", e);
    });
  }, [fetchMetadata, baseReport]);

  return {
    report
  };
};
