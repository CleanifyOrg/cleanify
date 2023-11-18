import { AnalyzeImageResponse } from "@/api/chatgpt";
import {
  Box,
  Card,
  HStack,
  Heading,
  Image,
  ScaleFade,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";

const loremIpsum = "Lorem ipsum loret isset ipster";

type Props = {
  uploadedImages: { file: File; image: string }[];
  data?: AnalyzeImageResponse;
  isPending: boolean;
};
export const ConfirmDetailsStep: React.FC<Props> = ({
  data,
  uploadedImages,
  isPending,
}) => {
  if (!data) return null;
  return (
    <ScaleFade
      initialScale={0.9}
      in={true}
      style={{ height: 400, width: "100%" }}
    >
      <VStack
        justify={"flex-start"}
        align={"flex-start"}
        w="full"
        spacing={4}
        h={"full"}
      >
        <Heading size="sm">Confirm our analysis</Heading>
        <Card
          borderRadius={"xl"}
          boxShadow={"0px 0px 1px 1px #000000"}
          h="full"
        >
          <HStack spacing={2} w="full" h="full">
            <VStack spacing={2} flex={1} h="full">
              {uploadedImages.map((image) => (
                <Skeleton isLoaded={!isPending} h="full">
                  <Image
                    src={image.image}
                    borderLeftRadius={"xl"}
                    h="full"
                    objectFit={"cover"}
                  />
                </Skeleton>
              ))}
            </VStack>
            <VStack spacing={2} align="flex-start" flex={1.5}>
              <Box>
                <Skeleton isLoaded={!isPending}>
                  <Heading size="sm">Description</Heading>
                  <Text fontWeight="thin">
                    {data?.description ?? loremIpsum}
                  </Text>
                </Skeleton>
              </Box>
              <Box>
                <Skeleton isLoaded={!isPending}>
                  <Heading size="sm">Estimated weight</Heading>
                  <Text fontWeight="thin">
                    {data?.estimatedWeight ?? loremIpsum}
                  </Text>
                </Skeleton>
              </Box>
              <Box>
                <Skeleton isLoaded={!isPending}>
                  <Heading size="sm">Estimated cost</Heading>
                  <Text fontWeight="thin">
                    {data?.estimatedCost ?? loremIpsum}
                  </Text>
                </Skeleton>
              </Box>
            </VStack>
          </HStack>
        </Card>
      </VStack>
    </ScaleFade>
  );
};
