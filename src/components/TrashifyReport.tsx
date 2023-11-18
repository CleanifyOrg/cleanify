import { TrashifyReport as Report, useReportMetadata } from "@hooks";
import {BaseReport} from "@models/report.ts"

type ITrashifyReport = {
  baseReport: BaseReport;
};

export const TrashifyReport = ({ baseReport }: ITrashifyReport) => {
  const { report } = useReportMetadata(baseReport);

  console.log(report)

  return <></>;
};
