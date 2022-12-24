import React, { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { Map as MapGL } from "mapbox-gl";
import { MbxObj } from "./types";
import { MapOptions } from "./context/types";
import { useMapGL } from "./context";

export const Map = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<MapProps>
>(function MapImpl({ children, obj, ...props }, ref) {
  const containerRef = useRef<HTMLDivElement>();
  const { htmlProps, mapOptions } = useMemo(
    () => separateProps(props),
    [props]
  );
  const { ready, mapGL, setMapContainer } = useMapGL(mapOptions);

  obj && mapGL && obj(mapGL);

  useEffect(() => {
    if (!ready) {
      return;
    }

    (ref as MutableRefObject<HTMLElement>).current = containerRef.current;
    setMapContainer(containerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <div ref={containerRef} {...htmlProps}>
      {mapGL ? children : null}
    </div>
  );
});

function separateProps(props: MapProps) {
  const {
    accessToken,
    antialias,
    bearing,
    bearingSnap,
    bounds,
    boxZoom,
    center,
    clickTolerance,
    collectResourceTiming,
    crossSourceCollisions,
    doubleClickZoom,
    dragPan,
    dragRotate,
    fadeDuration,
    failIfMajorPerformanceCaveat,
    fitBoundsOptions,
    hash,
    interactive,
    keyboard,
    locale,
    localFontFamily,
    localIdeographFontFamily,
    logoPosition,
    mapStyle,
    maxBounds,
    maxPitch,
    maxTileCacheSize,
    maxZoom,
    minPitch,
    minZoom,
    optimizeForTerrain,
    pitch,
    pitchWithRotate,
    preserveDrawingBuffer,
    refreshExpiredTiles,
    renderWorldCopies,
    scrollZoom,
    touchPitch,
    touchZoomRotate,
    trackResize,
    transformRequest,
    zoom,
    ...htmlProps
  } = props;

  let mapOptions: MapOptions = {
    accessToken,
    antialias,
    bearing,
    bearingSnap,
    bounds,
    boxZoom,
    center,
    clickTolerance,
    collectResourceTiming,
    crossSourceCollisions,
    doubleClickZoom,
    dragPan,
    dragRotate,
    fadeDuration,
    failIfMajorPerformanceCaveat,
    fitBoundsOptions,
    hash,
    interactive,
    keyboard,
    locale,
    localFontFamily,
    localIdeographFontFamily,
    logoPosition,
    mapStyle,
    maxBounds,
    maxPitch,
    maxTileCacheSize,
    maxZoom,
    minPitch,
    minZoom,
    optimizeForTerrain,
    pitch,
    pitchWithRotate,
    preserveDrawingBuffer,
    refreshExpiredTiles,
    renderWorldCopies,
    scrollZoom,
    touchPitch,
    touchZoomRotate,
    trackResize,
    transformRequest,
    zoom
  };

  // Mapbox does not like keys with a value of undefined so strip them off here.
  mapOptions = Object.keys(mapOptions)
    .filter(key => mapOptions[key] !== undefined)
    .reduce<MapOptions>(
      (output, key) => {
        output[key] = mapOptions[key];
        return output;
      },
      { accessToken: mapOptions.accessToken }
    );

  const result: {
    htmlProps: Partial<
      React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      >
    >;
    mapOptions: MapOptions;
  } = {
    htmlProps,
    mapOptions
  };

  return result;
}

export type MapProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  MapOptions &
  MbxObj<MapGL>;
