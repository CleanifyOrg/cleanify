import { Text, Tooltip } from "@chakra-ui/react";
import { useMemo } from "react";
import { humanAmountNumber } from "@/utils";

type Props = {
  amount: string;
  showSymbol?: boolean;
  tokenSymbol: string;
  decimalsDisplayed?: number;
};

export function AmountLabel({
  amount,
  showSymbol = true,
  tokenSymbol,
  decimalsDisplayed,
}: Props) {
  const formattedAmount = useMemo(() => {
    if (!amount) return "";
    return humanAmountNumber(
      amount,
      showSymbol ? tokenSymbol : undefined,
      decimalsDisplayed
    );
  }, [amount, showSymbol, tokenSymbol, decimalsDisplayed]);

  return (
    <Tooltip label={formattedAmount}>
      <Text>{formattedAmount}</Text>
    </Tooltip>
  );
}
