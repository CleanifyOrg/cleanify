import {Button, Image} from "@chakra-ui/react";
import {Report, ReportState} from "@models";
import {useCleanifyAsModerator} from "@hooks/useCleanifyAsModerator.ts";
import {useHasModeratorRole} from "@hooks/useHasModeratorRole.ts"

type Props = {
  imageBase64?: string;
  report: Report;
  refreshReport: () => void;
};

export const ProofComponent = ({ imageBase64, report, refreshReport }: Props) => {
  const { contractAsModerator } = useCleanifyAsModerator();
  const { hasModeratorRole } = useHasModeratorRole();

  if (!imageBase64)
    return <></>;

  const approveSubmission = async () => {
    const tx = await contractAsModerator.handleVerificationRequest(
      report.id,
      true
    );

    await tx.wait();

    refreshReport();
  };

  return (
    <>
      <Image src={imageBase64} w={"full"} />


      {
        hasModeratorRole && report.state === ReportState.PendingVerification && (
          <Button colorScheme="red" onClick={approveSubmission} mr={3}>
            Reject
          </Button>
        )
      }
    </>
  );
};
