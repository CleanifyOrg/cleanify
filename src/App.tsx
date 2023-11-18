import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  HStack,
  Heading,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { ConnectedWalletOwner, NewReportModal } from "@/components";
import { useAccountAbstraction } from "@/store";

export const Home = () => {
  const { isAuthenticated } = useAccountAbstraction();

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box h={"full"} w={"full"}>
      <NewReportModal isOpen={isOpen} onClose={onClose} />
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
        {isAuthenticated && (
          <Box
            alignItems={"center"}
            justifyContent={"center"}
            px={8}
            maxW={"xl"}
          >
            <Card py={4} px={8}>
              <CardHeader>
                <HStack spacing={4}>
                  <Heading size="md">Connected account</Heading>
                </HStack>
              </CardHeader>

              <CardBody>
                <ConnectedWalletOwner />
              </CardBody>
            </Card>
          </Box>
        )}
      </VStack>
    </Box>
  );
};
