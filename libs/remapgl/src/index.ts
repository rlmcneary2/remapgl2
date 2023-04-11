import type {
  AnyLayer,
  EventedEvent,
  HasPopup,
  MbxObj,
  OnEvents,
  SymbolIconLayer
} from "./lib/types";
import type { MapOptions } from "./lib/context/types";
import type { MarkerOptions } from "./lib/marker/use-marker";
import type {
  GeolocateControlProps,
  GeolocateEventTypes
} from "./lib/geolocate-control/geolocate-control";

import { useMapGL as useMapGLInternal } from "./lib/context";
import { GeolocateControl } from "./lib/geolocate-control/geolocate-control";

/**
 * Implemented by objects that return information about a Mapbox Map instance.
 */
interface UseMapGLResult {
  /**
   * The Map instance used in a `<RemapGL>` component.
   * @see {@link https://docs.mapbox.com/mapbox-gl-js/api/map/ Mapbox Map}
   */
  mapGL: ReturnType<typeof useMapGLInternal>["mapGL"];
  /**
   * Will be `true` when the map has finished loading, including the CSS file,
   * and can be manipulated.
   * @see {@link MapOptions.cssFile}
   */
  ready: ReturnType<typeof useMapGLInternal>["ready"];
}

export * from "./lib/layer-collection/layer-collection";
export * from "./lib/marker/marker";
export * from "./lib/navigation-control/navigation-control";
export * from "./lib/popup/map-popup";
export * from "./lib/remapgl";
export * from "./lib/attribution-control/attribution-control";
export * from "./lib/scale-control/scale-control";
export * from "./lib/fullscreen-control/fullscreen-container";

export type {
  AnyLayer,
  EventedEvent,
  GeolocateControlProps,
  GeolocateEventTypes,
  HasPopup,
  MapOptions,
  MarkerOptions,
  MbxObj,
  OnEvents,
  SymbolIconLayer,
  UseMapGLResult
};

export { GeolocateControl };

/**
 * A React hook to be used inside React components that need access to the
 * Mapbox Map control.
 */
export const useMapGL: () => UseMapGLResult = useMapGLInternal;
