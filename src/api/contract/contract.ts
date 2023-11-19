import { BaseReport, Report, ReportMetadata } from "@/models/report";
import { Cleanify } from "@/typechain";
import { getFromIPFS } from "@/utils";

export const queryReports = async (contract: Cleanify) => {
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

export const getReportMetadata = async (baseReport: BaseReport) => {
    const metadata: ReportMetadata = JSON.parse(
        await getFromIPFS(baseReport.metadata)
    );

    metadata.images = await Promise.all(
        metadata.images.map((image) => getFromIPFS(image))
    );

    const report: Report = {
        ...baseReport,
        metadata,
    };

    report.metadata.location;

    return report;
};
