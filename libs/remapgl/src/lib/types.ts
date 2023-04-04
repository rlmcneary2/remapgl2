import {
  AnyLayer as AnyLayerGL,
  Map as MapGL,
  MapLayerEventType,
  Popup as PopupGL,
  PopupOptions as PopupOptionsGL,
  SymbolLayer
} from "mapbox-gl";
import React from "react";

/**
 * Not all the events from Mapbox implement the EventedEvent interface. This
 * interface exists so that such events can be extended so that the `event`
 * argument in the listener has the missing properties.
 * @template Type The event type or name.
 * @template Target The type of the control that raised the event.
 * @see
 * {@link https://docs.mapbox.com/mapbox-gl-js/api/events/#evented|Mapbox Evented }
 */
export interface EventedEvent<Type extends string, Target = unknown> {
  /**
   * The control that raised the event for example `GeoLocateControl`.
   */
  target: Target;
  /**
   * The event name; for example "geolocate".
   */
  type: Type;
}

/**
 * A layer that supports events.
 */
export type AnyLayer = AnyLayerGL & OnEvents<MapLayerEventType>;

/**
 * Provides the Mapbox control that backs the React component. This is similar
 * to React's `ref` concept and working with DOM objects. Implement this
 * interface if a component's prop provider is allowed to access the underlying
 * Mapbox control. Should be implemented whenever the Mapbox control has methods
 * that can only be effectively invoked imperatively.
 * @template T The Mapbox control type.
 */
export interface MbxObj<T> {
  /**
   * Invoked to pass the Mapbox control to the function provider, typically the
   * parent React component.
   * @param obj The Mapbox control that backs the React component.
   */
  obj?: (obj: T) => void;
}

/**
 * Defines the the names of events `EventTypes` and the possible types of the
 * event that will be provided to the listener `ListenerEvents`.
 */
export interface OnEvents<EventTypes> {
  on?: {
    [Property in keyof EventTypes]+?:
      | ((evt: EventTypes[Property]) => void)
      | ((evt: EventTypes[Property]) => any);
  };
}

export interface SymbolIconLayer extends SymbolLayer {
  iconImageUrl: string;
  imageOptions?: Parameters<MapGL["addImage"]>[2];
}

/**
 * Components that implement this interface can display a popup on the map.
 */
export interface HasPopup {
  /**
   * Render function that returns a React component to be displayed as the
   * content of a custom popup.
   * @param popupGL The MapboxGL Popup control associated with an owning
   * MapboxGL control.
   * @see
   * {@link https://docs.mapbox.com/mapbox-gl-js/api/markers/#popup|Mapbox Popup}
   */
  popup?: (popupGL: PopupGL) => React.ReactNode;
  /**
   * Options that are passed to the constructor of the MapboxGL Popup control.
   * @see
   * {@link https://docs.mapbox.com/mapbox-gl-js/api/markers/#popup-parameters|Mapbox Popup Parameters}
   */
  popupOptions?: PopupOptionsGL;
}
