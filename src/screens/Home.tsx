import {
  Box,
  Button,
  HStack,
  Heading,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { MapComponent, NewReportModal } from "../components";
import { Routes } from "@/router";
import { useReports } from "@/api/hooks";

export const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: baseReports } = useReports();

  return (
    <Box h={"full"} w={"full"}>
      <VStack w={"full"} h={"full"}>
        <HStack
          justifyContent={"space-between"}
          alignItems={"center"}
          w="100%"
          pb={4}
          pt={4}
        >
          <VStack alignItems={"left"}>
            <Heading size="lg">Welcome to Trashify</Heading>
            <Text fontWeight="normal">
              The decentralized waste management platform that allows users to
              earn rewards for recycling.
            </Text>
          </VStack>
          <Button onClick={onOpen}>New report</Button>
        </HStack>

        <MapComponent route={Routes.Home} reports={baseReports} />
      </VStack>
      <NewReportModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};
