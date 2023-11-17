import {useAccountAbstraction} from "@store"
import {useEffect, useState} from "react"
import {Trashify} from "@/typechain"
import {trashifyContract} from "@/contracts/trashify-contract.ts"

export const useTrashifyContract = () => {
  const {web3Provider, chain} = useAccountAbstraction()

  const [contract, setContract] = useState<Trashify>()

  const {factory } = trashifyContract


  useEffect(() => {
    if (web3Provider && chain?.contractAddress) {
      const contract = factory.connect(
        chain.contractAddress,
        web3Provider,
      )
      setContract(contract)
    }
  }, [web3Provider])

  return {
    contract
  }
}
