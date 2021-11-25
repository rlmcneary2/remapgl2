import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Marker as MarkerGL, Popup as PopupGL } from "mapbox-gl";
import { HasPopup, MbxObj } from "../types";
import { Options, useMarker } from "./use-marker";
import { Popup } from "../popup/popup";

/**
 * Displays a Marker component on the map.
 * @param props
 */
export function Marker({
  children,
  obj,
  popup,
  popupOptions,
  ...options
}: React.PropsWithChildren<Props>) {
  children && React.Children.only(children);

  const [, setForceRender] = useState(0);
  const [popupGL, setPopupGL] = useState<PopupGL>(null);
  const markerPortal = useRef<React.ReactPortal>(null);
  const markerElement = useRef<HTMLElement>(null);
  const popupElement = useRef<HTMLElement>(null);
  const marker = useMarker(options, !children ? false : markerElement.current);
  const markerExists = useRef(false);

  useEffect(() => {
    if (children) {
      markerElement.current = document.createElement("div");
      markerPortal.current = ReactDOM.createPortal(
        children,
        markerElement.current
      );
    }

    setForceRender(current => current + 1);

    return () => {
      markerPortal.current = null;
      markerElement.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!popupElement.current || !marker) {
      return;
    }

    if (!popup) {
      return;
    }

    const nextPopup = new PopupGL(popupOptions);
    nextPopup.setDOMContent(popupElement.current);
    marker.setPopup(nextPopup);
    setPopupGL(nextPopup);

    return () => {
      marker.setPopup(null);
      setPopupGL(null);
    };
  }, [marker, popup, popupOptions]);

  useEffect(() => {
    if (!marker && !markerExists.current) {
      return;
    }

    markerExists.current = true;

    obj && obj(marker);
  }, [marker, obj]);

  return (
    <>
      {markerPortal.current}
      {popup ? (
        <Popup ref={popupElement}>{popupGL ? popup(popupGL) : null}</Popup>
      ) : null}
    </>
  );
}

interface Props extends HasPopup, MbxObj<MarkerGL>, Options {}
