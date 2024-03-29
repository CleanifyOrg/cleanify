import { useEffect, useState } from "react";
import { base64ToBlob } from "@/utils";

export const useBase64Image = (image: string) => {
  const [blobImage, setBlobImage] = useState<string>();

  useEffect(() => {
    async function getBase64Image() {
      const blob = await base64ToBlob(image);
      const blobUrl = URL.createObjectURL(blob);
      setBlobImage(blobUrl);
    }
    getBase64Image();
  }, [image]);

  return { blobImage };
};
