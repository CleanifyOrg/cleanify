import { useMutation, useQueryClient } from "@tanstack/react-query";
import { blobToBase64, uploadToIpfs } from "@/utils";
import { useCleanifyContract } from "./useCleanifyContract";
import { useOperationToast } from "./useOperationToast";
import { getReportByIdQueryKey } from "@/api/contract";

type Props = {
    reportId: number;
    onSuccess?: () => void;
};

export const useCleanReport = ({ reportId, onSuccess }: Props) => {
    const { contract, chain } = useCleanifyContract();
    const { success, error } = useOperationToast();
    const queryClient = useQueryClient();

    const cleanReport = async (
        uploadedImages: { file: File; image: string }[]
    ) => {
        if (uploadedImages.length === 0) return;

        const base64Image = await blobToBase64(uploadedImages[0].file);

        const uri = await uploadToIpfs(base64Image);

        const tx = await contract.setReportAsCleaned(reportId, uri);

        await tx.wait();
    };
    return useMutation({
        mutationFn: (uploadedImages: { file: File; image: string }[]) =>
            cleanReport(uploadedImages),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: getReportByIdQueryKey(chain.id, reportId),
            });
            success({
                title: "Successfully cleaned",
            });
            onSuccess?.();
        },
        onError: (err) => {
            error({
                title: "Failed to clean",
                description: err.message,
            });
        },
    });
};
