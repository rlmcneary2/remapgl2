import React, { MutableRefObject, useEffect } from "react";
import ReactDOM from "react-dom";

export const Popup = React.forwardRef<
  HTMLElement,
  React.PropsWithChildren<unknown>
>(PopupInternal);

function PopupInternal(
  { children }: React.PropsWithChildren<unknown>,
  ref: React.Ref<HTMLElement>
) {
  useEffect(() => {
    (ref as MutableRefObject<HTMLElement>).current = document.createElement(
      "div"
    );
  }, [ref]);

  return (ref as MutableRefObject<HTMLElement>).current
    ? ReactDOM.createPortal(
        children,
        (ref as MutableRefObject<HTMLElement>).current
      )
    : null;
}
