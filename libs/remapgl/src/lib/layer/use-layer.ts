import { useEffect } from "react";
import { Map as MapGL, MapLayerEventType } from "mapbox-gl";
import { LayerProps } from "../types";

export function useLayer(mapGL: MapGL, { id, on }: LayerProps) {
  /**
   * Connect `on` event listeners.
   */
  useEffect(() => {
    for (const [type, listener] of Object.entries(on)) {
      // console.log(`useLayer[${id}]: add '${type}' listener.`);
      mapGL.on(type as keyof MapLayerEventType, id, listener);
    }

    return () => {
      for (const [type, listener] of Object.entries(on)) {
        // console.log(`useLayer[${id}]: remove '${type}' listener.`);
        mapGL.off(type as keyof MapLayerEventType, id, listener);
      }
    };
  }, [id, mapGL, on]);
}
