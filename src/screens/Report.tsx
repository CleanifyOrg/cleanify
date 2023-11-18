import { MapComponent } from "@/components";
import { Routes } from "@/router";
import { Box, Button, HStack, Image, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

export const Report = () => {
  const params = useParams();




  if (!report) return null;
  return (
    <HStack w={"full"} h={"full"}>
      <Box h={"full"} w={"50%"} overflow={"auto"} pr={4}>
        <Image src={report.metadata.image} w={"full"} />
        <Box py={4}>
          <Box pb={2}>
            <Text fontSize="lg" fontWeight={"bold"}>
              {report.metadata.name}
            </Text>
          </Box>
          <Box pb={6}>
            <Text fontSize="md" textAlign={"justify"}>
              {report.metadata.description}
            </Text>
          </Box>
          <Box pb={4} justifyContent={"center"} display={"flex"}>
            <Button colorScheme="blue" mr={3}>
              Fund the project
            </Button>
            <Button colorScheme="green">Clean</Button>
          </Box>
        </Box>
      </Box>
      <Box h={"full"} w={"50%"}>
        <MapComponent
          defaultActiveReport={report.id}
          defaultMapCenter={report.metadata.location}
          route={Routes.Report}
        />
      </Box>
    </HStack>
  );
};
