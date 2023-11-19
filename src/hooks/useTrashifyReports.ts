import { useCleanifyContract } from "@hooks/useCleanifyContract.ts";
import { useEffect, useState } from "react";
import { Cleanify } from "@/typechain";
import { BaseReport } from "@models/report.ts";
import { useAccountAbstraction } from "@store"

export const useTrashifyReports = () => {
    const { chain } = useAccountAbstraction();
    const { contract } = useCleanifyContract();
    const [baseReports, setBaseReports] = useState<BaseReport[]>([]);

    const queryReports = async (contract: Cleanify) => {
        const totalReports = await contract.totalReports();

        const allReports: BaseReport[] = await Promise.all(
            Array.from(Array(totalReports.toNumber()).keys()).map((i) =>
                contract.reports(i)
            )
        ).then((reports) => {
            return reports.map((report) => {
                const baseReport: BaseReport = {
                    id: report.id.toNumber(),
                    creator: report.creator,
                    metadata: report.metadata,
                    totalRewards: report.totalRewards.toString(),
                    state: report.state,
                };

                return baseReport;
            });
        });

        setBaseReports(allReports);
    };

    useEffect(() => {
        setBaseReports([]);
        queryReports(contract);
    }, [contract, chain]);

    return {
        baseReports,
    };
};
