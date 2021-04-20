import { useContext, useEffect, useState } from "react";
import { isEqual as _isEqual } from "lodash";
import { Context } from "./context";
import { ContextValue } from "./types";

export function useContextValue<T>(
  selector?: (state: ContextValue) => T,
  deepCompare = false
): T {
  const context = useContext(Context);
  const [state, setState] = useState<T>();

  useEffect(() => {
    const next = selector ? selector(context) : ((context as unknown) as T);
    setState(current => {
      if (deepCompare && _isEqual(current, next)) {
        return current;
      }

      return next;
    });
  }, [context, deepCompare, selector, state]);

  return state;
}
