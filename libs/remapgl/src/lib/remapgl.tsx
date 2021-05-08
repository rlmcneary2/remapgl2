import React, { useRef } from "react";
import { Map as MapGL } from "mapbox-gl";
import { MbxObj } from "./types";
import { MapOptions } from "./context/types";
import { Provider } from "./context/context-provider";
import { Map } from "./map";

/**
 * The root component; add other remapgl components as children to create a map.
 */
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
    MapOptions,
    MbxObj<MapGL> {}
