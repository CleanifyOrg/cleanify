import { BaseReport, Report } from "@models/report.ts";
import { useReportMetadata } from "@hooks";
import ColoredTrashIcon from "@/assets/colored-trash.png";
import GreyTrashIcon from "@/assets/grey-trash.png";
import { Routes } from "@/router.tsx";
import { ReportModal } from "@components/MapComponent/ReportModal.tsx";
import { MarkerF as Marker } from "@react-google-maps/api";

type Props = {
  baseReport: BaseReport;
  activeReportID?: number;
  route: Routes;
  handleActiveMarker: (report: Report) => void;
  setActiveReportId: (id: number | undefined) => void;
};

export const MapMarker = ({
  baseReport,
  activeReportID,
  route,
  handleActiveMarker,
  setActiveReportId,
}: Props) => {
  const { report } = useReportMetadata(baseReport);
  if (!report) return <></>;

  return (
    <Marker
      key={report.id}
      position={report.metadata.location}
      onClick={() => handleActiveMarker(report)}
      icon={{
        url: activeReportID === report.id ? ColoredTrashIcon : GreyTrashIcon,
        scaledSize: { width: 50, height: 50, equals: () => true },
      }}
    >
      {activeReportID === report.id && route === Routes.Home && (
        <ReportModal
          report={report}
          onClose={() => setActiveReportId(undefined)}
        />
      )}
    </Marker>
  );
};
