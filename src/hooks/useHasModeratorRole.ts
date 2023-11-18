import {useCleanifyContract} from "@hooks/useCleanifyContract.ts"
import {useEffect, useState} from "react"
import {ethers} from "ethers"
import {useAccountAbstraction} from "@store"

export const useHasModeratorRole = () => {

  const [hasModeratorRole, setHasModeratorRole] = useState<boolean>(false)

  const { contract, providerOrSigner } = useCleanifyContract();

  const {ownerAddress } = useAccountAbstraction();

  const checkForRole = async () => {

    if (ownerAddress && providerOrSigner instanceof ethers.providers.JsonRpcSigner) {
      const role = await contract.MODERATORS()

      const hasRole = await contract.hasRole(role, ownerAddress)

      if (hasRole) {
        setHasModeratorRole(true)
      }
    }
  }

  useEffect(() => {
    checkForRole()
  }, [contract])

  return {
    hasModeratorRole
  }

}
