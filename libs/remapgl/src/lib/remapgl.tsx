import React, { useRef } from "react";
import { Map as MapGL } from "mapbox-gl";
import type { MbxObj } from "./types";
import { DEFAULT_MAPBOXGL_CSS, DEFAULT_MAPBOX_STYLE } from "./constants";
import type { MapOptions } from "./context/types";
import { Provider } from "./context/context-provider";
import { Map } from "./map";

/**
 * The root component; add other remapgl components as children to create a map.
 */
export const RemapGL = React.forwardRef<HTMLDivElement, RemapGLProps>(
  function RemapGLImpl({ children, ...props }, ref) {
    const key = useRef(new Date().toISOString());

    return (
      <Provider>
        <Map key={key.current} {...props} ref={ref}>
          {children}
        </Map>
      </Provider>
    );
  }
);

Object.defineProperties(RemapGL, {
  defaultMapboxGLCss: { enumerable: true, value: DEFAULT_MAPBOXGL_CSS },
  defaultMapboxGLStyle: { enumerable: true, value: DEFAULT_MAPBOX_STYLE }
});

/**
 * Props for a component that renders a map to the page.
 */
export type RemapGLProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  MapOptions &
  MbxObj<MapGL>;

export interface RemapGLGlobal
  extends React.ForwardRefExoticComponent<
    React.PropsWithoutRef<RemapGLProps> & React.RefAttributes<HTMLDivElement>
  > {
  defaultMapboxGLCss: string;
  defaultMapboxGLStyle: string;
}
