// This file should include only api-related hooks, like the one leveraging react-query

import { useQuery } from "@tanstack/react-query";
import { providers } from "ethers";
import { getSafeInfo, isContractAddress } from "./safe";
import { useCleanifyContract } from "@/hooks";
import { getReportMetadata, queryReports } from "./contract";
import { BaseReport, ChainWithSafeConfig } from "@/models";
import { Cleanify } from "@/typechain";

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
) => {
    return useQuery({
        queryKey: getIsSafeDeployedQueryKey(safeAddress, provider),
        queryFn: () => isContractAddress(safeAddress, provider),
    });
};

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
export const useSafeInfo = (safeAddress: string, connectedChainId: string) => {
    return useQuery({
        queryKey: getSafeInfoQueryKey(safeAddress, connectedChainId),
        queryFn: () => getSafeInfo(safeAddress, connectedChainId),
    });
};

//TODO: are these contracts related to a specific chain ? if so, we should add the chainId to the queryKey
export const reportsKey = (chain: ChainWithSafeConfig) => ["REPORTS", chain.id];

export const useReports = () => {
    const { chain, contract } = useCleanifyContract();

    return useQuery({
        queryKey: reportsKey(chain),
        queryFn: () => queryReports(contract),
    });
};

export const reportMetadataKey = (baseReport: BaseReport) => [
    "REPORT_METADATA",
    baseReport.id,
];

export const useGetReportMetadata = (baseReport: BaseReport) => {
    return useQuery({
        queryKey: reportMetadataKey(baseReport),
        queryFn: () => getReportMetadata(baseReport),
    });
};
