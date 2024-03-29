import {
    Box,
    Button,
    Heading,
    ScaleFade,
    Spinner,
    VStack,
    useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { AnalyzeImageResponse } from "@/api/chatgpt";
import { reportsQueryKey } from "@/api/contract";
import { MapWithMarkerComponent } from "@/components/MapComponent/MapComponentWithMarker";
import { useSubmitReport } from "@/hooks";
import { ReportMetadata } from "@/models/report";
import { useCurrentChain } from "@/store";
import { blobToBase64 } from "@/utils";

type Props = {
    selectedLocation?: { lat: number; lng: number };
    setSelectedLocation: (location?: { lat: number; lng: number }) => void;
    uploadedImages: { file: File; image: string }[];
    data?: AnalyzeImageResponse;
    closeModal: () => void;
};

export const ConfirmPosition = ({
    selectedLocation,
    setSelectedLocation,
    uploadedImages,
    data,
    closeModal,
}: Props) => {
    const toast = useToast();
    const queryClient = useQueryClient();
    const { createReport } = useSubmitReport();
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const chain = useCurrentChain();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((location) => {
            setSelectedLocation({
                lat: location.coords.latitude,
                lng: location.coords.longitude,
            });
        });
    }, [setSelectedLocation]);

    const onMapClick = (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) {
            console.error("No latlng", e);
            return;
        }
        setSelectedLocation({
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
        });
    };

    const processReport = useCallback(async () => {
        const image = uploadedImages[0];
        if (!data || !image || !selectedLocation) return;

        const base64Image = await blobToBase64(image.file);
        const report: ReportMetadata = {
            images: [base64Image],
            location: selectedLocation,
            analysis: data,
        };

        const tx = await createReport(report);
        console.log({ tx });
    }, [uploadedImages, data, selectedLocation, createReport]);

    const { mutate, isPending } = useMutation({
        mutationFn: processReport,
        onSuccess: () => {
            queryClient.cancelQueries({
                queryKey: reportsQueryKey(chain.id),
            });
            queryClient.refetchQueries({
                queryKey: reportsQueryKey(chain.id),
            });
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

    if (isPending)
        return (
            <ScaleFade
                initialScale={0.9}
                in
                style={{ height: 400, width: "100%" }}
            >
                <VStack
                    align="center"
                    justify="center"
                    alignSelf="center"
                    spacing={4}
                    h="full"
                >
                    <Spinner size="xl" />
                    <Heading size="sm">
                        We are finalizing your report...
                    </Heading>
                </VStack>
            </ScaleFade>
        );

    return (
        <ScaleFade initialScale={0.9} in style={{ height: 400, width: "100%" }}>
            <VStack
                justify="flex-start"
                align="flex-start"
                w="full"
                spacing={4}
                h="full"
            >
                <Heading size="sm">Confirm the report location</Heading>
                <Box h={300} w="full">
                    <MapWithMarkerComponent
                        onIsMapLoaded={setIsMapLoaded}
                        markerLocation={selectedLocation}
                        onMapClick={onMapClick}
                    />
                </Box>
                <Button
                    colorScheme="blue"
                    alignSelf="center"
                    mt={4}
                    size="md"
                    onClick={() => mutate()}
                >
                    Send report
                </Button>
            </VStack>
        </ScaleFade>
    );
};
