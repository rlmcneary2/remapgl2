import { isEqual as _isEqual } from "lodash";
import React, { useEffect, useRef, useState } from "react";
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
  children && React.Children.only(children);

  const [, setForceRender] = useState(0);
  const [popupGL, setPopupGL] = useState<PopupGL>(null);
  const [safePopupOptions, setSafePopupOptions] = useState<
    HasPopup["popupOptions"]
  >(null);
  const markerElement = useRef<HTMLElement>(null);
  const [popupElement, setPopupElement] = useState<HTMLElement>(null);
  const marker = useMarker(options, !children ? false : markerElement.current);
  const markerExists = useRef(false);

  useEffect(() => {
    // When passing in popupOptions
    //
    // - AND the popup is displayed
    // - IF the popupOptions object changes
    // - BUT the property values are the same
    //
    //  the popup will be closed, and it will not reappear. This behavior
    //  doesn't really match how one expects a React component to work so do a
    //  deep compare of the options object and if the property values are the
    //  same ignore the new object and the popup will not close.
    setSafePopupOptions(current =>
      _isEqual(current, popupOptions) ? current : popupOptions
    );
  }, [popupOptions]);

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

    const nextPopup = new PopupGL(safePopupOptions);
    nextPopup.setDOMContent(popupElement);
    marker.setPopup(nextPopup);
    setPopupGL(nextPopup);

    return () => {
      marker.setPopup(null);
      setPopupGL(null);
    };
  }, [marker, popup, popupElement, safePopupOptions]);

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

  return (
    <>
      {ReactDOM.createPortal(children, markerElement.current)}
      {popup ? (
        <Popup ref={setPopupElement}>{popupGL ? popup(popupGL) : null}</Popup>
      ) : null}
    </>
  );
}

export type MarkerProps = HasPopup & MbxObj<MarkerGL> & MarkerOptions;
