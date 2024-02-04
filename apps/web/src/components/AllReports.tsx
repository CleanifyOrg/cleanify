import { TrashifyReport } from "@components/TrashifyReport.tsx";
import { useEffect } from "react";
import { useReports } from "@/api/contract";

export function AllReports() {
    const { data: reports } = useReports();

    useEffect(() => {
        console.log("reports", reports);
    }, [reports]);

    return (
        <>
            {reports?.map((report) => (
                <TrashifyReport key={report.id.toString()} report={report} />
            ))}
        </>
    );
}
