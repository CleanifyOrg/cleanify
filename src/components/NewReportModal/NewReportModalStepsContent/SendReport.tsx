import { AnalyzeImageResponse } from "@/api/chatgpt";
import { useSubmitReport } from "@/hooks";
import { ReportMetadata } from "@/models/report";
import { blobToBase64 } from "@/utils";
import {
  Heading,
  ScaleFade,
  Spinner,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

type Props = {
  uploadedImages: { file: File; image: string }[];
  data?: AnalyzeImageResponse;
  isPending: boolean;
  selectedLocation?: { lat: number; lng: number };
  closeModal: () => void;
};
export const SendReport: React.FC<Props> = ({
  uploadedImages,
  data,
  selectedLocation,
  closeModal,
}) => {
  const toast = useToast();
  const { createReport } = useSubmitReport();

  const processReport = useCallback(async () => {
    const image = uploadedImages[0];
    if (!data || !image || !selectedLocation) return;

    const base64Image = await blobToBase64(image.file);
    console.log({ base64Image });
    const report: ReportMetadata = {
      images: [base64Image],
      location: selectedLocation,
      analysis: data,
    };

    const tx = await createReport(report);
    console.log({ tx });
  }, [uploadedImages, data, selectedLocation]);

  const { mutate } = useMutation({
    mutationFn: processReport,
    onSuccess: () => {
      closeModal();
      toast({
        title: "Report created.",
        description: "Thanks for making the world a better place!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    },
  });

  useEffect(() => {
    mutate();
  }, [selectedLocation, data]);

  return (
    <ScaleFade
      initialScale={0.9}
      in={true}
      style={{ height: 400, width: "100%" }}
    >
      <VStack
        align="center"
        justify={"center"}
        alignSelf={"center"}
        spacing={4}
        h={"full"}
      >
        <Spinner size={"xl"} />
        <Heading size="sm">We are finalizing your report...</Heading>
      </VStack>
    </ScaleFade>
  );
};
