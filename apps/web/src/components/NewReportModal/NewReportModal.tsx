import {
    HStack,
    Heading,
    Icon,
    IconButton,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    VStack,
    useSteps,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { FaArrowLeft, FaArrowRight, FaInfoCircle } from "react-icons/fa";
import { UploadPictureStep } from "./NewReportModalStepsContent/UploadPictureStep";
import { ValidatePictureStep } from "./NewReportModalStepsContent/ValidatePictureStep";
import { ConfirmMetadataStep } from "./NewReportModalStepsContent/ConfirmMetadataStep";
import { NewReportModalSteps } from "../Step";
import { analyzeImage } from "@/api/chatgpt";
import { ConfirmPosition } from "./NewReportModalStepsContent/ConfirmPosition";

type Step = {
    title: string;
    description: string;
    component: React.ReactNode;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export const NewReportModal = ({ isOpen, onClose }: Props) => {
    const [uploadedImages, setUploadedImages] = useState<
        { file: File; image: string }[]
    >([]);

    const [selectedPosition, setSelectedPosition] = useState<{
        lat: number;
        lng: number;
    }>();

    const onDrop = useCallback((acceptedFiles: File[]) => {
        console.log({ acceptedFiles });

        const parsedUploads = acceptedFiles.map((file) => ({
            file,
            image: URL.createObjectURL(file),
        }));
        console.log({ parsedUploads });
        setUploadedImages(parsedUploads);
    }, []);

    const handleOnResetPhotos = useCallback(() => {
        setUploadedImages([]);
    }, []);

    const { mutate, data, isPending } = useMutation({
        mutationFn: analyzeImage,
    });

    const [description, setDescription] = useState(
        data?.wasteDescription ?? ""
    );

    useEffect(() => {
        if (!data) return;
        setDescription(data.wasteDescription);
    }, [data]);

    const {
        activeStep: activeStepIndex,
        goToNext,
        goToPrevious,
    } = useSteps({
        index: 0,
        count: 4,
    });

    const steps: Step[] = useMemo(
        () => [
            {
                title: "photo",
                description: "Take a photo of the area to report",
                component: (
                    <UploadPictureStep
                        onDrop={onDrop}
                        uploadedFiles={uploadedImages}
                    />
                ),
            },
            {
                title: "validate",
                description: "Validate your picture...",
                component: (
                    <ValidatePictureStep
                        isPending={isPending}
                        data={data}
                        handleOnResetPhotos={handleOnResetPhotos}
                        goToPreviousStep={goToPrevious}
                    />
                ),
            },
            {
                title: "Details",
                description: "Confirm the details",
                component: (
                    <ConfirmMetadataStep
                        isPending={isPending}
                        data={data}
                        uploadedImages={uploadedImages}
                        description={description}
                        setDescription={setDescription}
                    />
                ),
            },
            {
                title: "position",
                description: "Confirm the position",
                component: (
                    <ConfirmPosition
                        selectedLocation={selectedPosition}
                        setSelectedLocation={setSelectedPosition}
                        data={
                            data
                                ? { ...data, wasteDescription: description }
                                : undefined
                        }
                        uploadedImages={uploadedImages}
                        closeModal={onClose}
                    />
                ),
            },
        ],
        [
            data,
            handleOnResetPhotos,
            isPending,
            onDrop,
            uploadedImages,
            goToPrevious,
            description,
            onClose,
            selectedPosition,
        ]
    );

    const activeStep = useMemo(
        () => steps[activeStepIndex],
        [steps, activeStepIndex]
    );

    const isPreviousDisabled = useMemo(
        () => activeStepIndex === 0,
        [activeStepIndex]
    );
    const isNextDisabled = useMemo(() => {
        if (activeStepIndex === steps.length - 1) return true;
        if (activeStepIndex === 0 && uploadedImages.length === 0) return true;
        if (activeStepIndex === 1 && !data?.isWastePollution) return true;
        return false;
    }, [steps, activeStepIndex, data, uploadedImages]);

    useEffect(() => {
        if (!uploadedImages.length) return;
        mutate(uploadedImages[0].image);
    }, [mutate, uploadedImages]);

    //   useEffect(() => {
    //     if (!uploadedImages.length) return setActiveStep(0);

    //     if (data?.isWastePollution) return setActiveStep(2);
    //     return setActiveStep(1);
    //   }, [data, setActiveStep, uploadedImages]);

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
                        <NewReportModalSteps
                            steps={steps}
                            activeStep={activeStepIndex}
                        />
                        {activeStep.component}
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
                        <IconButton
                            icon={<FaArrowLeft />}
                            onClick={goToPrevious}
                            aria-label="Go to previous step"
                            boxSize={8}
                            isDisabled={isPreviousDisabled}
                        />
                        <IconButton
                            icon={<FaArrowRight />}
                            onClick={goToNext}
                            aria-label="Go to next step"
                            boxSize={8}
                            isDisabled={isNextDisabled}
                        />
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
