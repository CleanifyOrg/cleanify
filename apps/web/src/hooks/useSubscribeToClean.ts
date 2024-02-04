import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCleanifyContract } from "./useCleanifyContract";
import { useOperationToast } from "./useOperationToast";
import { getReportByIdQueryKey, getUserHasSubscribed } from "@/api/contract";
import { useAccountAbstraction } from "@/store";

type Props = {
    reportId: number;
    onSuccess?: () => void;
};

export const useSubscribeToClean = ({ reportId, onSuccess }: Props) => {
    const { contract, chain } = useCleanifyContract();
    const { ownerAddress } = useAccountAbstraction();
    const { success, error } = useOperationToast();
    const queryClient = useQueryClient();

    const subscribeToClean = useCallback(async () => {
        const tx = await contract.subscribeToClean(reportId);
        await tx.wait();
    }, [contract, reportId]);

    return useMutation({
        mutationFn: () => subscribeToClean(),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: getReportByIdQueryKey(chain.id, reportId),
            });
            await queryClient.invalidateQueries({
                queryKey: getUserHasSubscribed(
                    chain.id,
                    reportId,
                    ownerAddress
                ),
            });
            success({
                title: "Successfully requested",
                description:
                    "Check the status of your request, to see when you can clean it.",
            });
            onSuccess?.();
        },
        onError: (err) => {
            error({
                title: "Failed to request",
                description: err.message,
            });
        },
    });
};
