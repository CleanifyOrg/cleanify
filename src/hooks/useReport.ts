import { useReports } from "@/api/hooks";

export const useReport = (reportId?: number) => {
    const { data: reports } = useReports();
    return reports?.find((report) => report.id === reportId);
};
