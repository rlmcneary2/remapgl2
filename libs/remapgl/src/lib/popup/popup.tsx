import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

export const Popup = React.forwardRef<
  HTMLElement,
  React.PropsWithChildren<unknown>
>(function PopupImpl({ children }, ref) {
  const [element, setElement] = useState<HTMLElement>(null);

  useEffect(() => {
    const el = document.createElement("div");
    setElement(el);
    return () => setElement(null);
  }, []);

  useEffect(() => {
    if (typeof ref === "function") {
      ref(element);
    } else {
      ref.current = element;
    }
  }, [element, ref]);

  return element
    ? (ReactDOM.createPortal(children, element) as React.ReactElement)
    : null;
});

