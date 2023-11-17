import {RecordMetadata} from "@models"
import {useCallback, useEffect, useState} from "react"
import {getFromIPFS} from "@utils/IPFSUtil.ts"

export const useReportMetadata = (metadataUri: string) => {

  const [metadata, setMetadata] = useState<RecordMetadata | null>(null)
  const [images, setImages] = useState<string[]>([])

  const fetchMetadata = useCallback(async () => {
    const metadata = await getFromIPFS(metadataUri)
    setMetadata(JSON.parse(metadata))
  }, [metadataUri])

  const fetchImages = useCallback( async (_metadata: RecordMetadata) => {
    for (let i = 0; i < _metadata.images.length; i++) {
      const image = await getFromIPFS(_metadata.images[i])
      setImages((images) => [...images, image])
    }
  }, [])

  useEffect(() => {
    fetchMetadata().catch((e) => {
      console.error("Error fetching metadata:", e)
    })
  }, [fetchMetadata, metadataUri])


  useEffect(() => {
    if (metadata) {
      fetchImages(metadata).catch((e) => {
        console.error("Error fetching images:", e)
      })
    }
  }, [
    metadata, fetchImages
  ])

  useEffect(() => {
    console.log("metadata: ", metadata)
  }, [metadata, images])

  return {
    metadata,
    images
  }
}
