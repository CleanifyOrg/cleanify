import { DonationModal, MapComponent } from "@/components";
import { Routes } from "@/router";
import {
  Box,
  Button,
  HStack,
  Image,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useReportById } from "@hooks/useReportById.ts";
import { ReportState } from "@/models/report";

export const Report = () => {
  const params = useParams();

  console.log("params.id", params.id);

  const { report } = useReportById(Number(params.id));
  console.log("report", report);

  console.log(params);
  const {
    onOpen: onOpenDonationModal,
    onClose: onCloseDonationModal,
    isOpen: isOpenDonationModal,
  } = useDisclosure();

  if (!report) return null;
  console.log("report.state", report.state);
  return (
    <>
      <DonationModal
        isOpen={isOpenDonationModal}
        onClose={onCloseDonationModal}
        reportId={report.id}
      />
      <Stack direction={["column", "row"]} w={"full"} h={["auto", "full"]}>
        <Box h={"full"} w={["full", "50%"]} overflow={"auto"} pr={4}>
          <Image src={report.metadata.images[0]} w={"full"} />
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
            <Box pb={4} justifyContent={"center"} display={"flex"}>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={onOpenDonationModal}
                isDisabled={report.state !== ReportState.Available}
              >
                Donate
              </Button>
              <Button colorScheme="green">Clean</Button>
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
    </>
  );
};
