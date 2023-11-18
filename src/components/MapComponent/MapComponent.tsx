import React, { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { BaseReport, Report } from "@models/report.ts";
import { useMapConfig } from "./useMapConfig";
import { Routes } from "@/router";
import { useNavigate } from "react-router-dom";
import { useTrashifyReports } from "@hooks";
import { MapMarker } from "@components/MapMarker.tsx";

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

  const { baseReports } = useTrashifyReports();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

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
      {(baseReports as BaseReport[]).map((baseReport: BaseReport) => {
        return (
          <MapMarker
            route={route}
            baseReport={baseReport}
            activeReportID={activeReportID}
            setActiveReportId={setActiveReportId}
            handleActiveMarker={handleActiveMarker}
          />
        );
      })}
    </GoogleMap>
  ) : null;
};

export const MapComponent = React.memo(MapComponentContent);
