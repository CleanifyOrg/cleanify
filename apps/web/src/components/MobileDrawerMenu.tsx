import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Image,
  Text,
  VStack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsMoon, BsSun } from "react-icons/bs";
import safeLogoDark from "src/assets/safe-info-logo-dark.svg";
import safeLogo from "src/assets/safe-info-logo-light.svg";
import { NetworkSelector } from "./NetworkSelector";
import { useAccountAbstraction } from "@/store";
import { AddressLabel } from "./AddressLabel";


type Props = {
  isOpen: boolean;
  onClose: () => void;
  openLoggedAccountModal: () => void;
};
export const MobileDrawerMenu: React.FC<Props> = ({
  isOpen,
  onClose,
  openLoggedAccountModal,
}) => {
  const {
    chainId,
    setChainId,
    isAuthenticated,
    loginWeb3Auth,
    ownerAddress,
    ownerLoading,
  } = useAccountAbstraction();

  const safeLogSrc = useColorModeValue(safeLogo, safeLogoDark);

  const colorMode = useColorModeValue(
    { label: "Dark", icon: <BsMoon /> },
    { label: "Light", icon: <BsSun /> }
  );

  const { toggleColorMode } = useColorMode();

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          <Box w="70%">
            <NetworkSelector
              selectedChainId={chainId}
              setSelectedChainId={setChainId}
            />
          </Box>
        </DrawerHeader>

        <DrawerBody>
          <VStack spacing={4} justify="stretch" align="stretch" w="full">
            <Box>
              {!isAuthenticated ? (
                <Button
                  size="md"
                  onClick={loginWeb3Auth}
                  isLoading={ownerLoading}
                  w="full"
                >
                  <HStack spacing={1} alignItems="center">
                    <Image src={safeLogSrc} alt="Safe logo" boxSize={5} />
                    <Text>Login</Text>
                  </HStack>
                </Button>
              ) : (
                <>
                  {ownerAddress && (
                    <Button size="md" onClick={openLoggedAccountModal} w="full">
                      <AddressLabel
                        address={ownerAddress}
                        showCopyIntoClipboardButton={false}
                      />
                    </Button>
                  )}
                </>
              )}
            </Box>
          </VStack>
        </DrawerBody>

        <DrawerFooter>
          <Button
            w="full"
            aria-label="Mode Change"
            variant="outline"
            colorScheme="black"
            size="lg"
            leftIcon={colorMode.icon}
            onClick={toggleColorMode}
          >
            {colorMode.label}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
