import {
  AnyLayer as AnyLayerGL,
  MapLayerEventType,
  Popup as PopupGL,
  PopupOptions as PopupOptionsGL
} from "mapbox-gl";
import React from "react";

/**
 * Not all the events from Mapbox have the EventedEvent interface applied. This
 * interface can be extended so that the event argument in the listener has the
 * correct properties.
 */
export interface EventedEvent<Type, Target = unknown> {
  target: Target;
  type: Type;
}

/**
 * A layer that supports events.
 */
export type AnyLayer = AnyLayerGL & OnEvents<MapLayerEventType>;

/**
 * Provides the Mapbox object that backs the React component. This is similar to
 * React's `ref` concept and working with DOM objects. Implement this interface
 * if a component's prop provider is allowed to access the underlying Mapbox
 * object. Should be implemented whenever the Mapbox object has methods that can
 * only be effectively invoked imperatively.
 * @template T The Mapbox object type.
 */
export interface MbxObj<T> {
  /**
   * @param obj The Mapbox object of the type specified by T.
   */
  obj?: (obj: T) => void;
}

/**
 * Defines the the names of events `EventTypes` and the possible types of the
 * event that will be provided to the listener `ListenerEvents`.
 */
export interface OnEvents<EventTypes> {
  on?: {
    [Property in keyof EventTypes]+?: (evt: EventTypes[Property]) => void;
  };
}

/**
 * Objects that can display a popup implement this interface. The popup
 * component to be displayed can optionally be provided through the `popup`
 * method.
 */
export interface HasPopup {
  popup?: (
    popupGL: PopupGL
  ) => React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  popupOptions?: PopupOptionsGL;
}
