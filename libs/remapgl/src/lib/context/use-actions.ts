import React, { useMemo } from "react";
import { ContextActions, ContextState, Layer } from "./types";

export function useActions(setState: SetContextState): ContextActions {
  return useMemo(
    () => ({
      addLayer: layer => addLayerToMap(layer, setState),
      removeLayer: id => removeLayerFromMap(id, setState),
      setMapGL: mapGL => setState(current => ({ ...current, mapGL }))
    }),
    [setState]
  );
}

function addLayerToMap(layer: Layer, setState: SetContextState) {
  setState(current => {
    const { layers } = current;

    const nextLayers = [...(layers ?? []), layer.id];

    return {
      ...current,
      layers: nextLayers
    };
  });
}

function removeLayerFromMap(id: string, setState: SetContextState) {
  setState(current => {
    return {
      ...current,
      layers: current.layers.filter(layerId => layerId !== id)
    };
  });
}

type SetContextState = React.Dispatch<React.SetStateAction<ContextState>>;
