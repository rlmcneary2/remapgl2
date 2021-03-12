import React, { MutableRefObject, useEffect, useRef } from "react";
import { MapGLOptions } from "./context/types";
import { useMapGL } from "./context/use-mapgl";

export const Map = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<Props>
>(
  (
    { accessToken, center, children, cssFile, mapStyle, zoom, ...props },
    refArg
  ) => {
    const ref = useRef<HTMLDivElement>();
    const { ready, mapGL, setMapContainer } = useMapGL({
      accessToken,
      cssFile,
      mapStyle,
      zoom
    });

    useEffect(() => {
      if (!ready) {
        return;
      }

      (refArg as MutableRefObject<HTMLElement>).current = ref.current;
      setMapContainer(ref.current);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready]);

    return (
      <div ref={ref} {...props}>
        {mapGL ? children : null}
      </div>
    );
  }
);

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props
  extends Partial<
      React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      >
    >,
    MapGLOptions {}
