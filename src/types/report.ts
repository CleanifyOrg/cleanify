export type BaseReport = {
  id: number;
  creator: string;
  cleaners: string[];
  proofs: string[];
  state: ReportState;
  totalRewards: number;
};
export type ContractReport = {
  metadata: string;
} & BaseReport;

export type Report = {
  metadata: ReportMetadata;
} & BaseReport;

export type ReportMetadata = {
  // entered by the user
  name: string;
  description: string;
  image: string;
  location: {
    lat: number;
    lng: number;
  };
  // calculated by chatgpt
  isWastePresent: boolean;
  wasteDescription: string;
  isWastePollution: boolean; // indicate whether the waste is an environmental problem
  wasteKind: WasteKind;
  estimatedWeight: "string"; // estimated weight of the waste in kilograms
  estimatedCost: "string"; // estimated cleaning cost by a company
};

enum WasteKind {
  Plastic = "plastic",
  Glass = "glass",
  Paper = "paper",
  Generic = "generic",
}

enum ReportState {
  InReview = "InReview", // user submitted a report and moderators are reviewing it
  Available = "Available", // moderators verified the content and approved it
  PendingVerification = "PendingVerification", // user cleaned the field and submitted the proof for verification
  Cleaned = "Cleaned", // moderators verified the proof and closed the report
  Rewarded = "Rewarded", // users claimed their rewards and the report can be considered closed
}
