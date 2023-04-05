import { useEffect, useState } from "react";
import {
  LngLatLike,
  MapboxEvent,
  Marker as MarkerGL,
  MarkerOptions as MarkerOptionsGL
} from "mapbox-gl";
import { useMapGL } from "../context/use-mapgl";
import { OnEvents } from "../types";

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
    on,
    pitchAlignment,
    rotation,
    rotationAlignment,
    ...options
  }: MarkerOptions,
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

  useEffect(() => {
    if (!on || !marker) {
      return;
    }

    for (const type of Object.keys(on)) {
      const name = type as keyof MarkerEventType;
      if (name === "drag" || name === "dragend" || name === "dragstart") {
        marker.on(name, on[name]);
      } else {
        marker.getElement().addEventListener(name, on[name]);
      }
    }

    return () => {
      for (const type of Object.keys(on)) {
        const name = type as keyof MarkerEventType;
        if (name === "drag" || name === "dragend" || name === "dragstart") {
          marker.off(name, on[name]);
        } else {
          marker?.getElement().removeEventListener(name, on[name]);
        }
      }
    };
  }, [marker, on]);

  return marker;
}

type MarkerEventType = {
  click: MouseEvent | PointerEvent;
  dragstart: MapboxEvent<MouseEvent | TouchEvent | undefined>;
  drag: MapboxEvent<MouseEvent | TouchEvent | undefined>;
  dragend: MapboxEvent<MouseEvent | TouchEvent | undefined>;
};

/**
 * Objects that implement this interface will create or interact with a marker
 * control.
 * @see
 * {@link https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker-parameters|Mapbox Marker Parameters}
 */
export interface MarkerOptions
  extends Omit<MarkerOptionsGL, "element">,
    OnEvents<MarkerEventType> {
  /**
   * The location of the marker on the map.
   */
  lnglat: LngLatLike;
}
