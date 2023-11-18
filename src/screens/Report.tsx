import {DonationModal, MapComponent} from "@/components";
import {Routes} from "@/router";
import {Box, Button, HStack, Image, Spinner, Stack, Text, useDisclosure, VStack} from "@chakra-ui/react";
import {useParams} from "react-router-dom";
import {useReportById} from "@hooks/useReportById.ts";
import {ReportState} from "@/models/report";
import IWantToCleanModal from "@/components/IWantToCleanModal";
import {useCallback, useEffect, useState} from "react";
import {useBase64Image, useCleanifyContract} from "@/hooks";
import {useAccountAbstraction} from "@/store";
import {useHasModeratorRole} from "@hooks/useHasModeratorRole.ts";
import {useCleanifyAsModerator} from "@hooks/useCleanifyAsModerator.ts";
import {AddCleaningProofModal} from "@components/AddCleaningProofModal/AddCleaningProofModal.tsx"
import {useHasSubscribed} from "@hooks/useHasSubscribed.ts"

export const Report = () => {
  const params = useParams();
  const {contract} = useCleanifyContract();
  const {contractAsModerator} = useCleanifyAsModerator();

  const {report, refreshReport} = useReportById(Number(params.id));

  const {hasModeratorRole} = useHasModeratorRole();
  const {hasSubscribed} = useHasSubscribed(Number(params.id))

  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  const {
    onOpen: onOpenDonationModal,
    onClose: onCloseDonationModal,
    isOpen: isOpenDonationModal
  } = useDisclosure();
  const {
    onOpen: onOpenIWantToCleanModal,
    onClose: onCloseIWantToCleanModal,
    isOpen: isOpenIWantToCleanModal
  } = useDisclosure();
  const {
    onOpen: onOpenCleanProodModal,
    onClose: onCloseCleanProodModal,
    isOpen: isOpenCleanProodModal
  } = useDisclosure();

  const {isAuthenticated} = useAccountAbstraction();

  const verifyReport = useCallback(async () => {
    if (!report || !contract) return;

    setButtonsDisabled(true);

    try {
      const tx = await contractAsModerator.approveReport(report.id);

      await tx.wait();

      refreshReport();
    } finally {
      setButtonsDisabled(false);
    }
  }, [contract, report]);

  const {blobImage} = useBase64Image(report?.metadata.images[0] ?? "");

  const canVerify = hasModeratorRole && report?.state === 0;

  if (!report)
    return (
      <VStack align={"center"} justify={"center"} w={"full"} h={"full"}>
        <Spinner/>
      </VStack>
    );


  const getStateMessage = () => {
    switch (report.state) {
      case ReportState.PendingVerification:
        return "Proof of cleaning has been submitted, but it has not been verified yet";
      case ReportState.Available:
        if (hasSubscribed) {
          return "You are subscribed to clean this report";
        } else return "This report is available to be cleaned";
      case ReportState.Cleaned:
        return "This report has already been cleaned";
      case ReportState.InReview:
        return "The report has been made, but it has not been verified yet";

    }
  }


  console.log({state: report.state, hasSubscribed})

  return (
    <>
      <Stack direction={["column", "row"]} w={"full"} h={"full"}>
        <Box h={"full"} w={["full", "50%"]} overflow={"auto"} pr={4}>
          <Image src={blobImage} w={"full"}/>


          {isAuthenticated && (
            <HStack pb={4} pt={4} justifyContent={"center"} >
              <Button
                colorScheme="blue"
                mr={3}
                onClick={onOpenDonationModal}
                isDisabled={
                  report.state !== ReportState.Available || buttonsDisabled
                }
              >
                Donate
              </Button>

              {hasSubscribed && report.state !== ReportState.PendingVerification ? (
                <Button
                  isDisabled={buttonsDisabled}
                  colorScheme="green"
                  onClick={onOpenCleanProodModal}
                  mr={3}
                >
                  Submit Cleaned
                </Button>
              ) : (<Button
                isDisabled={
                  hasSubscribed ||
                  buttonsDisabled ||
                  report.state === ReportState.PendingVerification ||
                  report.state === ReportState.Cleaned
                }
                colorScheme="green"
                onClick={onOpenIWantToCleanModal}
                mr={3}
              >
                Subscribe
              </Button>)}

              {canVerify && (
                <Button
                  isDisabled={buttonsDisabled}
                  colorScheme="yellow"
                  onClick={verifyReport}
                >
                  Verify
                </Button>
              )}
            </HStack>
          )}


          <Box py={4}>
            <Box pb={2}>
              <Text fontSize="lg" fontWeight={"bold"}>
                {report.metadata.name}
              </Text>
            </Box>
            <Box pb={6}>
              <Text fontSize="md" textAlign={"justify"}>
                {report.metadata.analysis.wasteDescription}
              </Text>
            </Box>

            <Box pb={6}>
              <Text fontSize="md" textAlign={"justify"}>
                {getStateMessage()}
              </Text>
            </Box>

          </Box>
        </Box>
        <Box h={"full"} w={["full", "50%"]}>
          <MapComponent
            defaultActiveReport={report.id}
            defaultMapCenter={report.metadata.location}
            route={Routes.Report}
          />
        </Box>
      </Stack>
      <DonationModal
        isOpen={isOpenDonationModal}
        onClose={onCloseDonationModal}
        reportId={report.id}
      />
      <IWantToCleanModal
        isOpen={isOpenIWantToCleanModal}
        onClose={onCloseIWantToCleanModal}
        reportId={report.id}
        refreshReport={refreshReport}
      />
      <AddCleaningProofModal
        isOpen={isOpenCleanProodModal}
        onClose={onCloseCleanProodModal}
        report={report}
        refreshReport={refreshReport}
      />
    </>
  );
};
