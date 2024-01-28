import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Text,
  Image,
  Box,
  Flex,
} from "@chakra-ui/react";
import { Report } from "@models/report.ts";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base64ToBlob } from "@/utils";
import { ReportDetails } from "../ReportDetails";

const formatDescription = (description: string) => {
  if (description.length > 100) {
    return `${description.slice(0, 110)  }…`;
  } 
    return description;
  
};

export function ReportModal({
  report,
  onClose,
}: {
  report: Report;
  onClose: () => void;
}) {
  const [imageUrl, setImageUrl] = useState<string>();

  useEffect(() => {
    const parseImageUrl = async () => {
      const parsedImage = await base64ToBlob(report.metadata.images[0]);
      const imgUrl = URL.createObjectURL(parsedImage);
      setImageUrl(imgUrl);
    };
    parseImageUrl();
  }, [report]);

  return (
    <Modal isOpen onClose={onClose}>
      <ModalOverlay />
      <ModalContent borderRadius="2xl">
        <ModalCloseButton />
        <Link to={`/report/${report.id}`} state={{ report }}>
          <ModalBody p={0}>
            <Flex direction="column" justify="center">
              <Image
                src={imageUrl}
                borderTopRadius="2xl"
                maxH="400px"
                objectFit="cover"
              />
              <Box px={4} py={2}>
                <Text fontSize="lg" fontWeight="bold">
                  {report.metadata.name}
                </Text>
              </Box>
              <Box px={4} pb={4}>
                <Text
                  fontSize="md"
                  maxH="3em"
                  overflow="hidden"
                  textOverflow="ellipses"
                  whiteSpace="normal"
                >
                  {formatDescription(
                    report.metadata.analysis.wasteDescription ?? ""
                  )}
                </Text>
              </Box>

              {report && (
                <Box px={4} pb={4}>
                  <ReportDetails report={report} />
                </Box>
              )}
            </Flex>
          </ModalBody>
        </Link>
      </ModalContent>
    </Modal>
  );
}
