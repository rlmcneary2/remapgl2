import { LngLatLike, Map as MapGL } from "mapbox-gl";
import { AnyLayer, AnySourceData } from "mapbox-gl";

export interface ContextActions {
  setLayerOrder: (layers: AnyLayer["id"][]) => void;
  setMapGL: (mapGL: MapGL) => void;
}

export interface ContextState {
  layerOrder: AnyLayer["id"][];
  mapElem: React.MutableRefObject<HTMLDivElement>;
  mapGL: MapGL;
}

export type ContextValue = ContextActions & ContextState;

export type Layer = AnyLayer & {
  source: AnySourceData;
};

export interface MapGLOptions {
  accessToken: string;
  center?: LngLatLike;
  cssFile?: string;
  mapStyle?: string;
  zoom?: number;
}
