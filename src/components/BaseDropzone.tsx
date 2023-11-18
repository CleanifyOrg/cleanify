import {
  Card,
  CardBody,
  HStack,
  Icon,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
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
        <VStack spacing={0} alignItems={"center"} justify={"center"} h="full">
          {uploadedFiles.map((file) => (
            <Image src={file.image} w={"20%"} />
          ))}
          <HStack mt={4} spacing={2} align={"center"}>
            <Icon as={FaCheck} boxSize={4} color="green" />
            <Text color={"green"}>Your images has been loaded correctly</Text>
          </HStack>
          <Text textAlign={"center"}>
            If you want to ovverride them, drop or click here
          </Text>
        </VStack>
      );

    return (
      <VStack spacing={2} alignItems={"center"} justify={"center"} h="full">
        <Icon as={FaCamera} boxSize={8} />
        <Text textAlign={"center"}>
          Drop or click here to upload your image
        </Text>
      </VStack>
    );
  }, [uploadedFiles]);
  return (
    <Card
      {...getRootProps()}
      boxShadow={"0px 0px 1px 1px #000000"}
      borderRadius={"xl"}
      cursor={"pointer"}
      w="full"
      h={"full"}
    >
      <CardBody>
        <input {...getInputProps()} />
        {renderInnerDropzoneArea()}
      </CardBody>
    </Card>
  );
};
