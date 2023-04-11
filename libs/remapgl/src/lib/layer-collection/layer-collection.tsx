import { useCallback, useState } from "react";
import { AnyLayer } from "../types";
import { Layer, LayerProps } from "../layer/layer";

/**
 * A collection of layers that will be added to the map. Having more than one
 * layer collection in a single RemapGL component is not recommended - the
 * layers in each collection will be treated independently in terms of layer
 * order.
 * @param props
 * @see {@link https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/ Mapbox Layers}
 */
export function LayerCollection({ layers }: LayerCollectionProps) {
  /** Layers that have actually been added to the mapboxgl Map instance. */
  const [addedLayers, setAddedLayers] = useState<string[]>([]);

  /** Invoked when a layer has been added to or removed from the mapboxgl Map
   * instance. */
  const handleLayerChanged = useCallback<LayerProps["onLayerChanged"]>(
    (id, status) => {
      if (status === "added") {
        setAddedLayers(current => {
          let result = current;
          if (!current.includes(id)) {
            result = [...current, id];
          }

          return result;
        });
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

/**
 * Components that implement this interface will add layers to the map and
 * manage the order in which they appear in the map.
 * @see {@link https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/ Mapbox Layers}
 */
export interface LayerCollectionProps {
  /** Layers in the map. The layers will be added to the map in array order;
   * e.g. `layers[0]` will be added to the map first then `layers[1]`, etc. The
   * layer at index 0 will appear visually to be below a layer at index 1. If
   * the order of the items in the `layers` array is changed the layers in the
   * map will be changed to reflect the new order.
   * @see
   * {@link https://docs.mapbox.com/mapbox-gl-js/api/map/#instance-members-layers Mapbox Map Layers}
   */
  layers: AnyLayer[];
}
