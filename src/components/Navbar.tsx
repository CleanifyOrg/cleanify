import { chains } from "@/chains";
import { useAccountAbstraction } from "@/store";
import {
  Box,
  Button,
  HStack,
  Heading,
  Image,
  Skeleton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { AddressLabel } from ".";

import safeLogo from "src/assets/safe-info-logo-light.svg";
import { NetworkSelector } from "./NetworkSelector";
const safeLogoDark = "src/assets/safe-info-logo-dark.svg";

export const Navbar = () => {
  const {
    chainId,
    setChainId,
    isAuthenticated,
    loginWeb3Auth,
    ownerAddress,
    ownerLoading,
  } = useAccountAbstraction();
  const safeLogSrc = useColorModeValue(safeLogo, safeLogoDark);

  console.log({ chains });
  return (
    <HStack
      spacing={4}
      justify={"space-between"}
      position={"sticky"}
      top={0}
      right={0}
      w="100%"
      boxShadow={"md"}
      px={8}
      py={2}
    >
      <Heading size="md" flex={2}>
        Trashify
      </Heading>
      <HStack spacing={4} flex={1.5} justify={"flex-end"}>
        <NetworkSelector
          selectedChainId={chainId}
          setSelectedChainId={setChainId}
        />

        <Box>
          {!isAuthenticated ? (
            <Button size="md" onClick={loginWeb3Auth} isLoading={ownerLoading}>
              <HStack spacing={1} alignItems={"center"}>
                <Image src={safeLogSrc} alt="Safe logo" boxSize={5} />
                <Text>Login</Text>
              </HStack>
            </Button>
          ) : (
            <Skeleton isLoaded={!!ownerAddress}>
              {ownerAddress && <AddressLabel address={ownerAddress} />}
            </Skeleton>
          )}
        </Box>
      </HStack>
    </HStack>
  );
};
