import { useEffect, useRef, useState } from "react";
import mapboxgl, {
  Layer as LayerGL,
  MapLayerEventType,
  SymbolLayer
} from "mapbox-gl";
import { AnyLayer, SymbolIconLayer } from "../types";
import { useMapGL } from "../context/use-mapgl";

/**
 * Represents a layer that will be added to the map.
 * @description No elements are created in the DOM by this component.
 */
export function Layer({
  addedLayers,
  beforeId,
  onLayerChanged,
  ...props
}: LayerProps) {
  const [lastBeforeId, setLastBeforeId] = useState(beforeId);
  const added = useRef<"pending" | "active" | "complete">("pending");
  const { mapGL } = useMapGL();

  const { on } = props;
  const { id, layout, paint, source, type } = props as LayerGL;
  const iconImage = (props as SymbolIconLayer).layout?.["icon-image"];
  const { iconImageUrl, imageOptions } = props as SymbolIconLayer;

  useEffect(() => {
    console.log(`Layer[${id}]: mounted.`);
    return () => console.log(`Layer[${id}]: unmounted.`);
  }, [id]);

  /**
   * Add the layer to the map.
   */
  useEffect(() => {
    if (added.current !== "pending") {
      return;
    }

    added.current = "active";

    (async () => {
      if (iconImage && iconImageUrl) {
        await loadSymbolImage(mapGL, iconImageUrl, iconImage, imageOptions);
      }

      const args: LayerGL = { id, paint, source, type };
      if (layout) {
        args.layout = layout;
      }

      mapGL.addLayer(args as AnyLayer);
      added.current = "complete";
      onLayerChanged(id, "added");
    })();

    return () => {
      if (added.current === "complete") {
        mapGL.removeLayer(id).removeSource(id);
      }

      added.current = "pending";
      onLayerChanged(id, "removed");
    };
  }, [
    iconImage,
    iconImageUrl,
    id,
    imageOptions,
    layout,
    mapGL,
    onLayerChanged,
    paint,
    source,
    type
  ]);

  /**
   * Connect `on` event listeners.
   */
  useEffect(() => {
    if (!on) {
      return;
    }

    for (const [type, listener] of Object.entries(on)) {
      mapGL.on(type as keyof MapLayerEventType, id, listener);
    }

    return () => {
      for (const [type, listener] of Object.entries(on)) {
        mapGL.off(type as keyof MapLayerEventType, id, listener);
      }
    };
  }, [id, mapGL, on]);

  /**
   * Reorder the layer on the map if it has changed.
   */
  useEffect(() => {
    if (lastBeforeId === beforeId) {
      return;
    }

    if (!beforeId) {
      return;
    }

    // If the layer associated with `beforeId` hasn't been added to the mapGL
    // yet don't try to move the current layer.
    if (!addedLayers?.includes(beforeId)) {
      return;
    }

    mapGL.moveLayer(id, beforeId);
    setLastBeforeId(beforeId);
  }, [addedLayers, beforeId, id, lastBeforeId, mapGL]);

  const { visibility } = layout ?? {};

  /**
   * Update layer visibility.
   */
  useEffect(() => {
    if (!mapGL || added.current !== "complete") {
      return;
    }

    mapGL.setLayoutProperty(id, "visibility", visibility ?? "visible");
  }, [id, mapGL, visibility]);

  return null;
}

function loadSymbolImage(
  mapGL: mapboxgl.Map,
  iconImageUrl: string,
  iconImage: SymbolLayer["layout"]["icon-image"],
  imageOptions?: SymbolIconLayer["imageOptions"]
) {
  return new Promise<void>(resolve => {
    if (typeof iconImage !== "string") {
      console.warn(
        `The icon-image is not a string. The image at '${iconImageUrl}' will not be loaded.`
      );
      resolve();
      return;
    }

    if (mapGL.hasImage(iconImage)) {
      resolve();
      return;
    }

    mapGL.loadImage(iconImageUrl, (err, image) => {
      if (!err) {
        // Check for the image again because there could be two near-parallel
        // requests to load the same image file.
        if (!mapGL.hasImage(iconImage)) {
          const args: Parameters<mapboxgl.Map["addImage"]> = [iconImage, image];

          if (imageOptions) {
            args.push(imageOptions);
          }

          mapGL.addImage(...args);
        }
      }

      resolve();
    });
  });
}

export type LayerProps = AnyLayer & {
  /** Layers that have been added to the mapboxgl Map instance. */
  addedLayers: string[];
  /** If provided the map's layer order will be updated if necessary to put this
   * layer before the referenced layer. */
  beforeId?: string;
  onLayerChanged: (
    /** The ID of the layer that changed. */ id: string,
    /** Was the layer added to or removed from the Map? */ status:
      | "added"
      | "removed"
  ) => void;
};
