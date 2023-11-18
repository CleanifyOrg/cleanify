import { useTrashifyReports } from "@hooks";
import { TrashifyReport } from "@components/TrashifyReport.tsx";
import { useEffect } from "react";

export const AllReports = () => {
  const { reports } = useTrashifyReports();

  useEffect(() => {
    console.log("reports", reports);
  }, [reports]);

  return (
    <>
      {reports.map((report) => {
        return <TrashifyReport key={report.id.toString()} report={report} />;
      })}
    </>
  );
};
