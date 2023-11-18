import { BaseReport } from "@/models/report";
import { Trashify } from "@/typechain/contracts/Trashify";

export const queryReports = async (contract: Trashify) => {
    const totalReports = await contract.totalReports();

    console.log("totalReports: ", totalReports.toNumber());

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
                totalRewards: report.totalRewards.toNumber(),
                state: report.state,
            };

            return baseReport;
        });
    });

    return allReports;

};