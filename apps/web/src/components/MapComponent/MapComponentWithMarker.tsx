import React, { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import { useMapConfig } from "./useMapConfig";
import GreyTrashIcon from "@/assets/grey-trash.png";

const containerStyle = {
  height: "100%",
  width: "100%",
};

// TODO: refactor to be more generic and with less conditionals
function MapWithMarkerComponentContent({
  markerLocation,
  onMapClick,
  defaultCenterCurrentLocation = true,
  onIsMapLoaded,
}: {
  markerLocation?: google.maps.LatLng | google.maps.LatLngLiteral;
  defaultCenterCurrentLocation?: boolean;
  onMapClick?: (le: google.maps.MapMouseEvent) => void;
  onIsMapLoaded?: (isLoaded: boolean) => void;
}) {
  const [center, setCenter] = useState<{ lat: number; lng: number }>();

  const { colorConfig } = useMapConfig();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

    const [map, setMap] = React.useState<google.maps.Map>();

    const onLoad = React.useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (_map: google.maps.Map) => {
            // TODO: I don't think we will need this but let's leave it
            // const bounds = new window.google.maps.LatLngBounds(center);
            // map.fitBounds(bounds);

            setMap(_map);
            onIsMapLoaded?.(true);
        },
        [onIsMapLoaded]
    );

  useEffect(() => {
    onIsMapLoaded?.(isLoaded);
  }, [isLoaded, onIsMapLoaded]);

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
      {markerLocation && (
        <MarkerF
          position={markerLocation}
          icon={{
            url: GreyTrashIcon,
            scaledSize: { width: 50, height: 50, equals: () => true },
          }}
        />
      )}
    </GoogleMap>
  ) : null;
}

export const MapWithMarkerComponent = React.memo(MapWithMarkerComponentContent);
