import { Box, HStack, Image, Text } from "@chakra-ui/react";
import { Select, GroupBase } from "chakra-react-select";
import { useMemo } from "react";
import { chains, mainnets, testnets } from "@/chains";

type Props = {
  selectedChainId: string;
  setSelectedChainId: (network?: string) => void;
};

type Option = {
  label: string;
  value: string;
  icon?: string;
  transactionServiceUrl?: string;
};

export const NetworkSelector: React.FC<Props> = ({
  selectedChainId,
  setSelectedChainId,
}) => {
  const selectedOption = useMemo(() => {
    const chain = chains.find((chain) => chain.id === selectedChainId);
    if (!chain) return undefined;
    return {
      label: chain.name,
      value: chain.id,
      icon: chain.icon,
      transactionServiceUrl: chain.transactionServiceUrl,
    };
  }, [selectedChainId]);

  const testnetOptions: Option[] = useMemo(() => testnets.map((chain) => ({
      label: chain.name,
      value: chain.id,
      icon: chain.icon,
      transactionServiceUrl: chain.transactionServiceUrl,
    })), []);

  const mainnetOptions: Option[] = useMemo(() => mainnets.map((chain) => ({
      label: chain.name,
      value: chain.id,
      icon: chain.icon,
      transactionServiceUrl: chain.transactionServiceUrl,
    })), []);

  const options = useMemo(() => [
      {
        label: "Testnets",
        options: testnetOptions,
      },
      {
        label: "Mainnets",
        options: mainnetOptions,
      },
    ], [testnetOptions, mainnetOptions]);

  const formatOptionLabel = (option: Option) => (
    <Box>
      <HStack spacing={2} w="full" align="center">
        {option.icon && (
          <Image src={option.icon} alt={option.label} boxSize={4} />
        )}
        <Text fontWeight="semibold">{option.label}</Text>
      </HStack>
    </Box>
  );

  return (
    <Select<Option, false, GroupBase<Option>>
      selectedOptionStyle="color"
      defaultValue={selectedOption}
      options={options}
      onChange={(e) => setSelectedChainId(e?.value)}
      formatOptionLabel={formatOptionLabel}
      //   formatGroupLabel={formatGroupLabel}
    />
  );
};
