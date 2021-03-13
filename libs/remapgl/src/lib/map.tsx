import React, {
  JSXElementConstructor,
  MutableRefObject,
  useEffect,
  useMemo,
  useRef
} from "react";
import { MapGLOptions } from "./context/types";
import { useContextValue, useMapGL } from "./context";

export const Map = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<Props>
>(MapInternal);

function MapInternal(
  { accessToken, center, children, cssFile, mapStyle, zoom, ...props },
  refArg: React.Ref<HTMLDivElement>
) {
  const ref = useRef<HTMLDivElement>();
  const { layerOrder, setLayerOrder } =
    useContextValue(
      state => ({
        layerOrder: state?.layerOrder,
        setLayerOrder: state?.setLayerOrder
      }),
      true
    ) ?? {};
  const { ready, mapGL, setMapContainer } = useMapGL({
    accessToken,
    cssFile,
    mapStyle,
    zoom
  });

  useEffect(() => {
    if (!ready) {
      return;
    }

    (refArg as MutableRefObject<HTMLElement>).current = ref.current;
    setMapContainer(ref.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // The order of layer IDs needs to be tracked since layers are actually
  // rendered by the map in its canvas, if the layers have to be reordered
  // based on the order of children the Map will need to do that.
  useMemo(() => {
    if (!setLayerOrder) {
      return;
    }

    const nextLayerOrder: string[] = [];
    React.Children.forEach(children, child => {
      if (!isLayer(child)) {
        return;
      }

      if (!child?.props?.id) {
        throw Error("Layers does not have the required `id` prop.");
      }

      nextLayerOrder.push(child.props.id);
    });

    updateLayerIds(layerOrder, nextLayerOrder, setLayerOrder);
  }, [children, layerOrder, setLayerOrder]);

  return (
    <div ref={ref} {...props}>
      {mapGL ? children : null}
    </div>
  );
}

function isJSXElementConstructor<P = any>(
  type: any
): type is JSXElementConstructor<P> {
  return type instanceof Function;
}

function isLayer(
  child: any
): child is React.ReactElement<any, string | React.JSXElementConstructor<any>> {
  if (
    !isReactElement(child) ||
    !isJSXElementConstructor<{ id: string }>(child.type)
  ) {
    return false;
  }

  const {
    type: { name }
  } = child;

  return name === "Layer";
}

function isReactElement(child: any): child is React.ReactElement {
  return typeof child === "object" && child?.type instanceof Function;
}

function updateLayerIds(
  layers: string[],
  nextLayers: string[],
  setLayerOrder: (layers: string[]) => void
) {
  if (!layers || layers.length !== nextLayers.length) {
    console.log("updateLayerIds: no existing layers; setting layers.");
    setLayerOrder(nextLayers ?? []);
    return;
  }

  if (layers.length < 1 && nextLayers.length < 1) {
    return;
  }

  for (let i = 0; i < nextLayers.length; i++) {
    if (layers[i] !== nextLayers[i]) {
      console.log("updateLayerIds: layer order has changed; setting layers.");
      setLayerOrder(nextLayers);
      return;
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props
  extends Partial<
      React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      >
    >,
    MapGLOptions {}
