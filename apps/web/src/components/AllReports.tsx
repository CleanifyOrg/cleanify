import { useTrashifyReports } from "@hooks";
import { TrashifyReport } from "@components/TrashifyReport.tsx";
import { useEffect } from "react";

export function AllReports() {
  const { baseReports } = useTrashifyReports();

  useEffect(() => {
    console.log("reports", baseReports);
  }, [baseReports]);

  return (
    <>
      {baseReports.map((report) => <TrashifyReport key={report.id.toString()} report={report} />)}
    </>
  );
}
