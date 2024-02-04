import { useQuery } from "@tanstack/react-query";
import { useCleanifyContract } from "@/hooks";

export const getUserHasModeratorRole = (chainid: string, address?: string) => [
    chainid,
    "USER_HAS_MODERATOR_ROLE",
    address,
];

export const useUserHasModeratorRole = (address?: string) => {
    const { contract, chain } = useCleanifyContract();
    return useQuery({
        queryKey: getUserHasModeratorRole(chain.id, address),
        queryFn: async () => {
            if (!contract || !address) return null;
            const role = await contract.MODERATORS();

            return contract.hasRole(role, address);
        },
        enabled: !!contract && !!address,
    });
};
