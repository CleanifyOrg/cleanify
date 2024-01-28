import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { chains, defaultTestnetChain } from '@/chains';
import { ChainWithSafeConfig } from '@/models';


type Props = {
    chainId: string;
    setChainId: (chainId: string) => void;
    getChain: (chainId: string) => ChainWithSafeConfig;
}
export const useChainStore = create<Props>()(
    persist(
        (set, get) => ({
            chainId: defaultTestnetChain.id,
            setChainId: (chainId: string) => set({ ...get(), chainId }),
            getChain: (chainId: string) => chains.find((chain) => chain.id === chainId) || defaultTestnetChain,
        }),
        {
            name: 'chain-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        },
    ),
)


export const useCurrentChain = () => {
    const { getChain, chainId } = useChainStore();
    return getChain(chainId);

}