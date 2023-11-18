export const downloadBlob = async (url: string) => {
    const response = await fetch(url);
    return await response.blob();
};

export const blobToBase64 = async (blob: Blob): Promise<string> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
    });
};
