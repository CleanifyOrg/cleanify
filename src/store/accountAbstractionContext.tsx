import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ethers, utils } from "ethers";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { Web3AuthOptions } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import AccountAbstraction from "@safe-global/account-abstraction-kit-poc";
import { Web3AuthModalPack } from "@safe-global/auth-kit";

//gasless transactions https://docs.safe.global/safe-core-aa-sdk/relay-kit/guides/gelato
import { GelatoRelayPack } from "@safe-global/relay-kit";

import { defaultTestnetChain, getChain } from "@/chains";
import { usePolling } from "@hooks";
import { ChainWithSafeConfig } from "@models";
import { TransactionStatusResponse } from "@gelatonetwork/relay-sdk";

type accountAbstractionContextValue = {
  ownerAddress?: string;
  ownerLoading: boolean;
  chainId: string;
  safes: string[];
  chain: ChainWithSafeConfig;
  isAuthenticated: boolean;
  web3Provider?: ethers.providers.Web3Provider;
  loginWeb3Auth: () => void;
  logoutWeb3Auth: () => void;
  setChainId: (chainId: string) => void;
  safeSelected?: string;
  safeSelectedLoading?: boolean;
  safeBalance?: string;
  setSafeSelected: React.Dispatch<React.SetStateAction<string>>;
  isRelayerLoading: boolean;
  relayTransaction: (params: {
    data: string;
    value: string | undefined;
    to: string;
  }) => Promise<string>;
  gelatoTaskId?: string;
  getSafeAccount: () => Promise<string>;
};

const initialState = {
  isAuthenticated: false,
  ownerLoading: false,
  loginWeb3Auth: () => {},
  logoutWeb3Auth: () => {},
  relayTransaction: async () => {
    throw new Error("Not ready");
  },
  setChainId: () => {},
  setSafeSelected: () => {},
  onRampWithStripe: async () => {},
  safes: [],
  chain: defaultTestnetChain,
  chainId: defaultTestnetChain.id,
  isRelayerLoading: true,
  getSafeAccount: async () => {
    throw new Error("Not ready");
  },
};

const accountAbstractionContext =
  createContext<accountAbstractionContextValue>(initialState);

const useAccountAbstraction = () => {
  const context = useContext(accountAbstractionContext);

  if (!context) {
    throw new Error(
      "useAccountAbstraction should be used within a AccountAbstraction Provider"
    );
  }

  return context;
};

const AccountAbstractionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // owner address from the email  (provided by web3Auth)
  const [ownerAddress, setOwnerAddress] = useState<string>("");
  const [ownerLoading, setOwnerLoading] = useState<boolean>(false);

  // safes owned by the user
  const [safes, setSafes] = useState<string[]>([]);

  // chain selected
  const [chainId, setChainId] = useState<string>(defaultTestnetChain.id);
  const isAuthenticated = !!ownerAddress && !!chainId;
  const chain = useMemo(
    () => getChain(chainId) ?? defaultTestnetChain,
    [chainId]
  );

  // web3 provider to perform signatures
  const [web3Provider, setWeb3Provider] =
    useState<ethers.providers.Web3Provider>();

  // reset React state when you switch the chain
  useEffect(() => {
    setOwnerAddress("");
    setSafes([]);
    setChainId(chain.id);
    setWeb3Provider(undefined);
    setSafeSelected("");
  }, [chain]);

  // authClient
  const [web3AuthModalPack, setWeb3AuthModalPack] =
    useState<Web3AuthModalPack>();

  useEffect(() => {
    (async () => {
      const options: Web3AuthOptions = {
        clientId: import.meta.env.VITE_WEB3AUTH_CLIENT_ID ?? "",
        web3AuthNetwork: import.meta.env.PROD ? "mainnet" : "testnet",
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: chain.id,
          rpcTarget: chain.rpcUrls.default.http[0],
        },
        uiConfig: {
          theme: "dark",
          loginMethodsOrder: ["google", "facebook"],
          appName: "Cleanify",
        },
      };

      const modalConfig = {
        [WALLET_ADAPTERS.TORUS_EVM]: {
          label: "torus",
          showOnModal: false,
        },
        [WALLET_ADAPTERS.METAMASK]: {
          label: "metamask",
          showOnDesktop: true,
          showOnMobile: false,
        },
      };

      const openloginAdapter = new OpenloginAdapter({
        loginSettings: {
          mfaLevel: "none",
        },
        adapterSettings: {
          uxMode: "popup",
          whiteLabel: {
            name: "Safe",
          },
        },
      });

      const web3AuthModalPack = new Web3AuthModalPack({
        txServiceUrl: chain.transactionServiceUrl,
      });

      await web3AuthModalPack.init({
        options,
        adapters: [openloginAdapter],
        modalConfig,
      });

      setWeb3AuthModalPack(web3AuthModalPack);
    })();
  }, [chain]);

  // auth-kit implementation
  const loginWeb3Auth = useCallback(async () => {
    if (!web3AuthModalPack) return;

    try {
      setOwnerLoading(true);
      const { safes, eoa } = await web3AuthModalPack.signIn();
      const provider =
        web3AuthModalPack.getProvider() as ethers.providers.ExternalProvider;

      // we set react state with the provided values: owner (eoa address), chain, safes owned & web3 provider
      setOwnerAddress(eoa);
      setSafes(safes ?? []);
      setWeb3Provider(new ethers.providers.Web3Provider(provider));
      setOwnerLoading(false);
    } catch (error) {
      console.log("error: ", error);
    }
  }, [web3AuthModalPack]);

  useEffect(() => {
    if (web3AuthModalPack?.getProvider()) {
      (async () => {
        await loginWeb3Auth();
      })();
    }
  }, [web3AuthModalPack, loginWeb3Auth]);

  const logoutWeb3Auth = () => {
    web3AuthModalPack?.signOut();
    setOwnerAddress("");
    setSafes([]);
    setWeb3Provider(undefined);
    setSafeSelected("");
    setGelatoTaskId(undefined);
  };

  // current safe selected by the user
  const [safeSelected, setSafeSelected] = useState<string>("");
  const [safeSelectedLoading, setSelectedSafeLoading] =
    useState<boolean>(false);

  // TODO: add disconnect owner wallet logic ?

  // conterfactual safe Address if its not deployed yet
  useEffect(() => {
    const getSafeAddress = async () => {
      if (web3Provider) {
        setSelectedSafeLoading(true);
        const signer = web3Provider.getSigner();
        const key: string = import.meta.env.VITE_GELATO_RELAY_API_KEY;
        const relayPack = new GelatoRelayPack(key);
        const safeAccountAbstraction = new AccountAbstraction(signer);

        await safeAccountAbstraction.init({ relayPack });

        const hasSafes = safes.length > 0;

        const safeSelected = hasSafes
          ? safes[0]
          : await safeAccountAbstraction.getSafeAddress();

        setSafeSelected(safeSelected);
        setSelectedSafeLoading(false);
      }
    };

    getSafeAddress();
  }, [safes, web3Provider]);

  const [isRelayerLoading, setIsRelayerLoading] = useState<boolean>(false);
  const [gelatoTaskId, setGelatoTaskId] = useState<string>();

  // refresh the Gelato task id
  useEffect(() => {
    setIsRelayerLoading(false);
    setGelatoTaskId(undefined);
  }, [chainId]);

  // relay-kit implementation using Gelato
  const relayTransaction: accountAbstractionContextValue["relayTransaction"] =
    async ({ data, value, to }): Promise<string> => {
      if (web3Provider) {
        setIsRelayerLoading(true);

        const signer = web3Provider.getSigner();
        const key: string = import.meta.env.VITE_GELATO_RELAY_API_KEY;
        const relayPack = new GelatoRelayPack(key);
        const safeAccountAbstraction = new AccountAbstraction(signer);

        await safeAccountAbstraction.init({ relayPack });

        const _chainId = parseInt(chainId);

        const response = await relayPack.sendSponsorTransaction(
          to,
          data,
          _chainId
        );

        console.log(
          `Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${response.taskId}`
        );

        let status: TransactionStatusResponse | undefined;

        for (let i = 0; i < 10; i++) {
          status = await relayPack.getTaskStatus(response.taskId);
          console.log("status", status);

          if (status?.lastCheckMessage?.includes("Execution error")) {
            throw new Error("Transaction failed: " + JSON.stringify(status));
          }

          if (status && status.transactionHash) {
            break;
          }

          await new Promise((r) => setTimeout(r, 3000));
        }

        if (!status?.transactionHash) {
          throw new Error("Transaction failed: " + JSON.stringify(status));
        }

        setIsRelayerLoading(false);
        setGelatoTaskId(gelatoTaskId);

        return status.transactionHash;
      }
    };

  // we can pay Gelato tx relayer fees with native token & USDC
  // TODO: ADD native Safe Balance polling
  // TODO: ADD USDC Safe Balance polling

  // fetch safe address balance with polling
  const fetchSafeBalance = useCallback(async () => {
    const balance = await web3Provider?.getBalance(safeSelected);

    return balance?.toString();
  }, [web3Provider, safeSelected]);

  const safeBalance = usePolling(fetchSafeBalance);

  const getSafeAccount = useCallback(async () => {
    if (!web3Provider) return "";

    const key: string = import.meta.env.VITE_GELATO_RELAY_API_KEY;
    const relayPack = new GelatoRelayPack(key);

    const signer = web3Provider.getSigner(ownerAddress);

    const safeAccountAbstraction = new AccountAbstraction(signer);

    await safeAccountAbstraction.init({ relayPack });

    return await safeAccountAbstraction.getSafeAddress();
  }, [web3Provider, ownerAddress]);

  const state = {
    ownerAddress,
    ownerLoading,
    chainId,
    chain,
    safes,

    isAuthenticated,

    web3Provider,

    loginWeb3Auth,
    logoutWeb3Auth,

    setChainId,

    safeSelected,
    safeBalance,
    setSafeSelected,
    safeSelectedLoading,

    getSafeAccount,

    isRelayerLoading,
    relayTransaction,
    gelatoTaskId,
  };

  return (
    <accountAbstractionContext.Provider value={state}>
      {children}
    </accountAbstractionContext.Provider>
  );
};

export { useAccountAbstraction, AccountAbstractionProvider };
