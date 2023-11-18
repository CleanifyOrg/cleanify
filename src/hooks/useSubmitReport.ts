import { useMemo, useState } from "react"
import { useTrashifyContract } from "@hooks/useTrashifyContract.ts"
import { Coordinates, RecordMetadata } from "@models"
import { uploadToIpfs } from "@utils/IPFSUtil.ts"
import { NewReportSubmitedEvent } from "@/typechain/Trashify.ts"

export const useSubmitReport = () => {

    const { contract } = useTrashifyContract()

    const [title, setTitle] = useState<string>()
    const [description, setDescription] = useState<string>()
    const [images, setImages] = useState<string[]>([])
    const [coordinates, setCoordinates] = useState<Coordinates>()


    const canCreate = useMemo(() => {
        return !!title && !!description && !!images && !!coordinates && !!contract
    }, [
        title,
        description,
        images,
        coordinates,
        contract
    ])


    const createReport = async (): Promise<NewReportSubmitedEvent> => {
        if (!contract || !title || !description || !images || !coordinates || !contract)
            throw new Error("Can't create report")

        const imageUris = await Promise.all(images.map((image) => {
            return uploadToIpfs(image)
        }))

        const metadata: RecordMetadata = {
            title,
            description,
            images: imageUris,
            coordinates
        }

        const metadataUri = await uploadToIpfs(JSON.stringify(metadata))

        const tx = await contract.submitReport(metadataUri)

        const receipt = await tx.wait()

        console.log({ receipt })

        const events = await contract.queryFilter(contract.filters.NewReportSubmited(), receipt.blockNumber, receipt.blockNumber)

        return events.filter((event) => event.transactionHash === tx.hash)[0]
    }


    return {
        setCoordinates,
        setImages,
        setDescription,
        setTitle,
        canCreate,
        createReport,
    }
}
