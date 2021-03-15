import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { LngLatLike, Marker as MarkerGL, MarkerOptions } from "mapbox-gl";
import { useMapGL } from "../context/use-mapgl";

export function Marker({
  children,
  lnglat,
  ...options
}: React.PropsWithChildren<Props>) {
  children && React.Children.only(children);

  const { mapGL } = useMapGL();
  const [marker, setMarker] = useState<MarkerGL>(null);
  const markerPortal = useRef<React.ReactPortal>(null);

  useEffect(() => {
    if (marker) {
      return;
    }

    console.log("Marker: adding marker.");

    let element: HTMLElement;
    if (children) {
      element = document.createElement("div");
      markerPortal.current = ReactDOM.createPortal(children, element);
    }

    const nextMarker = new MarkerGL({ ...options, element });
    nextMarker.setLngLat(lnglat).addTo(mapGL);
    setMarker(nextMarker);

    return () => {
      console.log(`Marker: removing marker`);
      markerPortal.current = null;
      setMarker(null);
      nextMarker.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return markerPortal.current;
}

interface Props extends Omit<MarkerOptions, "element"> {
  lnglat: LngLatLike;
}
