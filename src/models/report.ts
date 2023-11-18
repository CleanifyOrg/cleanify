import { AnalyzeImageResponse } from "@api/chatgpt";

export type BaseReport = {
  id: number;
  creator: string;
  metadata: string;
  totalRewards: number;
  state: ReportState;
};

export type Report = {
  metadata: ReportMetadata;
} & Omit<BaseReport, "metadata">;

export type ReportMetadata = {
  // entered by the user
  name: string;
  images: string[];
  location: {
    lat: number;
    lng: number;
  };
  analysis: AnalyzeImageResponse;
};

export enum ReportState {
  InReview,
  Available,
  PendingVerification,
  Cleaned,
  Rewarded,
}
