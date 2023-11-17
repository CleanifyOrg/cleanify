import {create as ipfsHttpClient} from "ipfs-http-client";

export const IPFS_API_KEY: string = import.meta.env.VITE_IPFS_API_KEY
export const IPFS_SECRET_KEY: string = import.meta.env.VITE_IPFS_SECRET_KEY
export const IPFS_GATEWAY: string = import.meta.env.VITE_IPFS_GATEWAY

console.log("IPFS_API_KEY: ", import.meta.env);


const authorization = "Basic " + btoa(IPFS_API_KEY + ":" + IPFS_SECRET_KEY);

const ipfs = ipfsHttpClient({
  url: IPFS_GATEWAY,
  headers: {
    authorization,
  },
});


const uploadToIpfs = async (data: string, pin = true) => {
  const result = await ipfs.add(data,{
    pin,
  });

  return result.cid.toString();
}

const getFromIPFS = async (cid: string) => {

  if (cid.startsWith("ipfs://")) {
    cid = cid.slice(7);
  }

  const result = await ipfs.cat(cid);

  for await (const file of result) {
    return Buffer.from(file).toString('utf8')
  }

  throw new Error("No file found for CID: " + cid);
}

export {uploadToIpfs, getFromIPFS};
