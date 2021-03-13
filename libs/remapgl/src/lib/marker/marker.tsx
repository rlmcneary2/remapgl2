import React, { useEffect } from "react";
import { LngLatLike, Marker as MarkerGL } from "mapbox-gl";
import { useMapGL } from "../context/use-mapgl";

export function Marker({ lnglat }: Props) {
  // console.log("Marker");
  const { mapGL } = useMapGL();

  useEffect(() => {
    console.log(`Marker: new marker; mapGL=${!!mapGL}`);
    const marker = new MarkerGL();
    marker.setLngLat(lnglat).addTo(mapGL);
    return () => {
      console.log(`Marker: removing marker`);
      marker.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log("Marker: EXIT");
  return null;
}

interface Props {
  lnglat: LngLatLike;
}
