import React, { useRef } from "react";
import { Map as MapGL } from "mapbox-gl";
import { MbxObj } from "./types";
import { DEFAULT_MAPBOXGL_CSS, DEFAULT_MAPBOX_STYLE } from "./constants";
import { MapOptions } from "./context/types";
import { Provider } from "./context/context-provider";
import { Map } from "./map";

/**
 * The root component; add other remapgl components as children to create a map.
 */
export const RemapGL = React.forwardRef<HTMLDivElement, Props>(
  RemapGLInternal
) as IRemapGL;

Object.defineProperties(RemapGL, {
  defaultMapboxGLCss: { enumerable: true, value: DEFAULT_MAPBOXGL_CSS },
  defaultMapboxGLStyle: { enumerable: true, value: DEFAULT_MAPBOX_STYLE }
});

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

interface Props
  extends Partial<
      React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      >
    >,
    MapOptions,
    MbxObj<MapGL> {}

interface IRemapGL
  extends React.ForwardRefExoticComponent<
    React.PropsWithoutRef<Props> & React.RefAttributes<HTMLDivElement>
  > {
  defaultMapboxGLCss: string;
  defaultMapboxGLStyle: string;
}
