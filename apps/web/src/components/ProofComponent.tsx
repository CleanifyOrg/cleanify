import { Button, Image } from "@chakra-ui/react";
import { Report, ReportState } from "@models";
import { useVerifyReport } from "@/hooks";
import { useUserHasModeratorRole } from "@/api/contract";
import { useAccountAbstraction } from "@/store";

type Props = {
    imageBase64?: string;
    report: Report;
};

export function ProofComponent({ imageBase64, report }: Props) {
    const { ownerAddress } = useAccountAbstraction();
    const { data: hasModeratorRole } = useUserHasModeratorRole(ownerAddress);
    const { mutate, isPending } = useVerifyReport(report.id);

    if (!imageBase64) return null;

    return (
        <>
            <Image src={imageBase64} w="full" borderRadius="xl" />
            {hasModeratorRole &&
                report.state === ReportState.PendingVerification && (
                    <>
                        <Button
                            isLoading={isPending}
                            colorScheme="green"
                            onClick={() => mutate(true)}
                            mr={3}
                        >
                            Accept
                        </Button>
                        <Button
                            isLoading={isPending}
                            colorScheme="red"
                            onClick={() => mutate(false)}
                            mr={3}
                        >
                            Reject
                        </Button>
                    </>
                )}
        </>
    );
}
