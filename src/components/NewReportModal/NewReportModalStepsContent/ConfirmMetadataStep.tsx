import { AnalyzeImageResponse } from "@/api/chatgpt";
import {
  Card,
  Heading,
  HStack,
  Image,
  ScaleFade,
  Skeleton,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";

const loremIpsum = "Lorem ipsum loret isset ipster";

type Props = {
  uploadedImages: { file: File; image: string }[];
  data?: AnalyzeImageResponse;
  isPending: boolean;
};
export const ConfirmMetadataStep: React.FC<Props> = ({
  data,
  uploadedImages,
  isPending,
}) => {
  const [description, setDescription] = useState(data?.wasteDescription ?? "");
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
              {uploadedImages.map((image, index) => (
                <Skeleton key={index} isLoaded={!isPending} h="full">
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
              <Skeleton isLoaded={!isPending} w="full">
                <Heading size="sm">Description</Heading>
                <Textarea
                  w="full"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Skeleton>
              <Skeleton isLoaded={!isPending}>
                <Heading size="sm">Estimated weight</Heading>
                <Text fontWeight="thin">
                  {data?.estimatedWeight ?? loremIpsum}
                </Text>
              </Skeleton>
              <Skeleton isLoaded={!isPending}>
                <Heading size="sm">Estimated cost</Heading>
                <Text fontWeight="thin">
                  {data?.estimatedCost ?? loremIpsum}
                </Text>
              </Skeleton>
            </VStack>
          </HStack>
        </Card>
      </VStack>
    </ScaleFade>
  );
};
