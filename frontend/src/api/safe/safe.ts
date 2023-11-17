import axios, { RawAxiosRequestConfig } from 'axios'
import { utils, providers } from 'ethers'

import { getChain } from '@/chains'

/**
 * Returns true if the address is a contract, meaning the current safe has been deployed
 * @param address  the address to check
 * @param provider  the provider to use
 * @returns  true if the address is a contract
 */

export const isContractAddress = async (
    address: string,
    provider?: providers.Web3Provider
): Promise<boolean> => {
    try {
        const code = await provider?.getCode(address)

        return code !== '0x'
    } catch (error) {
        return false
    }
}

export type SafeInfoType = {
    address: string
    nonce: number
    threshold: number
    owners: string[]
}

export const getSafeInfo = async (
    safeAddress: string,
    connectedChainId: string,
    options?: RawAxiosRequestConfig
): Promise<SafeInfoType> => {
    const chain = getChain(connectedChainId)

    const address = utils.getAddress(safeAddress)

    // Mumbai has no transaction service because it is not part of our official UI https://app.safe.global/
    if (!chain?.transactionServiceUrl) {
        throw new Error(`No transaction service for ${chain?.label} chain`)
    }

    const url = `${chain?.transactionServiceUrl}/api/v1/safes/${address}/`

    const res = await axios.get(url, options)

    return res.data
}

