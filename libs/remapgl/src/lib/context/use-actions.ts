import React, { useMemo } from "react";
import { ContextActions, ContextState } from "./types";

export function useActions(setState: SetContextState): ContextActions {
  return useMemo(
    () => ({
      setLayerOrder: layers =>
        setState(current => ({ ...current, layerOrder: layers })),
      setMapGL: mapGL => setState(current => ({ ...current, mapGL }))
    }),
    [setState]
  );
}

type SetContextState = React.Dispatch<React.SetStateAction<ContextState>>;
