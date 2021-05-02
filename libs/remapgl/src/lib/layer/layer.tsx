import { useEffect, useRef, useState } from "react";
import { Layer as LayerGL, MapLayerEventType } from "mapbox-gl";
import { AnyLayer } from "../types";
import { useMapGL } from "../context/use-mapgl";

/**
 * Represents a layer that will be added to the map. No elements are created in
 * the DOM by this component.
 * @param props
 */
export function Layer({ beforeId, ...props }: Props) {
  const [lastBeforeId, setLastBeforeId] = useState(beforeId);
  const added = useRef(false);
  const { mapGL } = useMapGL();

  const { on } = props;
  const { id, paint, source, type } = props as LayerGL;

  useEffect(() => {
    console.log(`Layer[${id}]: mounted.`);
    return () => console.log(`Layer[${id}]: unmounted.`);
  }, [id]);

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
      mapGL.removeLayer(id).removeSource(id);
    };
  }, [id, mapGL, paint, source, type]);

  /**
   * Connect `on` event listeners.
   */
  useEffect(() => {
    if (!on) {
      return;
    }

    for (const [type, listener] of Object.entries(on)) {
      mapGL.on(type as keyof MapLayerEventType, id, listener);
    }

    return () => {
      for (const [type, listener] of Object.entries(on)) {
        mapGL.off(type as keyof MapLayerEventType, id, listener);
      }
    };
  }, [id, mapGL, on]);

  /**
   * Reorder the layer on the map if it has changed.
   */
  useEffect(() => {
    if (lastBeforeId === beforeId) {
      return;
    }

    if (!beforeId) {
      return;
    }

    mapGL.moveLayer(id, beforeId);
    setLastBeforeId(beforeId);
  }, [beforeId, id, lastBeforeId, mapGL]);

  return null;
}

type Props = AnyLayer & {
  /** If provided the map's layer order will be updated if necessary to put this
   * layer before the referenced layer. */
  beforeId?: string;
};
