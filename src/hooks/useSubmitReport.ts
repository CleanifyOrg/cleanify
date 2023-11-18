import { useMemo, useState } from "react";
import { useTrashifyContract } from "@hooks/useTrashifyContract.ts";
import { Coordinates, RecordMetadata } from "@models";
import { NewReportSubmitedEvent } from "@/typechain/Trashify.ts";
import {uploadToIpfs} from "@utils"
import {AnalyzeImageResponse} from "@api/chatgpt"

export const useSubmitReport = () => {
  const { contract } = useTrashifyContract();
  const createReport = async (analysis: AnalyzeImageResponse, images: string[]): Promise<NewReportSubmitedEvent> => {

    const imageUris = await Promise.all(
      images.map((image) => {
        return uploadToIpfs(image);
      })
    );

    const metadata: RecordMetadata = {
      ...analysis,
      imageUris,
    };

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
