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
} from "@chakra-ui/react";
import { useAccountAbstraction } from "./store";
import { ConnectedWalletOwner } from "./components";
import {AllReports} from "@components/AllReports.tsx"
import {SubmitReport} from "@components/SubmitReport.tsx"

function App() {
  const { isAuthenticated, loginWeb3Auth } = useAccountAbstraction();

  return (
    <VStack
      h={"100vh"}
      w={"full"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <VStack spacing={4} alignItems={"center"} justifyContent={"center"}>
        <Box>
          <Heading textAlign={"center"} size="lg">
            Welcome to Trashify
          </Heading>


          <AllReports />
          <SubmitReport />

          <Text fontWeight="normal" textAlign="center">
            The decentralized waste management platform that allows users to
            earn rewards for recycling.
          </Text>
        </Box>
        {!isAuthenticated && (
          <Button onClick={loginWeb3Auth} size="lg" w="full">
            Connect Wallet
          </Button>
        )}
        {isAuthenticated && (
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
        )}
      </VStack>
    </VStack>
  );
}

export default App;
