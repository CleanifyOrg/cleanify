import { MapWithMarkerComponent } from "@/components/MapComponent/MapComponentWithMarker";
import { Heading, ScaleFade, Spinner, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

type Props = {
  selectedLocation?: { lat: number; lng: number };
  setSelectedLocation: (location?: { lat: number; lng: number }) => void;
};

export const ConfirmPosition: React.FC<Props> = ({
  selectedLocation,
  setSelectedLocation,
}) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((location) => {
      setSelectedLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    });
  }, []);

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) {
      console.error("No latlng", e);
      return;
    }
    setSelectedLocation({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  };

  return (
    <ScaleFade
      initialScale={0.9}
      in={true}
      style={{ height: 400, width: "100%" }}
    >
      <VStack
        justify={"flex-start"}
        align={"flex-start"}
        w="full"
        spacing={4}
        h={"full"}
      >
        <Heading size="sm">Confirm the report location</Heading>
        <MapWithMarkerComponent
          onIsMapLoaded={setIsMapLoaded}
          markerLocation={selectedLocation}
          onMapClick={onMapClick}
        />
      </VStack>
    </ScaleFade>
  );
};
