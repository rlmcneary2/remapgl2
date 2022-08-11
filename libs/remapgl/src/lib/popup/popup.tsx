import React, { MutableRefObject, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

export const Popup = React.forwardRef<
  HTMLElement,
  React.PropsWithChildren<unknown>
>(PopupInternal);

function PopupInternal(
  { children }: React.PropsWithChildren<unknown>,
  ref: React.Ref<HTMLElement> | React.MutableRefObject<HTMLElement>
) {
  const portalElement = useRef<HTMLElement>(null);

  // Only release the element when the component is being unmounted.
  useEffect(() => () => (portalElement.current = null), []);

  // Only create an element for the portal once then provide it to the parent -
  // will not create a new element even if the parent provides a different ref
  // object.
  useEffect(() => {
    if (portalElement.current) {
      return;
    }

    portalElement.current = document.createElement("div");
    if (typeof ref === "function") {
      ref(portalElement.current);
    } else {
      (ref as MutableRefObject<HTMLElement>).current = portalElement.current;
    }
  }, [ref]);

  return portalElement.current
    ? ReactDOM.createPortal(children, portalElement.current)
    : null;
}
