import React, { useMemo, useState } from "react";
import { ContextState, ContextValue } from "./types";
import { Context } from "./context";
import { useActions } from "./use-actions";

export function Provider({ children }: React.PropsWithChildren<unknown>) {
  const [state, setState] = useState<ContextState>({
    layerOrder: [],
    mapElem: null,
    mapGL: null
  });

  const options = useMemo(() => ({ getState: null, setState }), []);
  options.getState = () => state;

  const actions = useActions(options);

  const value: ContextValue = {
    ...state,
    ...actions
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
