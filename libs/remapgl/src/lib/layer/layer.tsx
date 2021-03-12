import React, { useContext, useEffect, useRef } from "react";
import { AnyLayer, AnySourceData } from "mapbox-gl";
import { Context } from "../context/context";
import { useMapGL } from "../context/use-mapgl";

export function Layer(props: Props) {
  const { addLayer, layers, removeLayer } = useContext(Context);
  const added = useRef(false);
  const { mapGL } = useMapGL();

  const { id, source } = props;

  useEffect(() => {
    addLayer(props);
    return () => removeLayer(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (added.current || !layers?.includes(id)) {
      return;
    }

    added.current = true;

    mapGL.addLayer(props);
    return () => mapGL.removeLayer(id).removeSource(id);
  }, [id, layers, mapGL, props, source]);

  return null;
}

type Props = AnyLayer & {
  source: AnySourceData;
};
