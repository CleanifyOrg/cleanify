import axios from "axios";

const symbolToCoinGeckoId: { [key: string]: string } = {
  ETH: "ethereum",
};

export const getExchangeRate = async (
  currencySymbol: string
): Promise<number | void> => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/coins/${symbolToCoinGeckoId[currencySymbol]}`,
      {
        headers: {
          "x-cg-pro-api-key": import.meta.env.VITE_COINGECKO_API_KEY,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (ex) {
    console.error(ex);
    const hardcodedRates = {
      ETH: 1940.79,
      DAI: 1,
      CELO: 0.535419,
      MATIC: 0.800984,
    };
    return hardcodedRates[
      currencySymbol as keyof typeof hardcodedRates
    ] as number;
  }
};
