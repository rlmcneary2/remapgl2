import React, { MutableRefObject, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

export const Popup = React.forwardRef<
  HTMLElement,
  React.PropsWithChildren<unknown>
>(PopupInternal);

function PopupInternal(
  { children }: React.PropsWithChildren<unknown>,
  refArg: React.Ref<HTMLElement>
) {
  const portal = useRef<React.ReactPortal>(null);

  useEffect(() => {
    if (portal.current) {
      return;
    }

    (refArg as MutableRefObject<HTMLElement>).current = document.createElement(
      "div"
    );

    portal.current = ReactDOM.createPortal(
      children,
      (refArg as MutableRefObject<HTMLElement>).current
    );

    return () => {
      portal.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return portal.current;
}
