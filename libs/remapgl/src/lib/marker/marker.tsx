import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Marker as MarkerGL, Popup as PopupGL } from "mapbox-gl";
import { HasPopup, MbxObj } from "../types";
import type { MarkerOptions } from "./use-marker";
import { useMarker } from "./use-marker";
import { Popup } from "../popup/popup";

/**
 * Displays a Marker component on the map.
 */
export function Marker({
  children,
  obj,
  popup,
  popupOptions,
  ...options
}: React.PropsWithChildren<MarkerProps>) {
  children && (typeof children === "string" || React.Children.only(children));

  const [, setForceRender] = useState(0);
  const [popupGL, setPopupGL] = useState<PopupGL>(null);
  const [popupElement, setPopupElement] = useState<HTMLElement>(null);
  const markerElement = useRef<HTMLElement>(null);
  const marker = useMarker(options, !children ? false : markerElement.current);
  const markerExists = useRef(false);

  const handlePopupRef = useCallback((ref: HTMLElement) => {
    setPopupElement(ref);
  }, []);

  /*
   * Free resources when the component unmounts.
   */
  useEffect(
    () => () => {
      setPopupElement(null);
    },
    []
  );

  useEffect(() => {
    if (children) {
      markerElement.current = document.createElement("div");
    }

    setForceRender(current => current + 1);

    return () => {
      markerElement.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!popupElement || !marker) {
      return;
    }

    if (!popup) {
      return;
    }

    const nextPopup = new PopupGL(popupOptions);
    nextPopup.setDOMContent(popupElement);
    marker.setPopup(nextPopup);
    setPopupGL(nextPopup);

    return () => {
      marker.setPopup(null);
      setPopupGL(null);
    };
  }, [marker, popup, popupElement, popupOptions]);

  useEffect(() => {
    if (!marker && !markerExists.current) {
      return;
    }

    markerExists.current = true;

    obj && obj(marker);
  }, [marker, obj]);

  if (!markerElement.current) {
    return null;
  }

  const portal = ReactDOM.createPortal(children, markerElement.current);

  return (
    <>
      {portal}
      {popup ? (
        <Popup ref={handlePopupRef}>{popupGL ? popup(popupGL) : null}</Popup>
      ) : null}
    </>
  );
}

export type MarkerProps = HasPopup & MbxObj<MarkerGL> & MarkerOptions;
