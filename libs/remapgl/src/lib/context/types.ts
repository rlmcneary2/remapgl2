import {
  Map as MapGL,
  MapboxOptions as MapboxOptionsGL,
  Style as StyleGL
} from "mapbox-gl";
import { AnyLayer, AnySourceData } from "mapbox-gl";

export interface ContextActions {
  setMapGL: (mapGL: MapGL) => void;
}

export interface ContextState {
  layerOrder: { id: AnyLayer["id"]; timestamp: number }[];
  mapElem?: React.MutableRefObject<HTMLDivElement>;
  mapGL?: MapGL;
}

export type ContextValue = ContextActions & ContextState;

export type Layer = AnyLayer & {
  source: AnySourceData;
};

/**
 * Objects that implement this interface will create or interact with the map
 * control.
 * @see
 * {@link https://docs.mapbox.com/mapbox-gl-js/api/map/#map-parameters Mapbox Map Parameters}
 */
export interface MapOptions
  extends Omit<
    MapboxOptionsGL,
    | "accessToken"
    | "attributionControl"
    | "container"
    | "customAttribution"
    | "style"
  > {
  /** The access token that will be used to retrieve data from the Mapbox
   * server.
   * @see
   * {@link https://docs.mapbox.com/help/getting-started/access-tokens/ Access Tokens}
   */
  accessToken: string;
  /** The URL to a mapbox CSS file (not to be confused with the map style). The
   * CSS URL will be added to the page's `<head>` element at runtime. An example
   * URL `//api.tiles.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.css`.
   * @see
   * {@link https://docs.mapbox.com/help/getting-started/web-apps/#mapbox-gl-js-1 Mapbox CSS Files}
   * @see {@link mapStyle}
   */
  cssFile?: string;
  /** The mapbox style to use when rendering the map (not to be confused with
   * the CSS file). A `Style` object, ID, or URL. Commonly a URL like
   * `mapbox://styles/mapbox/outdoors-v11`.
   * @see
   * {@link https://docs.mapbox.com/mapbox-gl-js/api/map/#map-parameters Mapbox Map Parameters}
   * @see
   * {@link https://docs.mapbox.com/mapbox-gl-js/style-spec/ Mapbox Style Specification}
   * @see {@link cssFile}
   */
  mapStyle?: StyleGL | string;
}
