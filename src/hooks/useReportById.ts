import { useReportMetadata } from "@hooks/useReportMetadata.ts";
import { BaseReport } from "@models/report.ts";
import { useCallback, useEffect, useState } from "react";
import { useCleanifyContract } from "@hooks/useCleanifyContract.ts";

export const useReportById = (id: number) => {
    const { contract } = useCleanifyContract();

    const [baseReport, setBaseReport] = useState<BaseReport>();

    const { report } = useReportMetadata(baseReport);

    const getReport = useCallback(async () => {
        contract.getReportById(id).then((baseReport) => {
            setBaseReport(undefined);
            setBaseReport({
                id: baseReport.id.toNumber(),
                creator: baseReport.creator,
                metadata: baseReport.metadata,
                totalRewards: baseReport.totalRewards.toString(),
                state: baseReport.state,
            });
        });
    }, [contract, id]);

    useEffect(() => {
        getReport();
    }, [getReport]);

    const refreshReport = () => {
        getReport();
    };

    return {
        report,
        refreshReport,
    };
};
