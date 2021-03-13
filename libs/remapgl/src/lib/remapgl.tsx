import React, { useRef } from "react";
import { MapGLOptions } from "./context/types";
import { Provider } from "./context/context-provider";
import { Map } from "./map";

export const RemapGL = React.forwardRef<HTMLDivElement, Props>(RemapGLInternal);

function RemapGLInternal(
  { children, ...props }: React.PropsWithChildren<Props>,
  refArg: React.Ref<HTMLDivElement>
) {
  const key = useRef(new Date().toISOString());

  return (
    <Provider>
      <Map key={key.current} {...props} ref={refArg}>
        {children}
      </Map>
    </Provider>
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props
  extends Partial<
      React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      >
    >,
    MapGLOptions {}
