import { chains } from "@/chains";
import { useAccountAbstraction } from "@/store";
import {
  Box,
  Button,
  HStack,
  Heading,
  IconButton,
  Image,
  Skeleton,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { BsSun, BsMoon } from "react-icons/bs";
import { AddressLabel } from ".";

import safeLogo from "src/assets/safe-info-logo-light.svg";
import { NetworkSelector } from "./NetworkSelector";
import { Routes } from "@/router";
import { ConnectedWalletModal } from "./ConnectedWalletModal";
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

  const { isOpen, onClose, onOpen } = useDisclosure();
  const safeLogSrc = useColorModeValue(safeLogo, safeLogoDark);

  console.log({ chains });

  const { toggleColorMode } = useColorMode();

  return (
    <HStack
      spacing={4}
      justify={"space-between"}
      position={"static"}
      top={0}
      right={0}
      w="100%"
      boxShadow={"md"}
      px={8}
      py={2}
    >
      <ConnectedWalletModal isOpen={isOpen} onClose={onClose} />
      <Heading
        size="md"
        flex={2}
        cursor={"pointer"}
        onClick={() => window.location.replace(Routes.Home)}
      >
        Trashify
      </Heading>
      <HStack spacing={4} flex={1.5} justify={"flex-end"}>
        <NetworkSelector
          selectedChainId={chainId}
          setSelectedChainId={setChainId}
        />
        {/* <Select
          flex={2}
          placeholder="Select chain"
          value={chainId}
          onChange={(e) => setChainId(e.target.value)}
        > */}
        {/* {chains.map((chain) => (
            <option value={chain.id}>
              <HStack>
                <Image src={chain.icon} boxSize={4} />
                <Text>{chain.name}</Text>
              </HStack>
            </option>
          ))}
        </Select> */}
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
              {ownerAddress && (
                <Button size="md" onClick={onOpen}>
                  <AddressLabel
                    address={ownerAddress}
                    showCopyIntoClipboardButton={false}
                  />
                </Button>
              )}
            </Skeleton>
          )}
        </Box>
        <IconButton
          aria-label="Mode Change"
          variant="empty"
          colorScheme="black"
          size="lg"
          icon={useColorModeValue(<BsMoon />, <BsSun />)}
          onClick={toggleColorMode}
        />
      </HStack>
    </HStack>
  );
};
