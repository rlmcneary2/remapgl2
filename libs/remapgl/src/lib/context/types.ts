import { Map as MapGL, MapboxOptions as MapboxOptionsGL } from "mapbox-gl";
import { AnyLayer, AnySourceData } from "mapbox-gl";

export interface ContextActions {
  setMapGL: (mapGL: MapGL) => void;
}

export interface ContextState {
  layerOrder: { id: AnyLayer["id"]; timestamp: number }[];
  mapElem: React.MutableRefObject<HTMLDivElement>;
  mapGL: MapGL;
}

export type ContextValue = ContextActions & ContextState;

export type Layer = AnyLayer & {
  source: AnySourceData;
};

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
   * @see https://docs.mapbox.com/help/getting-started/access-tokens/
   */
  accessToken: string;
  /** The mapbox CSS file (not to be confused with the map style) that will be
   * added to the page's `<head>` element. For example
   * `//api.tiles.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.css`.
   * @see
   * https://docs.mapbox.com/help/getting-started/web-apps/#creating-a-web-app
   */
  cssFile?: string;
  /** The mapbox style to use when rendering the map. For example
   * `mapbox://styles/mapbox/outdoors-v11`.
   * @see https://docs.mapbox.com/mapbox-gl-js/api/map/
   */
  mapStyle?: string;
}
