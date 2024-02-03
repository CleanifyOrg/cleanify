import {
    HStack,
    Heading,
    Hide,
    IconButton,
    Image,
    useColorMode,
    useColorModeValue,
    useDisclosure,
} from "@chakra-ui/react";
import { BsSun, BsMoon } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { WalletButton, useWalletModal } from "@vechain/dapp-kit-react";
import { useEffect, useState } from "react";
import { Routes } from "@/router";

import { MobileDrawerMenu } from "./MobileDrawerMenu";

export function Navbar() {
    const [connected, setConnected] = useState(false);
    console.log({ connected });

    const { onConnectionStatusChange } = useWalletModal();
    useEffect(() => {
        onConnectionStatusChange((address) => {
            setConnected(!!address);
        });
    });

    const {
        isOpen: isMobileMenuOpen,
        onOpen: openMobileMenu,
        onClose: closeMobileMenu,
    } = useDisclosure();

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
            />
            <HStack spacing={0}>
                <Image
                    src={logoSrc}
                    alt="Cleanify logo"
                    boxSize={10}
                    //   w="full"
                    objectFit="cover"
                />
                <Heading
                    size="md"
                    flex={2}
                    cursor="pointer"
                    onClick={onLogoClick}
                >
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
                    <WalletButton />
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
