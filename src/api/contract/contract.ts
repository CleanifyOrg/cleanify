import { Trashify } from "@/typechain";

export const getAllReports = async (contract: Trashify) => {
    const totalReports = await contract.totalReports();

    console.log("totalReports: ", totalReports.toNumber());

    const allReports = await Promise.all(
        Array.from(Array(totalReports.toNumber()).keys()).map((i) =>
            contract.reports(i)
        )
    ).then((reports) => {
        return reports.map((report) => {
            return {
                id: report.id.toNumber(),
                creator: report.creator,
                metadata: report.metadata,
                totalRewards: report.totalRewards,
                state: report.state,
            };
        });
    });

    return allReports;
};