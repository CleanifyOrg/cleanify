import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCleanifyAsModerator } from "./useCleanifyAsModerator";
import { useOperationToast } from "./useOperationToast";
import { getReportByIdQueryKey } from "@/api/contract";
import { useCleanifyContract } from "./useCleanifyContract";

/**
 *  A hook to verify a report as a moderator
 * @param reportId  The report id to verify
 * @param isCleaned  The boolean value to indicate if the report is cleaned or not
 */
export const useVerifyReport = (reportId: number) => {
    const { chain } = useCleanifyContract();
    const { contractAsModerator } = useCleanifyAsModerator();
    const { success, error } = useOperationToast();
    const queryClient = useQueryClient();
    const verifyReport = async (isCleaned: boolean) => {
        const tx = await contractAsModerator.handleVerificationRequest(
            reportId,
            isCleaned
        );

        await tx.wait();
    };

    return useMutation({
        mutationFn: (isCleaned: boolean) => verifyReport(isCleaned),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: getReportByIdQueryKey(chain.id, reportId),
            });
            success({
                title: "Successfully verified",
                description: "The report has been verified",
            });
        },
        onError: (err) => {
            error({
                title: "Failed to verify",
                description: err.message,
            });
        },
    });
};
