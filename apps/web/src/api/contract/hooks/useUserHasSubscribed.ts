import { useQuery } from "@tanstack/react-query";
import { useCleanifyContract } from "@/hooks";

export const getUserHasSubscribed = (
    chainid: string,
    reportId?: number,
    address?: string
) => [chainid, "USER_HAS_SUBSCRIBED", reportId, address];

export const useUserHasSubscribed = (reportId: number, address?: string) => {
    const { contract, chain } = useCleanifyContract();
    return useQuery({
        queryKey: getUserHasSubscribed(chain.id, reportId, address),
        queryFn: async () => {
            if (!contract || !reportId || !address) return null;
            return contract.isUserSubscribedAsCleaner(reportId, address);
        },
        enabled: !!contract && !!reportId && !!address,
    });
};
