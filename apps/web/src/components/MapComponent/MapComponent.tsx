import React, { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { BaseReport, Report } from "@models/report.ts";
import { useMapConfig } from "./useMapConfig";
import { Routes } from "@/router";
import { useNavigate } from "react-router-dom";
import { MapMarker } from "@components/MapMarker.tsx";
import { useReports } from "@/api/hooks";
import {useTrashifyReports} from "@hooks"

const containerStyle = {
  height: "100%",
  width: "100%",
};

//TODO: refactor to be more generic and with less conditionals
const MapComponentContent = ({
  defaultMapCenter,
  defaultActiveReport,
  route,
  onMapClick,
  defaultCenterCurrentLocation = true,
}: {
  route: Routes;
  defaultActiveReport?: number;
  defaultMapCenter?: {
    lat: number;
    lng: number;
  };
  defaultCenterCurrentLocation?: boolean;
  onMapClick?: (le: google.maps.MapMouseEvent) => void;
}) => {
  const {baseReports: reports} = useTrashifyReports()
  const [center, setCenter] = useState(
    defaultMapCenter || { lat: 41.0463678, lng: 28.9863605 }
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

  //default center to current location
  useEffect(() => {
    if (defaultCenterCurrentLocation) {
      navigator.geolocation.getCurrentPosition((location) => {
        setCenter({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
      });
    }
  }, [defaultCenterCurrentLocation]);

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
      onClick={onMapClick}
    >
      {reports?.map((baseReport: BaseReport) => {
        return (
          <MapMarker
            key={
              baseReport.id === activeReportID
                ? `${baseReport.id}-active`
                : baseReport.id
            }
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
