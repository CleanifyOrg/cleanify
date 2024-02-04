import { useQuery } from "@tanstack/react-query";
import { useCleanifyContract } from "@/hooks";
import { queryReports } from "../endpoints";

export const reportsQueryKey = (chainid: string) => ["REPORTS", chainid];

export const useReports = () => {
    const { contract, chain } = useCleanifyContract();

    return useQuery({
        queryKey: reportsQueryKey(chain.id),
        queryFn: async () => queryReports(contract),
        enabled: !!contract,
    });
};
