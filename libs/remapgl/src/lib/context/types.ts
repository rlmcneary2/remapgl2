import { Map as MapGL, MapboxOptions as MapboxOptionsGL } from "mapbox-gl";
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

export interface MapOptions
  extends Omit<MapboxOptionsGL, "accessToken" | "container" | "style"> {
  accessToken: string;
  cssFile?: string;
  mapStyle?: string;
}
