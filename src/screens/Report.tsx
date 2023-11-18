import { DonationModal, MapComponent } from "@/components";
import { Routes } from "@/router";
import {
  Box,
  Button,
  Image,
  Spinner,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useReportById } from "@hooks/useReportById.ts";
import { ReportState } from "@/models/report";
import IWantToCleanModal from "@/components/IWantToCleanModal";
import { useCallback, useEffect, useState } from "react";
import { useBase64Image, useCleanifyContract } from "@/hooks";
import { useAccountAbstraction } from "@/store";
import {useHasModeratorRole} from "@hooks/useHasModeratorRole.ts"
import {useCleanifyAsModerator} from "@hooks/useCleanifyAsModerator.ts"

export const Report = () => {
  const params = useParams();
  const { contract } = useCleanifyContract();
  const { contractAsModerator} = useCleanifyAsModerator();
  const [isUserAlreadySubscribedToClean, setIsUserAlreadySubscribedToClean] =
    useState(true);

  const { report, refreshReport } = useReportById(Number(params.id));

  const { hasModeratorRole} = useHasModeratorRole();

  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  const {
    onOpen: onOpenDonationModal,
    onClose: onCloseDonationModal,
    isOpen: isOpenDonationModal,
  } = useDisclosure();
  const {
    onOpen: onOpenIWantToCleanModal,
    onClose: onCloseIWantToCleanModal,
    isOpen: isOpenIWantToCleanModal,
  } = useDisclosure();

  const { ownerAddress, isAuthenticated } = useAccountAbstraction();

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

  }, [
    contract,
    report
  ]);

  const checkIfTheUserIsAlreadySubscribedToClean = useCallback(async () => {
    if (!contract || !report || !ownerAddress) {
      setIsUserAlreadySubscribedToClean(true); // so the button is disabled
      return;
    }

    const isUserAlreadySubscribedToClean =
      await contract.isUserSubscribedAsCleaner(report.id, ownerAddress!);

    setIsUserAlreadySubscribedToClean(isUserAlreadySubscribedToClean);
  }, [contract, report, ownerAddress]);

  useEffect(() => {
    checkIfTheUserIsAlreadySubscribedToClean();
  }, [checkIfTheUserIsAlreadySubscribedToClean]);

  const { blobImage } = useBase64Image(report?.metadata.images[0] ?? "");

  const canVerify = hasModeratorRole && report?.state === 0;

  if (!report)
    return (
      <VStack align={"center"} justify={"center"} w={"full"} h={"full"}>
        <Spinner />
      </VStack>
    );

  return (
    <>
      <Stack direction={["column", "row"]} w={"full"} h={"full"}>
        <Box h={"full"} w={["full", "50%"]} overflow={"auto"} pr={4}>
          <Image src={blobImage} w={"full"} />
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
            {isAuthenticated && (
              <Box pb={4} justifyContent={"center"} display={"flex"}>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={onOpenDonationModal}
                  isDisabled={report.state !== ReportState.Available || buttonsDisabled}
                >
                  Donate
                </Button>
                <Button
                  isDisabled={isUserAlreadySubscribedToClean || buttonsDisabled}
                  colorScheme="green"
                  onClick={onOpenIWantToCleanModal}
                  mr={3}
                >
                  Clean
                </Button>

                {
                  canVerify && (
                    <Button
                      isDisabled={buttonsDisabled}
                      colorScheme="yellow"
                      onClick={verifyReport}
                    >
                      Verify
                    </Button>
                  )
                }

              </Box>
            )}
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
      />
    </>
  );
};
