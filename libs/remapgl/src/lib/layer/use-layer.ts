import { useEffect } from "react";
import { Map as MapGL } from "mapbox-gl";
import { LayerProps } from "../types";

export function useLayer(mapGL: MapGL, { id, on }: LayerProps) {
  /**
   * Connect `on` event listeners.
   */
  useEffect(() => {
    for (const item of on) {
      const [type, listener] = item;
      console.log(`useLayer[${id}]: add '${type}' listener.`);
      mapGL.on(type, id, listener);
    }

    return () => {
      for (const item of on) {
        const [type, listener] = item;
        console.log(`useLayer[${id}]: remove '${type}' listener.`);
        mapGL.off(type, id, listener);
      }
    };
  }, [id, mapGL, on]);
}
