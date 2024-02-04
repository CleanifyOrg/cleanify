import {
    BaseReport,
    Report,
    ReportMetadata,
    ReportWithProofs,
} from "@/models/report";
import { Cleanify } from "@/typechain";
import { getFromIPFS } from "@/utils";

/**
 *  Query all reports from the Cleanify contract
 * @param contract  Cleanify contract instance
 * @returns
 */
export const queryReports = async (contract: Cleanify) => {
    const totalReports = await contract.totalReports();

    console.log("totalReports: ", totalReports.toNumber());

    const allReports: BaseReport[] = await Promise.all(
        Array.from(Array(totalReports.toNumber()).keys()).map((i) =>
            contract.reports(i)
        )
    ).then((reports) =>
        reports.map((report) => {
            const baseReport: BaseReport = {
                id: report.id.toNumber(),
                creator: report.creator,
                metadata: report.metadata,
                totalRewards: report.totalRewards.toString(),
                state: report.state,
            };

            return baseReport;
        })
    );

    return allReports;
};

/**
 *  Get the metadata of a report from IPFS
 * @param baseReport the report to get metadata for
 * @returns  the report with metadata
 */
export const getReportMetadata = async (baseReport: BaseReport) => {
    const metadata: ReportMetadata = JSON.parse(
        await getFromIPFS(baseReport.metadata)
    );

    metadata.images = await Promise.all(
        metadata.images.map((image) => getFromIPFS(image))
    );

    return metadata;
};

/**
 *  Get a report by id from the Cleanify contract
 * @param contract  the Cleanify contract instance
 * @param id  the id of the report to get
 * @returns  the report info from the contract
 */
export const getReportById = async (
    contract: Cleanify,
    id: number
): Promise<ReportWithProofs> => {
    const report = await contract.getReportById(id);
    return {
        id: report.id.toNumber(),
        creator: report.creator,
        metadata: report.metadata,
        totalRewards: report.totalRewards.toString(),
        state: report.state,
        proofs: report.proofs,
    };
};
