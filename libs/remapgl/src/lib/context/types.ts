import { Map as MapGL, MapboxOptions as MapboxOptionsGL } from "mapbox-gl";
import { AnyLayer, AnySourceData } from "mapbox-gl";

export interface ContextActions {
  getLayerIndex: (id: string) => number;
  setLayer: (id: string, timestanp: number) => void;
  setLayerOrder: (layers: AnyLayer["id"][]) => void;
  setMapGL: (mapGL: MapGL) => void;
}

export interface ContextState {
  layerOrder: { id: AnyLayer["id"]; timestamp: number }[];
  // layerOrder: Record<string, { index?: number; timestamp: number | null }>;
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
  accessToken: string;
  cssFile?: string;
  mapStyle?: string;
}
