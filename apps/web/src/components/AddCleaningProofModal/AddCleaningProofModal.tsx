import { useCallback, useState } from "react";

import {
    Button,
    Heading,
    HStack,
    Icon,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    VStack,
} from "@chakra-ui/react";
import { UploadPictureStep } from "@components/NewReportModal/NewReportModalStepsContent/UploadPictureStep";
import { FaInfoCircle } from "react-icons/fa";
import { Report } from "@/models/report";
import { useCleanReport } from "@/hooks/useCleanReport";

type Props = {
    report: Report;
    isOpen: boolean;
    onClose: () => void;
};

export function AddCleaningProofModal({ report, isOpen, onClose }: Props) {
    const [uploadedImages, setUploadedImages] = useState<
        { file: File; image: string }[]
    >([]);

    const { mutate, isPending } = useCleanReport({
        reportId: report.id,
        onSuccess: onClose,
    });

    const onDrop = useCallback((acceptedFiles: File[]) => {
        console.log({ acceptedFiles });

        const parsedUploads = acceptedFiles.map((file) => ({
            file,
            image: URL.createObjectURL(file),
        }));
        console.log({ parsedUploads });
        setUploadedImages(parsedUploads);
    }, []);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <HStack spacing={2}>
                        <Icon as={FaInfoCircle} boxSize={5} />
                        <Heading size="md"> New report</Heading>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack w="full" spacing={4}>
                        <UploadPictureStep
                            onDrop={onDrop}
                            uploadedFiles={uploadedImages}
                        />
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <HStack
                        w="full"
                        spacing={8}
                        alignSelf="center"
                        justifyContent="center"
                        mt={4}
                    >
                        <Button
                            isLoading={isPending}
                            loadingText="Submitting"
                            isDisabled={uploadedImages.length === 0}
                            colorScheme="green"
                            onClick={() => mutate(uploadedImages)}
                            mr={3}
                        >
                            Submit
                        </Button>

                        <Button onClick={onClose} variant="ghost">
                            Cancel
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
