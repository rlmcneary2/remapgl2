import React, { useEffect, useState } from "react";
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
  const [ref, setRef] = useState<HTMLElement>(null);
  const [popupGL, setPopupGL] = useState<PopupGL>(null);
  const { mapGL } = useMapGL();

  useEffect(() => {
    // console.log(
    //   `MapPopup: ref=${typeof ref}, lngLat=%o, popup=`,
    //   lngLat,
    //   popup
    // );

    if (!ref || !lngLat || popupGL) {
      return;
    }

    const nextPopup = new PopupGL(options ?? {})
      .setDOMContent(ref)
      .on("close", () => {
        onClose && onClose();
      })
      .addTo(mapGL);

    // popup.current = nextPopup;

    obj && obj(nextPopup);

    setPopupGL(nextPopup);

    return () => {
      nextPopup.remove();
      setPopupGL(null);
    };
  }, [lngLat, mapGL, obj, onClose, options, popupGL /*, ref*/]);

  useEffect(() => {
    console.log(`MapPopup: popup=`, popupGL);

    if (!popupGL) {
      return;
    }

    lngLat && popupGL.setLngLat(lngLat);
  }, [lngLat, popupGL]);

  return <Popup ref={setRef}>{children}</Popup>;
}

export interface MapPopupProps extends MbxObj<PopupGL> {
  /** The location of the popup on the map. */
  lngLat: LngLatLike;
  /** Invoked when the popup is closed. */
  onClose?: () => void;
  /** Options that affect the display of the map. */
  options?: PopupOptionsGL;
}
