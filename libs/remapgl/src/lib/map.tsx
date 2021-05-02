import React, { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { MapOptions } from "./context/types";
import { useMapGL } from "./context";

export const Map = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<Props>
>(MapInternal);

function MapInternal(
  { children, ...props }: Props,
  refArg: React.Ref<HTMLDivElement>
) {
  const ref = useRef<HTMLDivElement>();
  const { htmlProps, mapOptions } = useMemo(() => separateProps(props), [
    props
  ]);
  const { ready, mapGL, setMapContainer } = useMapGL(mapOptions);

  useEffect(() => {
    if (!ready) {
      return;
    }

    (refArg as MutableRefObject<HTMLElement>).current = ref.current;
    setMapContainer(ref.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <div ref={ref} {...htmlProps}>
      {mapGL ? children : null}
    </div>
  );
}

// function isJSXElementConstructor<P = any>(
//   type: any
// ): type is JSXElementConstructor<P> {
//   return type instanceof Function;
// }

// function isLayer(
//   child: any
// ): child is React.ReactElement<any, string | React.JSXElementConstructor<any>> {
//   if (
//     !isReactElement(child) ||
//     !isJSXElementConstructor<{ id: string }>(child.type)
//   ) {
//     return false;
//   }

//   const {
//     type: { name }
//   } = child;

//   return name === "Layer";
// }

// function isReactElement(child: any): child is React.ReactElement {
//   return typeof child === "object" && child?.type instanceof Function;
// }

function separateProps(props: Props) {
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

// function updateLayerIds(
//   layers: string[],
//   nextLayers: string[],
//   setLayerOrder: (layers: string[]) => void
// ) {
//   if (!layers || layers.length !== nextLayers.length) {
//     console.log("updateLayerIds: no existing layers; setting layers.");
//     setLayerOrder(nextLayers ?? []);
//     return;
//   }

//   if (layers.length < 1 && nextLayers.length < 1) {
//     return;
//   }

//   for (let i = 0; i < nextLayers.length; i++) {
//     if (layers[i] !== nextLayers[i]) {
//       console.log("updateLayerIds: layer order has changed; setting layers.");
//       setLayerOrder(nextLayers);
//       return;
//     }
//   }
// }

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props
  extends Partial<
      React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      >
    >,
    MapOptions {}
