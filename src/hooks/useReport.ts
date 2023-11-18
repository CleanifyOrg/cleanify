import { useReportList } from "./useReportList";

export const useReport = (reportId?: number) => {
  const reports = useReportList();
  return reports.find((report) => report.id === reportId);
};
