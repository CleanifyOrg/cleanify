import { OpenAIHelper, blobToBase64, downloadBlob } from "@/utils";

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
  const imageBlob = await downloadBlob(imageBlobUrl);
  const base64Image = await blobToBase64(imageBlob);
  const prompt = `
                    I will send you several images depicting places that need cleaning. Please respond using a JSON object without comments and do not add any other descriptions and comments:
                    {
                    'isWastePresent': boolean,
                    'isWastePollution': boolean, // indicate whether the waste poses an environmental problem
                    'wasteKind': ['plastic', 'glass', 'paper', 'alluminium'],
                    'wasteDescription': 'string',
                    'estimatedWeight': 'number', // estimated weight of the waste in kilograms, It has not to be precise
                    'estimatedCost': 'number' // estimated cleaning cost by a cleaning company in euros
                    }
                `;

  const openaiHelper = new OpenAIHelper();
  try {
    const response = await openaiHelper.askChatGPTAboutImage({
      base64Image,
      prompt,
    });
    const jsonString = openaiHelper.getResponseJSONString(response);
    const result =
      openaiHelper.parseChatGPTJSONString<AnalyzeImageResponse>(jsonString);
    if (result) {
      return result;
    }
  } catch (e) {
    console.error("Failing fetching Chat GPT response:", e);
  }
  return FALLBACK_RESPONSE;
};
