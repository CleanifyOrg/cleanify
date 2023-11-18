import {useAccountAbstraction} from "@store"
import { useMemo} from "react"
import {Trashify__factory as TrashifyFactory} from "@/typechain"
import {ethers} from "ethers"

export const useTrashifyContract = () => {
  const {web3Provider, chain} = useAccountAbstraction()


  const providerOrSigner = useMemo(() => {
    if (web3Provider) {
      return web3Provider.getSigner()
    } else {
      return new ethers.providers.JsonRpcProvider(chain.rpcUrls.default.http[0])
    }
  }, [
    web3Provider,
    chain
  ])

  const contract = useMemo(() => {
    return TrashifyFactory.connect(chain.contractAddress, providerOrSigner)
  }, [
    chain.contractAddress,
    providerOrSigner
  ])


  return {
    contract,
    providerOrSigner,
  }
}
