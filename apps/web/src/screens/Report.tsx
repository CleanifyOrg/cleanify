import {
    Alert,
    AlertIcon,
    Box,
    Button,
    HStack,
    Image,
    Spinner,
    Stack,
    Text,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { AddCleaningProofModal } from "@components/AddCleaningProofModal/AddCleaningProofModal.tsx";
import { ProofComponent } from "@components/ProofComponent.tsx";

import { useAccountAbstraction } from "@/store";
import { useBase64Image, useTxToast } from "@/hooks";
import { IWantToCleanModal } from "@/components/IWantToCleanModal";
import { ReportState } from "@/models/report";
import { Routes } from "@/router";
import { DonationModal, MapComponent } from "@/components";
import { ReportDetails } from "@/components/ReportDetails";
import {
    useReportById,
    useReports,
    useUserHasModeratorRole,
    useUserHasSubscribed,
} from "@/api/contract";
import { useGetMultipleFromIpfs } from "@/api/hooks";
import { useApproveReport } from "@/hooks/useApproveReport";

export function Report() {
    const params = useParams();
    const { ownerAddress } = useAccountAbstraction();

    const { data } = useReports();

    const baseReport = data?.find((report) => report.id === Number(params.id));

    const { data: report } = useReportById(baseReport);

    const { data: hasModeratorRole } = useUserHasModeratorRole(ownerAddress);
    const { data: hasSubscribed } = useUserHasSubscribed(
        Number(params.id),
        ownerAddress
    );

    const proofsBase64 = useGetMultipleFromIpfs(report?.proofs ?? []);

    const { mutate, isPending } = useApproveReport({
        reportId: report?.id,
    });
    useTxToast({
        isLoading: isPending,
        title: "Transaction in progress",
        description: "Please wait while we process your request",
    });

    const {
        onOpen: onOpenDonationModal,
        onClose: onCloseDonationModal,
        isOpen: isOpenDonationModal,
    } = useDisclosure();
    const {
        onOpen: onOpenIWantToCleanModal,
        onClose: onCloseIWantToCleanModal,
        isOpen: isOpenIWantToCleanModal,
    } = useDisclosure();
    const {
        onOpen: onOpenCleanProodModal,
        onClose: onCloseCleanProodModal,
        isOpen: isOpenCleanProodModal,
    } = useDisclosure();

    const { isAuthenticated } = useAccountAbstraction();

    const { blobImage } = useBase64Image(report?.metadata.images?.[0] ?? "");

    if (!report)
        return (
            <VStack align="center" justify="center" w="full" h="full">
                <Spinner />
            </VStack>
        );

    const getStateMessage = () => {
        switch (report.state) {
            case ReportState.PendingVerification:
                return (
                    <Alert status="warning" variant="solid">
                        <AlertIcon />
                        Proof of cleaning has been submitted, but it has not
                        been verified yet
                    </Alert>
                );

            case ReportState.Available:
                return (
                    <Alert status="info" variant="solid">
                        <AlertIcon />
                        {hasSubscribed
                            ? "You are subscribed to clean this report"
                            : "This report is available to be cleaned"}
                    </Alert>
                );

            case ReportState.Cleaned:
                return (
                    <Alert status="info" variant="solid">
                        <AlertIcon />
                        This report has already been cleaned
                    </Alert>
                );
            case ReportState.InReview:
                return (
                    <VStack align="flex-start">
                        <Alert status="warning" variant="solid">
                            <AlertIcon />
                            The report has been made, but it has not been
                            verified yet
                        </Alert>
                        {hasModeratorRole && (
                            <Button
                                variant="link"
                                isDisabled={isPending}
                                colorScheme="orange"
                                onClick={() => mutate()}
                            >
                                Approve the report as a moderator
                            </Button>
                        )}
                    </VStack>
                );
            default:
                return null;
        }
    };
    return (
        <>
            <Stack direction={["column", "row"]} w="full" h="full">
                <Box h="full" w={["full", "50%"]}>
                    <MapComponent
                        defaultActiveReport={report.id}
                        defaultMapCenter={report.metadata.location}
                        route={Routes.Report}
                    />
                </Box>
                <Box h="full" w={["full", "50%"]} overflow="auto" pr={4}>
                    <Box pb={4} />
                    <ReportDetails report={report} />
                    <Image
                        mt={4}
                        src={blobImage}
                        w="full"
                        borderRadius="xl"
                        maxH="70%"
                        objectFit="cover"
                    />
                    {isAuthenticated &&
                        report.state !== ReportState.Cleaned && (
                            <HStack pt={4} justifyContent="center">
                                <Button
                                    colorScheme="blue"
                                    mr={3}
                                    onClick={onOpenDonationModal}
                                    isDisabled={
                                        report.state !==
                                            ReportState.Available || isPending
                                    }
                                >
                                    Donate
                                </Button>

                                {hasSubscribed &&
                                report.state !==
                                    ReportState.PendingVerification ? (
                                    <Button
                                        isDisabled={isPending}
                                        colorScheme="green"
                                        onClick={onOpenCleanProodModal}
                                        mr={3}
                                    >
                                        Submit Cleaned
                                    </Button>
                                ) : (
                                    <Button
                                        isDisabled={
                                            hasSubscribed ||
                                            isPending ||
                                            report.state !==
                                                ReportState.Available
                                        }
                                        colorScheme="green"
                                        onClick={onOpenIWantToCleanModal}
                                        mr={3}
                                    >
                                        Subscribe
                                    </Button>
                                )}
                            </HStack>
                        )}
                    <Box py={4}>
                        <Box pb={2}>
                            <Text fontSize="lg" fontWeight="bold">
                                {report.metadata.name}
                            </Text>
                        </Box>
                        <Box pb={6}>
                            <Text fontSize="md" textAlign="justify">
                                {report.metadata.analysis.wasteDescription}
                            </Text>
                        </Box>

                        <Box pb={6}>{getStateMessage()}</Box>

                        <ProofComponent
                            report={report}
                            imageBase64={proofsBase64[0]?.data}
                        />
                    </Box>
                </Box>
            </Stack>
            <DonationModal
                isOpen={isOpenDonationModal}
                onClose={onCloseDonationModal}
                reportId={report.id}
            />
            <IWantToCleanModal
                isOpen={isOpenIWantToCleanModal}
                onClose={onCloseIWantToCleanModal}
                reportId={report.id}
            />
            <AddCleaningProofModal
                isOpen={isOpenCleanProodModal}
                onClose={onCloseCleanProodModal}
                report={report}
            />
        </>
    );
}
