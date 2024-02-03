import { useColorMode } from "@chakra-ui/react";
import { WalletConnectOptions } from "@vechain/dapp-kit";
import { DAppKitProvider } from "@vechain/dapp-kit-react";
import { ReactElement } from "react";

const walletConnectOptions: WalletConnectOptions = {
    projectId: "a0b855ceaf109dbc8426479a4c3d38d8",
    metadata: {
        name: "Sample VeChain dApp",
        description: "A sample VeChain dApp",
        url: window.location.origin,
        icons: [`${window.location.origin}/images/logo/my-dapp.png`],
    },
};

export const VeChainKitProvider = ({
    children,
}: {
    children: ReactElement;
}) => {
    const { colorMode } = useColorMode();

    return (
        <DAppKitProvider
            nodeUrl="https://testnet.vechain.org/"
            genesis="test"
            usePersistence
            walletConnectOptions={walletConnectOptions}
            themeMode={colorMode === "dark" ? "DARK" : "LIGHT"}
        >
            {children}
        </DAppKitProvider>
    );
};
