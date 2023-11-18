import { DonationModal, MapComponent } from "@/components";
import { Routes } from "@/router";
import {
  Box,
  Button,
  HStack,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useReportById } from "@hooks/useReportById.ts";
import { ReportState } from "@/models/report";
import IWantToCleanModal from "@/components/IWantToCleanModal";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCleanifyContract } from "@/hooks";
import { useAccountAbstraction } from "@/store";

export const Report = () => {
  const params = useParams();
  const { contract } = useCleanifyContract();
  const [isUserAlreadySubscribedToClean, setIsUserAlreadySubscribedToClean] =
    useState(true);

  const { report } = useReportById(Number(params.id));
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

  const { ownerAddress } = useAccountAbstraction();

  const checkIfTheUserIsAlreadySubscribedToClean = useCallback(async () => {
    console.log("$$$$contract", contract);
    console.log("$$$$report", report?.id);
    console.log("ownerAddress", ownerAddress);
    if (!contract || !report || !ownerAddress) {
      setIsUserAlreadySubscribedToClean(true); // so the button is disabled
    }

    const isUserAlreadySubscribedToClean =
      await contract.isUserSubscribedAsCleaner(report!.id, ownerAddress!);

    console.log(
      "isUserAlreadySubscribedToClean",
      isUserAlreadySubscribedToClean
    );
    setIsUserAlreadySubscribedToClean(isUserAlreadySubscribedToClean);
  }, [contract, report, ownerAddress]);

  useEffect(() => {
    checkIfTheUserIsAlreadySubscribedToClean();
  }, [checkIfTheUserIsAlreadySubscribedToClean]);

  if (!report) return null;

  return (
    <>
      <HStack w={"full"} h={"full"}>
        <Box h={"full"} w={"50%"} overflow={"auto"} pr={4}>
          <Image src={report.metadata.images[0]} w={"full"} />
          <Box py={4}>
            <Box pb={2}>
              <Text fontSize="lg" fontWeight={"bold"}>
                {report.metadata.name}
              </Text>
            </Box>
            <Box pb={6}>
              <Text fontSize="md" textAlign={"justify"}>
                {report.metadata.analysis.description}
              </Text>
            </Box>
            <Box pb={4} justifyContent={"center"} display={"flex"}>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={onOpenDonationModal}
                isDisabled={report.state !== ReportState.Available}
              >
                Donate
              </Button>
              <Button
                isDisabled={isUserAlreadySubscribedToClean}
                colorScheme="green"
                onClick={onOpenIWantToCleanModal}
              >
                Clean
              </Button>
            </Box>
          </Box>
          <Box h={"full"} w={"50%"}>
            <MapComponent
              defaultActiveReport={report.id}
              defaultMapCenter={report.metadata.location}
              route={Routes.Report}
            />
          </Box>
        </Box>
      </HStack>
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
