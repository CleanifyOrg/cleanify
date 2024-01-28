import { BaseDropzone } from "@/components";
import { Heading, ScaleFade, VStack } from "@chakra-ui/react";

type Props = {
  onDrop: (acceptedFiles: File[]) => void;
  uploadedFiles: { file: File; image: string }[];
};
export const UploadPictureStep: React.FC<Props> = ({
  onDrop,
  uploadedFiles,
}) => {
  return (
    <ScaleFade
      initialScale={0.9}
      in={true}
      style={{ height: 400, width: "100%" }}
    >
      <VStack spacing={4} w="full" align={"flex-start"} h="full">
        <Heading size="sm">Upload a picture of the area to report</Heading>
        <BaseDropzone
          onDrop={onDrop}
          uploadedFiles={uploadedFiles}
          accept={{
            "image/*": [".jpeg", ".png"],
          }}
        />
      </VStack>
    </ScaleFade>
  );
};
