import { useAccountAbstraction } from "@/store";
import {
  Box,
  Button,
  HStack,
  Heading,
  Hide,
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

import safeLogoDark from "src/assets/safe-info-logo-dark.svg";
import safeLogo from "src/assets/safe-info-logo-light.svg";
import { NetworkSelector } from "./NetworkSelector";
import { Routes } from "@/router";
import { ConnectedWalletModal } from "./ConnectedWalletModal";

import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { MobileDrawerMenu } from "./MobileDrawerMenu";

export const Navbar = () => {
  const {
    chainId,
    setChainId,
    isAuthenticated,
    loginWeb3Auth,
    ownerAddress,
    ownerLoading,
  } = useAccountAbstraction();

  const {
    isOpen: isMobileMenuOpen,
    onOpen: openMobileMenu,
    onClose: closeMobileMenu,
  } = useDisclosure();

  const {
    isOpen: isLoggedAccountModalOpen,
    onClose: closeLoggedAccountModal,
    onOpen: openLoggedAccountModal,
  } = useDisclosure();
  const safeLogSrc = useColorModeValue(safeLogo, safeLogoDark);

  const { toggleColorMode } = useColorMode();

  const navigate = useNavigate();

  const onLogoClick = () => {
    navigate(Routes.Home);
  };

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
      <MobileDrawerMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        openLoggedAccountModal={openLoggedAccountModal}
      />
      <ConnectedWalletModal
        isOpen={isLoggedAccountModalOpen}
        onClose={closeLoggedAccountModal}
      />
      <Heading size="md" flex={2} cursor={"pointer"} onClick={onLogoClick}>
        Cleanify
      </Heading>
      <Hide above="sm">
        <IconButton
          icon={<FaBars />}
          variant="empty"
          size="lg"
          aria-label="Open menu"
          onClick={openMobileMenu}
        />
      </Hide>
      <Hide below="sm">
        <HStack spacing={4} flex={1.5} justify={"flex-end"}>
          <NetworkSelector
            selectedChainId={chainId}
            setSelectedChainId={setChainId}
          />

          <Box>
            {!isAuthenticated ? (
              <Button
                size="md"
                onClick={loginWeb3Auth}
                isLoading={ownerLoading}
              >
                <HStack spacing={1} alignItems={"center"}>
                  <Image src={safeLogSrc} alt="Safe logo" boxSize={5} />
                  <Text>Login</Text>
                </HStack>
              </Button>
            ) : (
              <Skeleton isLoaded={!!ownerAddress}>
                {ownerAddress && (
                  <Button size="md" onClick={openLoggedAccountModal}>
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
      </Hide>
    </HStack>
  );
};
