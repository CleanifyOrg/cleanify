import {AnalyzeImageResponse} from "@api/chatgpt"

export type BaseReport = {
  id: number;
  creator: string;
  metadata: string;
  totalRewards: number;
  state: ReportState;

};
export type ContractReport = {
  metadata: string;
} & BaseReport;

export type Report = {
  metadata: ReportMetadata;
} & BaseReport;

export type ReportMetadata = AnalyzeImageResponse & {
  // entered by the user
  name: string;
  description: string;
  images: string[];
  location: {
    lat: number;
    lng: number;
  };
};

enum WasteKind {
  Plastic = "plastic",
  Glass = "glass",
  Paper = "paper",
  Generic = "generic",
}

enum ReportState {
  InReview ,
  Available,
  PendingVerification,
  Cleaned,
  Rewarded,
}
