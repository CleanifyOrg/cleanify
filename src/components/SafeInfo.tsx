import { utils } from "ethers";
import {
  Box,
  HStack,
  Heading,
  Image,
  Skeleton,
  Tag,
  Tooltip,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { AddressLabel, AmountLabel } from "@/components";
import safeLogoLight from "src/assets/safe-info-logo-light.svg";
import safeLogoDark from "src/assets/safe-info-logo-dark.svg";
import { useAccountAbstraction, useCurrentChain } from "@store";

import { useIsSafeDeployed, useSafeInfo } from "@/api/hooks";

type SafeInfoProps = {
  safeAddress: string;
  chainId: string;
};

// TODO: ADD USDC LABEL
// TODO: ADD CHAIN LABEL

export function SafeInfo({ safeAddress, chainId }: SafeInfoProps) {
  const safeLogoSrc = useColorModeValue(safeLogoLight, safeLogoDark);
  const { web3Provider, safeBalance } = useAccountAbstraction();
  const chain = useCurrentChain();

  //TODO: enough or we need long polling ? (we need to check if the safe is deployed)
  const { data: isDeployed, isLoading: isDeployedLoading } = useIsSafeDeployed(
    safeAddress,
    web3Provider
  );
  // safe info from Safe transaction service (used to know the threshold & owners of the Safe if its deployed)
  const { data: safeInfo, isLoading: isSafeInfoLoading } = useSafeInfo(
    safeAddress,
    chainId
  );

  const owners = safeInfo?.owners.length || 1;
  const threshold = safeInfo?.threshold || 1;
  const isLoading = isDeployedLoading || isSafeInfoLoading;

  return (
    <HStack spacing={4}>
      <Box style={{ position: "relative" }}>
        {/* Safe Logo */}
        <Image
          src={safeLogoSrc}
          alt="connected Safe account logo"
          height="50px"
        />

        {/* Threshold & owners label */}
        {isDeployed && (
          <Heading
            fontSize="12px"
            fontWeight="700"
            color="inherit"
            lineHeight="initial"
          >
            {threshold}/{owners}
          </Heading>
        )}
      </Box>

      <VStack spacing={1} alignItems="flex-start">
        {/* Safe address label */}
        <Skeleton isLoaded={!isDeployedLoading}>
          <Tooltip label="This Safe is not deployed yet, it will be deployed when you execute the first transaction">
            <Tag colorScheme={isDeployed ? "green" : "orange"}>
              {isDeployed ? "Safe deployed" : "Creation pending"}
            </Tag>
          </Tooltip>
        </Skeleton>

        <AddressLabel address={safeAddress} showBlockExplorerLink />

        {/* <Skeleton isLoaded={!isLoading}> */}
        <AmountLabel
          amount={utils.formatEther(safeBalance ?? "0")}
          tokenSymbol={chain?.nativeCurrency.symbol ?? ""}
        />
        {/* </Skeleton> */}
      </VStack>
    </HStack>
  );
}
