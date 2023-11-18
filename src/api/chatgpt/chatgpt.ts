
export type AnalyzeImageResponse = {
    isWastePresent: boolean;
    isWastePollution: boolean;
    wasteKind: string[];
    description: string;
    estimatedWeight: string;
    estimatedCost: string;
};

const FALLBACK_RESPONSE = {
    isWastePresent: false,
    isWastePollution: false,
    wasteKind: [],
    description: "N.A.",
    estimatedWeight: "N.A.",
    estimatedCost: "N.A.",
};

export const analyzeImage = async (
    imageBlobUrl: string
): Promise<AnalyzeImageResponse> => {

    return {
        isWastePresent: true,
        isWastePollution: true,
        wasteKind: [],
        description: "lorem ipsum dolor sit amet",
        estimatedWeight: "1000",
        estimatedCost: "100",
    }
};
