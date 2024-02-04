import { useQuery } from "@tanstack/react-query";
import { BaseReport } from "@/models";
import { getReportMetadata } from "../endpoints";

export const reportMetadataQueryKey = (id?: number) => ["REPORT_METADATA", id];

export const useReportMetadata = (baseReport?: BaseReport) =>
    useQuery({
        queryKey: reportMetadataQueryKey(baseReport?.id),
        queryFn: () => (baseReport ? getReportMetadata(baseReport) : null),
        enabled: !!baseReport,
    });
