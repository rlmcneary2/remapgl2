import {
  AnyLayer,
  EventData,
  MapLayerEventType,
  MapLayerMouseEvent,
  MapLayerTouchEvent
} from "mapbox-gl";

export type LayerProps = AnyLayer & {
  on?: [
    type: keyof MapLayerEventType,
    listener: (
      evt: (MapLayerMouseEvent | MapLayerTouchEvent) & EventData
    ) => void
  ][];
};
