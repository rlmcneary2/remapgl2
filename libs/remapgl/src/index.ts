import type { MapOptions } from "./lib/context/types";
import type { MarkerOptions } from "./lib/marker/use-marker";
import { useMapGL as useMapGLInternal } from "./lib/context";

export * from "./lib/geolocate-control/geolocate-control";
export * from "./lib/layer-collection/layer-collection";
export * from "./lib/marker/marker";
export * from "./lib/navigation-control/navigation-control";
export * from "./lib/popup/map-popup";
export * from "./lib/remapgl";
export * from "./lib/attribution-control/attribution-control";
export * from "./lib/scale-control/scale-control";
export * from "./lib/fullscreen-control/fullscreen-container";
export * from "./lib/types";

/**
 * Provides access to the Mapbox Map instance.
 */
const useMapGL: () => Pick<
  ReturnType<typeof useMapGLInternal>,
  "mapGL" | "ready"
> = useMapGLInternal;

export { MapOptions, MarkerOptions, useMapGL };
