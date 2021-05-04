import { useEffect, useState } from "react";
import {
  LngLatLike,
  Marker as MarkerGL,
  MarkerOptions as MarkerOptionsGL
} from "mapbox-gl";
import { useMapGL } from "../context/use-mapgl";

/**
 * Work with a mapbox-gl marker.
 * @param options Options to be passed to the marker.
 * @param element Either `false` to indicate this is not a custom marker and
 * there will never be an element; or `null` or an `HTMLElement` when there will
 * be a custom marker.
 */
export function useMarker(
  {
    draggable,
    lnglat,
    offset,
    pitchAlignment,
    rotation,
    rotationAlignment,
    ...options
  }: Options,
  element: HTMLElement | false = false
) {
  const [marker, setMarker] = useState<MarkerGL>(null);
  const { mapGL } = useMapGL();

  useEffect(() => {
    if ((element !== false && !element) || marker) {
      return;
    }

    const nextOptions: MarkerOptionsGL = {
      ...options,
      draggable,
      offset,
      pitchAlignment,
      rotation,
      rotationAlignment
    };

    if (element !== false && element) {
      nextOptions.element = element;
    }

    const nextMarker = new MarkerGL(nextOptions);
    nextMarker.setLngLat(lnglat).addTo(mapGL);
    setMarker(nextMarker);

    return () => {
      setMarker(null);
      nextMarker.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element]);

  useEffect(() => {
    typeof draggable === "boolean" && marker && marker.setDraggable(draggable);
  }, [draggable, marker]);

  useEffect(() => {
    lnglat && marker && marker.setLngLat(lnglat);
  }, [lnglat, marker]);

  useEffect(() => {
    offset && marker && marker.setOffset(offset);
  }, [marker, offset]);

  useEffect(() => {
    pitchAlignment && marker && marker.setPitchAlignment(pitchAlignment);
  }, [marker, pitchAlignment]);

  useEffect(() => {
    typeof rotation === "number" && marker && marker.setRotation(rotation);
  }, [marker, rotation]);

  useEffect(() => {
    rotationAlignment &&
      marker &&
      marker.setRotationAlignment(rotationAlignment);
  }, [marker, rotationAlignment]);

  return marker;
}

export interface Options extends Omit<MarkerOptionsGL, "element"> {
  lnglat: LngLatLike;
}
