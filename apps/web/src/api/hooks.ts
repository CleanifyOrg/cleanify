// This file should include only api-related hooks, like the one leveraging react-query

import { useQueries, useQuery } from "@tanstack/react-query";
import { providers } from "ethers";
import { getSafeInfo, isContractAddress } from "./safe";
import { getFromIPFS } from "@/utils";

const getIsSafeDeployedQueryKey = (
    safeAddress: string,
    provider?: providers.Web3Provider
) => ["IS_SAFE_DEPLOYED", safeAddress, provider?.network?.chainId];
/**
 *  Returns true if the provided address is a contract
 * @param safeAddress the address to check
 * @param provider  the provider to use
 * @returns  true if the provided address is a contract
 */
export const useIsSafeDeployed = (
    safeAddress: string,
    provider?: providers.Web3Provider
) =>
    useQuery({
        queryKey: getIsSafeDeployedQueryKey(safeAddress, provider),
        queryFn: () => isContractAddress(safeAddress, provider),
    });

const getSafeInfoQueryKey = (safeAddress: string, connectedChainId: string) => [
    "SAFE_INFO",
    safeAddress,
    connectedChainId,
];
/**
 *  Get the exchange rate of a coin
 * @param id  the id of the coin
 * @param vs_currencies  the currencies to compare
 * @returns  the exchange rate
 */
export const useSafeInfo = (safeAddress: string, connectedChainId: string) =>
    useQuery({
        queryKey: getSafeInfoQueryKey(safeAddress, connectedChainId),
        queryFn: () => getSafeInfo(safeAddress, connectedChainId),
    });

export const getFromIpfsQueryKey = (cid: string) => ["IPFS", cid];
export const useGetMultipleFromIpfs = (cids: string[]) =>
    useQueries({
        queries: cids.map((cid) => ({
            queryKey: getFromIpfsQueryKey(cid),
            queryFn: () => getFromIPFS(cid),
        })),
    });
