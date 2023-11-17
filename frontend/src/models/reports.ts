export enum TrashifyState {
  InReview,
  Available,
  PendingVerification,
  Cleaned,
  Rewarded
}


export type TrashifyReport = {
  id: number;
  creator: string;
  state: TrashifyState;
  cleaners: string[];
  metadata: string;
  proofs: string[];
  totalRewards: number;
}

export type Coordinates = {
  lat: number
  long: number
}

export type RecordMetadata = {
  coordinates: Coordinates
  name: string
  description: string
  images: string[]
}
