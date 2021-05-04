import React, { useMemo } from "react";
import { ContextActions, ContextState } from "./types";

export function useActions(options: Options): ContextActions {
  return useMemo(
    () => ({
      setMapGL: mapGL => options.setState(current => ({ ...current, mapGL }))
    }),
    [options]
  );
}

type SetContextState = React.Dispatch<React.SetStateAction<ContextState>>;

interface Options {
  getState: () => ContextState;
  setState: SetContextState;
}
