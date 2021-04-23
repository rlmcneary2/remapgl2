import React from "react";
import { AnyLayer } from "../types";
import { Layer } from "../layer/layer";

/**
 * The layers to be displayed on the map. Having more than one layer collection
 * is not reccomended as the layers in each collection will be treated
 * independently in terms of layer order.
 */
export function LayerCollection({ layers }: Props) {
  return (
    <>
      {layers.map((layer, i) => {
        const props = { ...layer };

        if (i + 1 < layers.length) {
          (props as any).beforeId = layers[i + 1].id;
        }

        return <Layer key={layer.id} {...props} />;
      })}
    </>
  );
}

interface Props {
  layers: AnyLayer[];
}
