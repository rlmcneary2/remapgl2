import React, { useState } from "react";
import { ContextState, ContextValue } from "./types";
import { Context } from "./context";
import { useActions } from "./use-actions";

export function Provider({ children }: React.PropsWithChildren<unknown>) {
  const [state, setState] = useState<ContextState>(null);
  const actions = useActions(setState);

  const value: ContextValue = {
    ...state,
    ...actions
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
