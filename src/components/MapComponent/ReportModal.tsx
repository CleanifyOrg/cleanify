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
import { Link } from "react-router-dom";

const formatDescription = (description: string) => {
  if (description.length > 100) {
    return description.slice(0, 110) + "…";
  } else {
    return description;
  }
};

export const ReportModal = ({
  report,
  onClose,
}: {
  report: Report;
  onClose: () => void;
}) => {

  console.log(report)

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent borderRadius={"2xl"}>
        <ModalCloseButton />
        <Link to={`/report/${report.id}`} state={{ report }}>
          <ModalBody p={0}>
            <Flex direction="column" justify="center">
              <Image src={report.metadata.images[0]} borderTopRadius={"2xl"} />
              <Box px={4} py={2}>
                <Text fontSize="lg" fontWeight={"bold"}>
                  {report.metadata.name}
                </Text>
              </Box>
              <Box px={4} pb={4}>
                <Text
                  fontSize="md"
                  maxH={"3em"}
                  overflow={"hidden"}
                  textOverflow={"ellipses"}
                  whiteSpace={"normal"}
                >
                  {formatDescription(report.metadata.analysis.description ?? "")}
                </Text>
              </Box>
            </Flex>
          </ModalBody>
        </Link>
      </ModalContent>
    </Modal>
  );
};
