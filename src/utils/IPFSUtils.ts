import { create as ipfsHttpClient } from "ipfs-http-client";

export const IPFS_API_KEY: string = import.meta.env.VITE_IPFS_API_KEY;
export const IPFS_SECRET_KEY: string = import.meta.env.VITE_IPFS_SECRET_KEY;
export const IPFS_GATEWAY: string = import.meta.env.VITE_IPFS_GATEWAY;

const authorization = "Basic " + btoa(IPFS_API_KEY + ":" + IPFS_SECRET_KEY);

const ipfs = ipfsHttpClient({
  url: IPFS_GATEWAY,
  headers: {
    authorization,
  },
});

const uploadToIpfs = async (data: string, pin = true) => {
  const result = await ipfs.add(data, {
    pin,
  });

  return result.cid.toString();
};

const getFromIPFS = async (cid: string) => {
  if (cid.startsWith("ipfs://")) {
    cid = cid.slice(7);
  }

  const result = await ipfs.cat(cid);

  const data = [];

  for await (const file of result) {
    data.push(Buffer.from(file).toString("utf8"));
  }

  return data.join("");
};

const isIpfsCid = (cid: string) => {
  //Qm[1-9A-Za-z]{44}

  const regex = new RegExp("Qm[1-9A-Za-z]{44}");

  return regex.test(cid) && cid.length === 46;
}

export { uploadToIpfs, getFromIPFS, isIpfsCid };
