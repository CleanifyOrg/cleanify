import { RecordMetadata } from "@models";
import { useCallback, useEffect, useState } from "react";
import { getFromIPFS } from "@utils/IPFSUtil.ts";

export const useReportMetadata = (metadataUri: string) => {
  const [metadata, setMetadata] = useState<RecordMetadata | null>(null);
  const [images, setImages] = useState<string[]>([]);

  const fetchMetadata = useCallback(async (uri: string) => {
    const metadata = JSON.parse(await getFromIPFS(uri)) as RecordMetadata;

    const images = await Promise.all(
      metadata.images.map((image) => getFromIPFS(image))
    );

    setImages(images);
    setMetadata(metadata);
  }, []);

  useEffect(() => {
    fetchMetadata(metadataUri).catch((e) => {
      console.error("Error fetching metadata:", e);
    });
  }, [fetchMetadata, metadataUri]);

  return {
    metadata,
    images,
  };
};
