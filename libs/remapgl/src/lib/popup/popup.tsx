import React, { MutableRefObject, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

export const Popup = React.forwardRef<
  HTMLElement,
  React.PropsWithChildren<unknown>
>(PopupInternal);

function PopupInternal(
  { children }: React.PropsWithChildren<unknown>,
  ref: React.Ref<HTMLElement>
) {
  const portal = useRef<React.ReactPortal>(null);

  useEffect(() => {
    if (portal.current) {
      return;
    }

    (ref as MutableRefObject<HTMLElement>).current = document.createElement(
      "div"
    );

    portal.current = ReactDOM.createPortal(
      children,
      (ref as MutableRefObject<HTMLElement>).current
    );

    return () => {
      portal.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return portal.current;
}
