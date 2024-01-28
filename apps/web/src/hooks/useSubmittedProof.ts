import { Report, ReportState } from "@models";
import { useCallback, useEffect, useState } from "react";
import { useCleanifyContract } from "@hooks/useCleanifyContract.ts";
import { getFromIPFS } from "@utils";

export const useSubmittedProof = (report?: Report) => {
  const [proofBase64, setProofBase64] = useState<string>();
  const { contract } = useCleanifyContract();

  const getImage = useCallback(
    async (_report: Report) => {
      const report = await contract.getReportById(_report.id);

      const cid = report.proofs[0];

      const image = await getFromIPFS(cid);

      setProofBase64(image);
    },
    [contract]
  );

  useEffect(() => {
    setProofBase64(undefined);
    if (
      report?.state === ReportState.PendingVerification ||
      report?.state === ReportState.Cleaned
    ) {
      getImage(report);
    }
  }, [report, getImage]);

  return {
    proofBase64,
  };
};
