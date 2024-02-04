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
import safeLogoDark from "src/assets/safe-info-logo-dark.svg";
import safeLogo from "src/assets/safe-info-logo-light.svg";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { AddressLabel } from ".";

import { NetworkSelector } from "./NetworkSelector";
import { Routes } from "@/router";
import { ConnectedWalletModal } from "./ConnectedWalletModal";

import { useAccountAbstraction, useChainStore } from "@/store";
import { MobileDrawerMenu } from "./MobileDrawerMenu";

export function Navbar() {
  const { isAuthenticated, loginWeb3Auth, ownerAddress, ownerLoading } =
    useAccountAbstraction();

  const { chainId, setChainId } = useChainStore();

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
  const logoSrc = useColorModeValue(
    "/logo/cleanify_light.png",
    "/logo/cleanify_dark.png"
  );

  const { toggleColorMode } = useColorMode();

  const navigate = useNavigate();

  const onLogoClick = () => {
    navigate(Routes.Home);
  };

  return (
    <HStack
      spacing={4}
      justify="space-between"
      position="static"
      top={0}
      right={0}
      w="100%"
      boxShadow="md"
      px={[2, 8]}
      py={[1, 2]}
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
      <HStack spacing={0}>
        <Image
          src={logoSrc}
          alt="Cleanify logo"
          boxSize={10}
          //   w="full"
          objectFit="cover"
        />
        <Heading size="md" flex={2} cursor="pointer" onClick={onLogoClick}>
          Cleanify
        </Heading>
      </HStack>
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
        <HStack spacing={4} flex={1.5} justify="flex-end">
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
                <HStack spacing={1} alignItems="center">
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
}
