import { useCleanifyContract } from "@hooks/useCleanifyContract.ts";
import { uploadToIpfs } from "@utils";
import { ReportMetadata } from "@models/report.ts";
import { NewReportSubmitedEvent } from "@/typechain/contracts/Trashify";

export const useSubmitReport = () => {
    const { contract } = useCleanifyContract();
    const createReport = async (
        metadata: ReportMetadata
    ): Promise<NewReportSubmitedEvent> => {
        metadata.images = await Promise.all(
            metadata.images.map((image) => uploadToIpfs(image))
        );

        const metadataUri = await uploadToIpfs(JSON.stringify(metadata));

        const tx = await contract.submitReport(metadataUri);

        const receipt = await tx.wait();

        console.log({ receipt });

        const events = await contract.queryFilter(
            contract.filters.NewReportSubmited(),
            receipt.blockNumber,
            receipt.blockNumber
        );

        return events.filter((event) => event.transactionHash === tx.hash)[0];
    };

    return {
        createReport,
    };
};
