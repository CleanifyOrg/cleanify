import { toHexString } from '@/utils'
import { ChainWithSafeConfig } from '@models'
import {
    polygonZkEvm,
    base,
    gnosis,
    arbitrum,
    mainnet,
    celo,
} from "viem/chains"


const baseWithSafeConfig: ChainWithSafeConfig = {
    ...base,
    id: toHexString(base.id),
    isStripePaymentsEnabled: false,
    isMoneriumPaymentsEnabled: false,
    color: '#3e6957',
    transactionServiceUrl: 'https://safe-transaction-base.safe.global',
    icon: "/icons/base.png"
}

const celoWithSafeConfig: ChainWithSafeConfig = {
    ...celo,
    id: toHexString(celo.id),
    isStripePaymentsEnabled: false,
    isMoneriumPaymentsEnabled: false,
    transactionServiceUrl: 'https://safe-transaction-celo.safe.global',
    icon: "/icons/celo-logo.png"
}

const gnosisWithSafeConfig: ChainWithSafeConfig = {
    ...gnosis,
    id: toHexString(gnosis.id),
    isStripePaymentsEnabled: false,
    isMoneriumPaymentsEnabled: false,
    color: '#3e6957',
    transactionServiceUrl: 'https://safe-transaction-gnosis-chain.safe.global',
    icon: "/icons/gnosis.png"
}


const polygonZkEvmWithSafeConfig: ChainWithSafeConfig = {
    ...polygonZkEvm,
    id: toHexString(polygonZkEvm.id),
    isStripePaymentsEnabled: false,
    isMoneriumPaymentsEnabled: false,
    color: '#8248E5',
    transactionServiceUrl: 'https://safe-transaction-zkevm.safe.global',
    icon: "/icons/zkevm.png"
}



const arbitrumWithSafeConfig: ChainWithSafeConfig = {
    ...arbitrum,
    id: toHexString(arbitrum.id),
    isStripePaymentsEnabled: false,
    isMoneriumPaymentsEnabled: false,
    color: '#3e6957',
    transactionServiceUrl: 'https://safe-transaction-arbitrum.safe.global',
    icon: "/icons/arbitrum.png"
}

const mainnetWithSafeConfig: ChainWithSafeConfig = {
    ...mainnet,
    id: toHexString(mainnet.id),
    isStripePaymentsEnabled: false,
    isMoneriumPaymentsEnabled: false,
    color: '#DDDDDD',
    transactionServiceUrl: 'https://safe-transaction-mainnet.safe.global',
    icon: "/icons/ethereum.png"
}



export const mainnets: ChainWithSafeConfig[] = [
    celoWithSafeConfig,
    mainnetWithSafeConfig,
    polygonZkEvmWithSafeConfig,
    // zkSyncWithSafeConfig,
    baseWithSafeConfig,
    gnosisWithSafeConfig,
    arbitrumWithSafeConfig,
]



export const defaultMainnetChain = baseWithSafeConfig

