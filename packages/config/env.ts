export type Config = {
    web3AuthClientId: string;
    gelatoRelayApiKey: string;
    openAiApiKey: string;
    googleMapsApiKey: string;
    ipfsApiKey: string;
    ipfsSecretKey: string;
    ipfsGateway: string;
};

export const getEnvConfig = (): Config => {
    const web3AuthClientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID;
    const gelatoRelayApiKey = import.meta.env.VITE_GELATO_RELAY_API_KEY;
    const openAiApiKey = import.meta.env.VITE_OPEN_AI_API_KEY;
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const ipfsApiKey = import.meta.env.VITE_IPFS_API_KEY;
    const ipfsSecretKey = import.meta.env.VITE_IPFS_SECRET_KEY;
    const ipfsGateway = import.meta.env.VITE_IPFS_GATEWAY;

    if (!web3AuthClientId)
        throw new Error("VITE_WEB3AUTH_CLIENT_ID is not defined");
    if (!gelatoRelayApiKey)
        throw new Error("VITE_GELATO_RELAY_API_KEY is not defined");
    if (!openAiApiKey) throw new Error("VITE_OPEN_AI_API_KEY is not defined");
    if (!googleMapsApiKey)
        throw new Error("VITE_GOOGLE_MAPS_API_KEY is not defined");
    if (!ipfsApiKey) throw new Error("VITE_IPFS_API_KEY is not defined");
    if (!ipfsSecretKey) throw new Error("VITE_IPFS_SECRET_KEY is not defined");
    if (!ipfsGateway) throw new Error("VITE_IPFS_GATEWAY is not defined");

    return {
        web3AuthClientId,
        gelatoRelayApiKey,
        openAiApiKey,
        googleMapsApiKey,
        ipfsApiKey,
        ipfsSecretKey,
        ipfsGateway,
    };
};

const envConfig = getEnvConfig();

export default envConfig;
