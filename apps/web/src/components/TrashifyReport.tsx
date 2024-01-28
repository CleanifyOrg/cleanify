import { useReportMetadata } from "@hooks";
import { BaseReport } from "@models/report.ts";

type ITrashifyReport = {
  baseReport: BaseReport;
};

export function TrashifyReport({ baseReport }: ITrashifyReport) {
  const { report } = useReportMetadata(baseReport);

  console.log(report);

  return <></>;
}
