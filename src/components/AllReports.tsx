import { TrashifyReport } from "@components/TrashifyReport.tsx";
import { useEffect } from "react";
import { useReports } from "@/api/hooks";

export const AllReports = () => {
  const { data: reports } = useReports();

  useEffect(() => {
    console.log("reports", reports);
  }, [reports]);

  return (
    <>
      {reports?.map((report) => {
        return <TrashifyReport key={report.id.toString()} report={report} />;
      })}
    </>
  );
};
