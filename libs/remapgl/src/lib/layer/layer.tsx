import { useEffect, useRef } from "react";
import { AnyLayer, Layer as LayerGL } from "mapbox-gl";
import { LayerProps } from "../types";
import { useMapGL } from "../context/use-mapgl";
import { useLayer } from "./use-layer";
import { useLayerOrder } from "./use-layer-order";

export function Layer(props: LayerProps) {
  const added = useRef(false);
  // const index = useRef(null);
  const { mapGL } = useMapGL();
  useLayer(mapGL, props);
  useLayerOrder(props.id);

  const { id, paint, source, type } = props as LayerGL;

  useEffect(() => {
    console.log(`Layer[${id}]: mounted.`);
    return () => console.log(`Layer[${id}]: unmounted.`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return null;
}
