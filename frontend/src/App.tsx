import { Box, Heading, Text, VStack } from "@chakra-ui/react";

function App() {
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
          <Text fontWeight="normal" textAlign="center">
            The decentralized waste management platform that allows users to
            earn rewards for recycling.
          </Text>
        </Box>
      </VStack>
    </VStack>
  );
}

export default App;
