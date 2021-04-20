import React, { useMemo, useRef, useState } from "react";
import { start } from "repl";
import { ContextActions, ContextState } from "./types";

export function useActions(options: Options): ContextActions {
  const layerOrderClearedTimestamp = useRef(Date.now());

  return useMemo(
    () => ({
      getLayerIndex: (id: string) => {
        const current = options.getState();
        if (!current?.layerOrder) {
          return -1;
        }

        if (!current.layerOrder.length) {
          return -1;
        }

        return current.layerOrder.findIndex(item => item.id === id);
      },

      setLayer: (id: string, timestamp: number) => {
        options.setState(current => {
          const { layerOrder = [] } = current;

          let nextState: ContextState;
          let nextLayerOrder: ContextState["layerOrder"];
          const startIndex = layerOrder.findIndex(data => data.id === id);
          if (-1 < startIndex) {
            console.log(`useActions.setLayerOrder[${id}] found.`);
            nextLayerOrder = layerOrder.filter(data => data.id !== id);
            nextLayerOrder.push({ id, timestamp });
            nextLayerOrder.sort((a, b) => a.timestamp - b.timestamp);
            if (
              nextLayerOrder.findIndex(data => data.id === id) !== startIndex
            ) {
              console.log(
                `useActions.setLayerOrder[${id}] layer order changed.`
              );
              nextState = { ...current };
              nextState.layerOrder = nextLayerOrder;
            }
          } else {
            console.log(`useActions.setLayerOrder[${id}] not found.`);
            nextLayerOrder = [...layerOrder];
            nextLayerOrder.push({ id, timestamp });
            nextLayerOrder.sort((a, b) => a.timestamp - b.timestamp);
            nextState = { ...current };
            nextState.layerOrder = nextLayerOrder;
          }

          if (nextState) {
            console.log(
              `useActions.setLayerOrder[${id}]: nextLayerOrder=`,
              nextLayerOrder
            );
            return nextState;
          }

          return current;
        });
      },

      setLayerOrder: () =>
        console.warn("useActions.setLayerOrder: not implemented."),

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
