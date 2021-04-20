import { useEffect, useState } from "react";
import { useContextValue } from "../context";
import { ContextValue } from "../context/types";

export function useLayerOrder(id: string): Result {
  return useLayerOrderImpl(id, Date.now());
}

function useLayerOrderImpl(id: string, timestamp: number): Result {
  const [index, setIndex] = useState<number>(null);
  const value = useContextValue(selector, true);

  console.log(`useLayerOrder[${id}]: index=${index} ENTER.`);

  useEffect(() => {
    if (!value) {
      return;
    }

    if (index !== null) {
      console.log(`useLayerOrder[${id}]: index=${index}`);
      return;
    }

    value.setLayer(id, timestamp);
  }, [id, index, timestamp, value]);

  useEffect(() => {
    if (!value) {
      return;
    }

    const i = value.getLayerIndex(id);
    console.log(`useLayerOrder[${id}]: index=${index}, context index=${i}`);
    setIndex(i);
  }, [id, index, value]);

  useEffect(() => {
    if (!value) {
      return;
    }

    console.log("useLayerOrder: layerOrder=", value.layerOrder);
  }, [value]);

  // console.log(`useLayerOrder[${id}]: index=${index}`);

  return {
    getLayerIndex: () => -1
  };
}

interface Result {
  getLayerIndex: (id: string) => number;
}

function selector(
  state: ContextValue
): Pick<ContextValue, "getLayerIndex" | "layerOrder" | "setLayer"> {
  if (!state) {
    return {
      getLayerIndex: () => -1,
      setLayer: () => {
        /* noop */
      },
      layerOrder: []
    };
  }

  return {
    getLayerIndex: state.getLayerIndex,
    setLayer: state.setLayer,
    layerOrder: state.layerOrder
  };
}
