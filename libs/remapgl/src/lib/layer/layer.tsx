import { useEffect, useRef, useState } from "react";
import mapboxgl, { Layer as LayerGL, MapLayerEventType } from "mapbox-gl";
import { AnyLayer } from "../types";
import { useMapGL } from "../context/use-mapgl";

/**
 * Represents a layer that will be added to the map. No elements are created in
 * the DOM by this component.
 * @param props
 */
export function Layer({
  addedLayers,
  beforeId,
  onLayerChanged,
  ...props
}: Props) {
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
    onLayerChanged(id, "added");

    return () => {
      mapGL.removeLayer(id).removeSource(id);
      onLayerChanged(id, "removed");
    };
  }, [id, mapGL, onLayerChanged, paint, source, type]);

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

    // If the layer associated with `beforeId` hasn't been added to the mapGL
    // yet don't try to move the current layer.
    if (!addedLayers?.includes(beforeId)) {
      return;
    }

    mapGL.moveLayer(id, beforeId);
    setLastBeforeId(beforeId);
  }, [addedLayers, beforeId, id, lastBeforeId, mapGL]);

  return null;
}

export type Props = AnyLayer & {
  /** Layers that have been added to the mapboxgl Map instance. */
  addedLayers: string[];
  /** If provided the map's layer order will be updated if necessary to put this
   * layer before the referenced layer. */
  beforeId?: string;
  onLayerChanged: (
    /** The ID of the layer that changed. */ id: string,
    /** Was the layer added to or removed from the Map? */ status:
      | "added"
      | "removed"
  ) => void;
};
