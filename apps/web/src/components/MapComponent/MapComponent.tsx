import React, { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { BaseReport, Report } from "@models/report.ts";
import { useNavigate } from "react-router-dom";
import { MapMarker } from "@components/MapMarker.tsx";
import { envConfig } from "@repo/config";
import { useMapConfig } from "./useMapConfig";
import { Routes } from "@/router";
import { useReports } from "@/api/contract";

const containerStyle = {
    height: "100%",
    width: "100%",
};

// TODO: refactor to be more generic and with less conditionals
function MapComponentContent({
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
}) {
    const { data: reports } = useReports();
    const [center, setCenter] = useState(
        defaultMapCenter || { lat: 41.0463678, lng: 28.9863605 }
    );
    const [activeReportId, setActiveReportId] = useState<number | undefined>(
        defaultActiveReport
    );
    const navigate = useNavigate();

    const { colorConfig } = useMapConfig();

    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: envConfig.googleMapsApiKey,
    });

    const [map, setMap] = React.useState<google.maps.Map>();

    const onLoad = React.useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (_map: google.maps.Map) => {
            // TODO: I don't think we will need this but let's leave it
            // const bounds = new window.google.maps.LatLngBounds(center);
            // map.fitBounds(bounds);

            setMap(_map);
        },
        []
    );

    const onUnmount = React.useCallback(() => {
        setMap(undefined);
    }, []);

    // default center to current location
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
        setActiveReportId(report.id);
        if (route === Routes.Report) {
            navigate(`/report/${report.id}`);
        }
    };

    if (!isLoaded) return null;

    return (
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
            {reports?.map((baseReport: BaseReport) => (
                <MapMarker
                    key={
                        baseReport.id === activeReportId
                            ? `${baseReport.id}-active`
                            : baseReport.id
                    }
                    route={route}
                    baseReport={baseReport}
                    activeReportID={activeReportId}
                    setActiveReportId={setActiveReportId}
                    handleActiveMarker={handleActiveMarker}
                />
            ))}
        </GoogleMap>
    );
}

export const MapComponent = React.memo(MapComponentContent);
