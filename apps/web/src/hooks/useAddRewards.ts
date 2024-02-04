import { parseEther } from "viem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCleanifyContract } from "./useCleanifyContract";
import { useOperationToast } from "./useOperationToast";
import { getReportByIdQueryKey } from "@/api/contract";

type Props = {
    reportId: number;
    onSuccess?: () => void;
};

export const useAddRewards = ({ reportId, onSuccess }: Props) => {
    const queryClient = useQueryClient();
    const { contract, chain } = useCleanifyContract();
    const { success, error } = useOperationToast();

    const handleDonate = async (amount: string) => {
        const options = {
            value: String(parseEther(amount)),
        };
        const tx = await contract.addRewards(reportId, options);
        await tx.wait();
    };

    return useMutation({
        mutationFn: (amount: string) => handleDonate(amount),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: getReportByIdQueryKey(chain.id, reportId),
            });
            success({
                title: "Successfully donated",
            });
            onSuccess?.();
        },
        onError: (err) => {
            error({
                title: "Failed to donate",
                description: err.message,
            });
        },
    });
};
