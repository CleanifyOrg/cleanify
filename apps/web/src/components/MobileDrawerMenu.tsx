import {
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerOverlay,
    VStack,
    useColorMode,
    useColorModeValue,
} from "@chakra-ui/react";
import { BsMoon, BsSun } from "react-icons/bs";
import { WalletButton } from "@vechain/dapp-kit-react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};
export const MobileDrawerMenu = ({ isOpen, onClose }: Props) => {
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

                <DrawerBody>
                    <VStack
                        spacing={4}
                        justify="stretch"
                        align="stretch"
                        w="full"
                    >
                        <WalletButton />
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
