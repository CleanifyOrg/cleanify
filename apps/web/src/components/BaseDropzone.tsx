import { Card, CardBody, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import React, { useCallback } from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { FaCamera, FaCheck } from "react-icons/fa";

type Props = DropzoneOptions & {
  uploadedFiles: { file: File; image: string }[];
};
export const BaseDropzone: React.FC<Props> = ({
  uploadedFiles,
  ...dropZoneOptions
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    ...dropZoneOptions,
  });

  const renderInnerDropzoneArea = useCallback(() => {
    if (uploadedFiles.length)
      return (
        <VStack
          position="absolute"
          left={0}
          top={0}
          w="full"
          h="full"
          align="center"
          justify="flex-end"
          bgImage={uploadedFiles[0].image}
          bgSize="cover"
          bgPosition="center"
          bgRepeat="no-repeat"
          borderRadius="lg"
          py={4}
          px={8}
        >
          <Card>
            <CardBody h="full">
              <HStack spacing={2} align="center">
                <Icon as={FaCheck} boxSize={4} color="green" />
                <Text color="green">
                  Your images has been loaded correctly
                </Text>
              </HStack>
              <Text textAlign="center">
                If you want to ovverride them, drop or click here
              </Text>
            </CardBody>
          </Card>
        </VStack>
      );

    return (
      <VStack spacing={2} alignItems="center" justify="center" h="full">
        <Icon as={FaCamera} boxSize={8} />
        <Text textAlign="center">
          Drop or click here to upload your image
        </Text>
      </VStack>
    );
  }, [uploadedFiles]);
  return (
    <Card
      position="relative"
      {...getRootProps()}
      boxShadow="0px 0px 1px 1px #000000"
      borderRadius="xl"
      cursor="pointer"
      w="full"
      h="full"
    >
      <CardBody>
        <input {...getInputProps()} />
        {renderInnerDropzoneArea()}
      </CardBody>
    </Card>
  );
};
