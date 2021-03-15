import { useEffect, useRef } from "react";
import {
  AnyLayer,
  EventData,
  Layer as LayerGL,
  MapLayerEventType,
  MapLayerMouseEvent,
  MapLayerTouchEvent
} from "mapbox-gl";
import { LayerProps } from "../types";
import { useContextValue } from "../context";
import { useMapGL } from "../context/use-mapgl";
import { useLayer } from "./use-layer";

export function Layer(props: LayerProps) {
  const layerOrder = useContextValue(state => state?.layerOrder);
  const added = useRef(false);
  const index = useRef(null);
  const { mapGL } = useMapGL();
  useLayer(mapGL, props);

  const { id, paint, source, type } = props as LayerGL;

  /**
   * Add the layer to the map.
   */
  useEffect(() => {
    if (added.current) {
      return;
    }

    added.current = true;
    const args = { id, paint, source, type };
    mapGL.addLayer(args as AnyLayer);

    return () => {
      console.log(`Layer[${id}]: REMOVING layer '${id}'`);
      mapGL.removeLayer(id).removeSource(id);
    };
  }, [id, mapGL, paint, source, type]);

  /**
   * Update layer order based on the order of the React children provided to the
   * Map component and stored in Context.
   */
  useEffect(() => {
    if (!layerOrder) {
      return;
    }

    const layerIndex = layerOrder.findIndex(layer => layer === id);
    if (index.current === null) {
      index.current = layerIndex;
    } else if (index.current !== layerIndex) {
      let beforeId: string;
      if (layerIndex + 1 < layerOrder.length) {
        beforeId = layerOrder[layerIndex + 1];
      }
      console.log(
        `Layer[${id}]: '${id}' is before (but visually below) '${beforeId}'.`
      );

      if (mapGL.getLayer(id)) {
        mapGL.moveLayer(id, beforeId);
      }
    }
  }, [id, layerOrder, mapGL]);

  return null;
}
