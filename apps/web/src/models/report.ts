import { AnalyzeImageResponse } from "@api/chatgpt";

export enum ReportState {
    InReview,
    Available,
    PendingVerification,
    Cleaned,
}

export type BaseReport = {
    id: number;
    creator: string;
    metadata: string;
    totalRewards: string;
    state: ReportState;
};

export type ReportWithProofs = BaseReport & {
    proofs: string[];
};

export type ReportMetadata = {
    // entered by the user
    name?: string;
    description?: string;
    images: string[];
    location: {
        lat: number;
        lng: number;
    };
    analysis: AnalyzeImageResponse;
};

export type Report = {
    metadata: ReportMetadata;
} & Omit<ReportWithProofs, "metadata">;
