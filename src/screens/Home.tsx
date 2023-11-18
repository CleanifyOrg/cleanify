import {
  Box,
  Button,
  HStack,
  Heading,
  Hide,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { MapComponent, NewReportModal } from "../components";
import { Routes } from "@/router";
import { useAccountAbstraction } from "@/store";
import { FaPlus } from "react-icons/fa";

export const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAuthenticated, loginWeb3Auth } = useAccountAbstraction();
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
            <HStack justify={"space-between"} w="full">
              <Heading size={["md", "lg"]}>Welcome to Cleanify</Heading>
              <Hide above="sm">
                <Button
                  leftIcon={<FaPlus />}
                  size="sm"
                  onClick={isAuthenticated ? onOpen : loginWeb3Auth}
                >
                  New report
                </Button>
              </Hide>
            </HStack>
            <Text fontWeight="normal">
              The decentralized waste management platform that allows users to
              earn rewards for recycling.
            </Text>
          </VStack>
          <Hide below="sm">
            <Button
              leftIcon={<FaPlus />}
              onClick={isAuthenticated ? onOpen : loginWeb3Auth}
            >
              New report
            </Button>
          </Hide>
        </HStack>

        <MapComponent route={Routes.Home} />
      </VStack>
      <NewReportModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};
