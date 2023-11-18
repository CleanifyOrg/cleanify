import { BigNumberish } from "ethers";
import {AnalyzeImageResponse} from "@api/chatgpt"

/**
 * This is the on chain state
 */
export type TrashifyReport = {
  id: BigNumberish;
  creator: string;
  // ipfs hash, pointing to metadata
  metadata: string;
  totalRewards: BigNumberish;
  state: number;
};

export type Coordinates = {
  lat: number;
  lng: number;
};

/**
 * IPFS Metadata
 */
export type RecordMetadata = AnalyzeImageResponse & {
  imageUris: string[];
}
