import { Heading, ScaleFade, VStack } from "@chakra-ui/react";
import { BaseDropzone } from "@/components";

type Props = {
  onDrop: (acceptedFiles: File[]) => void;
  uploadedFiles: { file: File; image: string }[];
};
export const UploadPictureStep: React.FC<Props> = ({
  onDrop,
  uploadedFiles,
}) => (
    <ScaleFade
      initialScale={0.9}
      in
      style={{ height: 400, width: "100%" }}
    >
      <VStack spacing={4} w="full" align="flex-start" h="full">
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
