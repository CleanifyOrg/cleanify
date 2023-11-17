import {useAccountAbstraction} from "@store"
import {useEffect, useState} from "react"
import {Trashify} from "@/typechain"
import {Trashify__factory as TrashifyFactory} from "@/typechain"

export const useTrashifyContract = () => {
  const {web3Provider, chain} = useAccountAbstraction()

  const [contract, setContract] = useState<Trashify>()

  useEffect(() => {
    if (web3Provider && chain?.contractAddress) {
      const contract = TrashifyFactory.connect(
        chain.contractAddress,
        web3Provider.getSigner(),
      )
      setContract(contract)
    }
  }, [chain?.contractAddress, web3Provider])

  return {
    contract
  }
}
