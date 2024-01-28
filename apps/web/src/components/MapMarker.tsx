import { BaseReport, Report } from "@models/report.ts";
import { useReportMetadata } from "@hooks";
import { ReportModal } from "@components/MapComponent/ReportModal.tsx";
import { MarkerF as Marker } from "@react-google-maps/api";
import ColoredTrashIcon from "@/assets/colored-trash.png";
import Pointer from "@/assets/pointer.png";
import GreyTrashIcon from "@/assets/grey-trash.png";
import { Routes } from "@/router.tsx";
import { useGetReportMetadata } from "@/api/hooks";

type Props = {
  baseReport: BaseReport;
  activeReportID?: number;
  route: Routes;
  handleActiveMarker: (report: Report) => void;
  setActiveReportId: (id: number | undefined) => void;
};

export function MapMarker({
  baseReport,
  activeReportID,
  route,
  handleActiveMarker,
  setActiveReportId,
}: Props) {
  const { data: report } = useGetReportMetadata(baseReport);
  if (!report) return null;

  return (
    <Marker
      key={report.id}
      position={report.metadata.location}
      onClick={() => handleActiveMarker(report)}
      icon={
        activeReportID === report.id
          ? {
              url: Pointer,
              scaledSize: { width: 50, height: 50, equals: () => true },
            }
          : {
              url: report.state === 0 ? GreyTrashIcon : ColoredTrashIcon,
              scaledSize: { width: 50, height: 50, equals: () => true },
            }
      }
    >
      {activeReportID === report.id && route === Routes.Home && (
        <ReportModal
          report={report}
          onClose={() => setActiveReportId(undefined)}
        />
      )}
    </Marker>
  );
}
