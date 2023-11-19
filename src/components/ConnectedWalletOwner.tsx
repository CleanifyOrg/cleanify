import {
  Box,
  Button,
  Divider,
  HStack,
  Heading,
  Image,
  Spinner,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { FaDoorOpen } from "react-icons/fa";
import { AddressLabel } from "./AddressLabel";
import { useAccountAbstraction } from "@/store";
import authLogo from "src/assets/web3Auth_logo.png";
import { SafeInfo } from ".";

export const ConnectedWalletOwner = ({ onClose }: { onClose: () => void }) => {
  const {
    isAuthenticated,
    ownerAddress,
    safeSelected,
    safeSelectedLoading,
    chainId,
    logoutWeb3Auth,
  } = useAccountAbstraction();

  if (!isAuthenticated) return <Heading size="md">Not connected</Heading>;

  return (
    <VStack alignItems="flex-start" justifyContent="space-between" spacing={4}>
      <Heading size="sm">Safe Owner</Heading>
      <HStack alignItems="center" spacing={4}>
        <Image src={authLogo} alt="connected Wallet logo" height={"50px"} />

        {ownerAddress && (
          <AddressLabel address={ownerAddress} showBlockExplorerLink />
        )}
      </HStack>
      <Divider />
      <Box>
        <Heading size="sm">Safe Address </Heading>
        <Text fontWeight="thin">
          Your Safe account (Smart Contract) holds and protects your assets.
        </Text>
      </Box>

      {safeSelectedLoading && <Spinner alignSelf={"center"} />}

      {safeSelected && (
        <SafeInfo safeAddress={safeSelected} chainId={chainId} />
      )}

      <HStack spacing={4} alignSelf={"center"}>
        <Tooltip label="Logout" alignSelf={"center"}>
          <Button
            onClick={() => {
              onClose();
              logoutWeb3Auth();
            }}
            size="md"
            w="full"
            leftIcon={<FaDoorOpen />}
          >
            Logout
          </Button>
        </Tooltip>
        <VStack spacing={2}></VStack>
      </HStack>
    </VStack>
  );
};
