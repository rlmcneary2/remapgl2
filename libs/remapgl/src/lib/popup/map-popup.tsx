import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import {
  LngLatLike,
  Popup as PopupGL,
  PopupOptions as PopupOptionsGL
} from "mapbox-gl";
import { MbxObj } from "../types";
import { useMapGL } from "../context";
import { Popup } from "./popup";

/**
 * Display a Popup object directly on the Map. The children of this component
 * are displayed as the Popup contents.
 */
export function MapPopup({
  children,
  lngLat,
  obj,
  onClose,
  options
}: React.PropsWithChildren<MapPopupProps>) {
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

    obj && obj(nextPopup);

    return () => {
      nextPopup.remove();
      popup.current = null;
    };
  }, [lngLat, mapGL, obj, onClose, options]);

  useEffect(() => {
    if (!popup.current) {
      return;
    }

    lngLat && popup.current.setLngLat(lngLat);
  }, [lngLat, popup]);

  return <Popup ref={ref}>{children}</Popup>;
}

export interface MapPopupProps extends MbxObj<PopupGL> {
  /** The location of the popup on the map. */
  lngLat: LngLatLike;
  /** Invoked when the popup is closed. */
  onClose?: () => void;
  /** Options that affect the display of the map. */
  options?: PopupOptionsGL;
}
