import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import {
  LngLatLike,
  Popup as PopupGL,
  PopupOptions as PopupOptionsGL
} from "mapbox-gl";
import { useMapGL } from "../context";
import { Popup } from "./popup";

/**
 * Display a Popup object directly on the Map. The children of this component
 * are displayed as the Popup contents.
 */
export function MapPopup({
  children,
  lngLat,
  onClose,
  options
}: React.PropsWithChildren<Props>) {
  const ref = useRef(null);
  const popup = useRef<PopupGL>(null);
  const { mapGL } = useMapGL();

  useEffect(() => {
    if (!ref || !lngLat || !!popup.current) {
      return;
    }

    const nextPopup = new PopupGL(options ?? {})
      .setDOMContent((ref as MutableRefObject<HTMLElement>).current)
      .on("close", () => {
        onClose && onClose();
      })
      .addTo(mapGL);

    popup.current = nextPopup;

    return () => {
      nextPopup.remove();
      popup.current = null;
    };
  }, [lngLat, mapGL, onClose, options]);

  useEffect(() => {
    if (!popup.current) {
      return;
    }

    lngLat && popup.current.setLngLat(lngLat);
  }, [lngLat, popup]);

  return <Popup ref={ref}>{children}</Popup>;
}

interface Props {
  /** The location of the popup on the map. */
  lngLat: LngLatLike;
  /** Invoked when the popup is closed. */
  onClose?: () => void;
  /** Options that affect the display of the map. */
  options?: PopupOptionsGL;
}
