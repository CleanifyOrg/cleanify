import { useQuery } from "@tanstack/react-query";
import { getExchangeRate } from "../endpoints";

export const getExchangeRateQueryKey = (currencySymbol: string) => [
    "exchangeRate",
    currencySymbol,
];
export const useExchangeRate = (currencySymbol: string) =>
    useQuery({
        queryKey: getExchangeRateQueryKey(currencySymbol),
        queryFn: () => getExchangeRate(currencySymbol),
    });
