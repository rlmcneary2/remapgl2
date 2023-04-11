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
 * @template Target The type of the Mapbox control that raised the event.
 * @see
 * {@link https://docs.mapbox.com/mapbox-gl-js/api/events/#evented Mapbox Evented }
 */
export interface EventedEvent<Type extends string, Target = unknown> {
  /**
   * The Mapbox control that raised the event.
   */
  target: Target;
  /**
   * The event name.
   */
  type: Type;
}

/**
 * A layer with support for layer events.
 * @see
 * {@link https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/ Mapbox Layers}
 */
export type AnyLayer = AnyLayerGL & OnEvents<MapLayerEventType>;

/**
 * Provides the Mapbox control that backs the React component. This is similar
 * to React's `ref` concept and working with HTML DOM objects. Implement this
 * interface if a component's owner is allowed to access the underlying Mapbox
 * control. Should be implemented whenever the Mapbox control has methods that
 * can only be effectively invoked imperatively.
 * @template T The Mapbox control type.
 */
export interface MbxObj<T> {
  /**
   * Invoked to pass the Mapbox control to the function provider, typically the
   * parent React component.
   * @param obj An instance of the type of the Mapbox control that backs the
   * React component.
   */
  obj?: (obj: T) => void;
}

/**
 * Objects that implement this interface will have events connected to the
 * underlying Mapbox control that raises the events defined by the `EventTypes`
 * generic.
 * @template EventTypes The types of events.
 */
export interface OnEvents<EventTypes> {
  /**
   * A collection of handlers for events with names defined by the `EventTypes`
   * generic.
   * @example
   * ```tsx
   * on: {
   *   click: evt => console.log(evt),
   *   drag: evt => console.log(evt)
   * };
   * ```
   */
  on?: {
    [Property in keyof EventTypes]+?:
      | ((evt: EventTypes[Property]) => void)
      | ((evt: EventTypes[Property]) => any);
  };
}

/**
 * A layer that displays one or more symbols at geographic points on the map.
 * @see
 * {@link https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#symbol Mapbox symbol layer}
 */
export interface SymbolIconLayer extends SymbolLayer {
  /**
   * A URL to an image resource to be displayed as the symbol for the
   * coordinates in the layer.
   */
  iconImageUrl: string;
  /**
   * Options for the image resource.
   * @see
   * {@link https://docs.mapbox.com/mapbox-gl-js/api/map/#map#addlayer Mapbox addLayer method}
   */
  imageOptions?: Parameters<MapGL["addImage"]>[2];
}

/**
 * Components that implement this interface can display a popup on the map.
 */
export interface HasPopup {
  /**
   * Render function that returns a React component to be displayed as the
   * content of a custom popup.
   * @param popupGL The Mapbox Popup control associated with an owning
   * Mapbox control.
   * @see
   * {@link https://docs.mapbox.com/mapbox-gl-js/api/markers/#popup Mapbox Popup}
   */
  popup?: (popupGL: PopupGL) => React.ReactNode;
  /**
   * Options that are passed to the constructor of the Mapbox Popup control.
   * @see
   * {@link https://docs.mapbox.com/mapbox-gl-js/api/markers/#popup-parameters Mapbox Popup Parameters}
   */
  popupOptions?: PopupOptionsGL;
}
