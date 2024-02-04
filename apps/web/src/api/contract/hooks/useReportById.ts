import { useQuery } from "@tanstack/react-query";
import { useCleanifyContract } from "@/hooks";
import { BaseReport } from "@/models";
import { getReportById } from "../endpoints";
import { useReportMetadata } from "./useReportMetadata";

export const getReportByIdQueryKey = (chainid: string, id?: number) => [
    chainid,
    "REPORT_BY_ID",
    id,
];
export const useReportById = (baseReport?: BaseReport) => {
    const { data: metadata } = useReportMetadata(baseReport);
    const { contract, chain } = useCleanifyContract();
    return useQuery({
        queryKey: getReportByIdQueryKey(chain.id, baseReport?.id),
        queryFn: async () => {
            if (!contract || !baseReport || !metadata) return null;
            const reportById = await getReportById(contract, baseReport.id);
            return {
                ...reportById,
                metadata,
            };
        },
        enabled: !!contract && !!baseReport && !!metadata,
    });
};
