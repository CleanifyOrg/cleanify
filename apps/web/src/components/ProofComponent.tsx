import { Button, Image } from "@chakra-ui/react";
import { Report, ReportState } from "@models";
import { useCleanifyAsModerator } from "@hooks/useCleanifyAsModerator.ts";
import { useHasModeratorRole } from "@hooks/useHasModeratorRole.ts";

type Props = {
  imageBase64?: string;
  report: Report;
  refreshReport: () => void;
};

export const ProofComponent = ({
  imageBase64,
  report,
  refreshReport,
}: Props) => {
  const { contractAsModerator } = useCleanifyAsModerator();
  const { hasModeratorRole } = useHasModeratorRole();

  if (!imageBase64) return <></>;

  const answerSubmission = async (cleaned: boolean) => {
    const tx = await contractAsModerator.handleVerificationRequest(
      report.id,
      cleaned
    );

    await tx.wait();

    refreshReport();
  };

  return (
    <>
      <Image src={imageBase64} w={"full"} borderRadius={"xl"} />
      {hasModeratorRole && report.state === ReportState.PendingVerification && (
        <>
          <Button
            colorScheme="green"
            onClick={() => answerSubmission(true)}
            mr={3}
          >
            Accept
          </Button>
          <Button
            colorScheme="red"
            onClick={() => answerSubmission(false)}
            mr={3}
          >
            Reject
          </Button>
        </>
      )}
    </>
  );
};
