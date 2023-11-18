import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  MarkerF as Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { ReportModal } from "./ReportModal";
import { Report } from "@/types/report";
import { useMapConfig } from "./useMapConfig";
import ColoredTrashIcon from "@/assets/colored-trash.png";
import GreyTrashIcon from "@/assets/grey-trash.png";
import { Routes } from "@/router";
import { useNavigate } from "react-router-dom";
import { useReportList } from "@/hooks";

const containerStyle = {
  height: "100%",
  width: "100%",
};

const MapComponentContent = ({
  defaultMapCenter,
  defaultActiveReport,
  route,
}: {
  route: Routes;
  defaultActiveReport?: number;
  defaultMapCenter?: {
    lat: number;
    lng: number;
  };
}) => {
  const [center, setCenter] = useState(
    defaultMapCenter || { lat: 40.7485612, lng: -73.9881861 }
  );
  const [activeReportID, setActiveReportId] = useState<number | undefined>(
    defaultActiveReport
  );
  const navigate = useNavigate();

  const { colorConfig } = useMapConfig();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  const reports = useReportList();

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (map: any) => {
      // TODO: I don't think we will need this but let's leave it
      // const bounds = new window.google.maps.LatLngBounds(center);
      // map.fitBounds(bounds);

      setMap(map);
    },
    []
  );

  const onUnmount = React.useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    if (route === Routes.Home) {
      navigator.geolocation.getCurrentPosition((location) => {
        setCenter({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
      });
    }
  }, [map, route]);

  const handleActiveMarker = (report: Report) => {
    if (report.id !== activeReportID) {
      setActiveReportId(report.id);
    }
    if (route === Routes.Report) {
      navigate(`/report/${report.id}`);
    }
  };

  return isLoaded ? (
    <GoogleMap
      options={{
        styles: colorConfig,
      }}
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {(reports as Report[]).map((report: Report) => (
        <Marker
          key={activeReportID === report.id ? `${report.id}-active` : report.id}
          position={report.metadata.location}
          onClick={() => handleActiveMarker(report)}
          icon={{
            url:
              activeReportID === report.id ? ColoredTrashIcon : GreyTrashIcon,
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
      ))}
    </GoogleMap>
  ) : null;
};

export const MapComponent = React.memo(MapComponentContent);
