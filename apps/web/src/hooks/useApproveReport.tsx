import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { getReportByIdQueryKey } from "@/api/contract";
import { useCleanifyAsModerator } from "./useCleanifyAsModerator";
import { useCleanifyContract } from "./useCleanifyContract";
import { useOperationToast } from "./useOperationToast";

type Props = {
    reportId?: number;
    onSuccess?: () => void;
};
export const useApproveReport = ({ reportId, onSuccess }: Props) => {
    const queryClient = useQueryClient();
    const { chain } = useCleanifyContract();
    const { contractAsModerator } = useCleanifyAsModerator();
    const { success, error } = useOperationToast();

    const approveReport = useCallback(async () => {
        if (!contractAsModerator || !reportId) return;

        const tx = await contractAsModerator.approveReport(reportId);

        await tx.wait();
    }, [contractAsModerator, reportId]);

    return useMutation({
        mutationFn: approveReport,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: getReportByIdQueryKey(chain.id, reportId),
            });
            success({
                title: "Report approved",
            });
            onSuccess?.();
        },
        onError: (err) => {
            error({
                title: "Error approving report",
                description: err.message,
            });
        },
    });
};
