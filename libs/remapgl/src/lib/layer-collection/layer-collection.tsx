import React, { useCallback, useState } from "react";
import { AnyLayer } from "../types";
import { Layer, LayerProps } from "../layer/layer";

/**
 * The layers to be displayed on the map. Having more than one layer collection
 * is not recommended as the layers in each collection will be treated
 * independently in terms of layer order.
 */
export function LayerCollection({ layers }: LayerCollectionProps) {
  /** Layers that have actually been added to the mapboxgl Map instance. */
  const [addedLayers, setAddedLayers] = useState<string[]>([]);

  /** Invoked when a layer has been added to or removed from the mapboxgl Map
   * instance. */
  const handleLayerChanged = useCallback<LayerProps["onLayerChanged"]>(
    (id, status) => {
      if (status === "added") {
        setAddedLayers(
          current =>
            current.includes(id) ? current : current.splice(-1, 0, id) // Dumb bundler bug that can't map the spread operator...
        );
      } else if (status === "removed") {
        setAddedLayers(current =>
          !current.includes(id) ? current : current.filter(x => x !== id)
        );
      }
    },
    []
  );

  return (
    <>
      {layers.map((layer, i) => {
        const props = { ...layer };

        if (i + 1 < layers.length) {
          (props as any).beforeId = layers[i + 1].id;
        }

        return (
          <Layer
            key={layer.id}
            {...props}
            addedLayers={addedLayers}
            onLayerChanged={handleLayerChanged}
          />
        );
      })}
    </>
  );
}

export interface LayerCollectionProps {
  /** Layers in the map. The order they appear in the map is determined by the
   * order of elements in the array. */
  layers: AnyLayer[];
}
