import { useEffect, useState } from "react";
import {
  GeolocateControl as GeoLocateControlGL,
  FitBoundsOptions
} from "mapbox-gl";
import { EventedEvent, MbxObj, OnEvents } from "../types";
import { useMapGL } from "../context/use-mapgl";

/**
 * Create a control that allows the user to zoom the map to their current
 * location.
 * @param props
 */
export function GeolocateControl({
  obj,
  options,
  on
}: GeolocateControlProps): null {
  const [control, setControl] = useState<GeoLocateControlGL>();
  const { mapGL } = useMapGL();

  const {
    positionOptions,
    fitBoundsOptions,
    trackUserLocation,
    showAccuracyCircle,
    showUserLocation
  } = options ?? {};

  useEffect(() => {
    const sourceOptions = {
      positionOptions,
      fitBoundsOptions,
      trackUserLocation,
      showAccuracyCircle,
      showUserLocation
    };

    const nextOptions = Object.keys(sourceOptions).reduce((output, key) => {
      if ((sourceOptions[key] ?? null) !== null) {
        output[key] = sourceOptions[key];
      }

      return output;
    }, {});

    const nextControl = new GeoLocateControlGL(nextOptions);

    if (on) {
      for (const [type, listener] of Object.entries(on)) {
        nextControl.on(type, listener);
      }
    }

    mapGL.addControl(nextControl);

    setControl(nextControl);

    return () => {
      if (on) {
        for (const [type, listener] of Object.entries(on)) {
          nextControl.off(type, listener);
        }
      }

      mapGL.removeControl(nextControl);

      setControl(null);
    };
  }, [
    fitBoundsOptions,
    mapGL,
    on,
    positionOptions,
    showAccuracyCircle,
    showUserLocation,
    trackUserLocation
  ]);

  useEffect(() => {
    if (obj && control !== undefined) {
      obj(control);
    }
  }, [control, obj]);

  return null;
}

/**
 * Geolocate events that implement the EventedEvent interface.
 * @see
 * {@link https://docs.mapbox.com/mapbox-gl-js/api/markers/#geolocatecontrol-events Mapbox Geolocate}
 */
export type GeolocateEventTypes = {
  /**
   * @see
   * {@link https://docs.mapbox.com/mapbox-gl-js/api/markers/#geolocatecontrol.event:error Mapbox Geolocate error event}*/
  error: EventedEvent<"error", GeoLocateControlGL> & GeolocationPositionError;
  /**
   * @see
   * {@link https://docs.mapbox.com/mapbox-gl-js/api/markers/#geolocatecontrol.event:geolocate Mapbox Geolocate geolocate event}*/
  geolocate: EventedEvent<"geolocate", GeoLocateControlGL> &
    GeolocationPosition;
  /**
   * @see
   * {@link https://docs.mapbox.com/mapbox-gl-js/api/markers/#geolocatecontrol.event:outofmaxbounds Mapbox Geolocate outofmaxbounds event}*/
  outofmaxbounds: EventedEvent<"outofmaxbounds", GeoLocateControlGL> &
    GeolocationPosition;
  /**
   * @see
   * {@link https://docs.mapbox.com/mapbox-gl-js/api/markers/#geolocatecontrol.event:trackuserlocationend Mapbox Geolocate trackuserlocationend event}*/
  trackuserlocationend: EventedEvent<
    "trackuserlocationend",
    GeoLocateControlGL
  > &
    GeolocationPosition;
  /**
   * @see
   * {@link https://docs.mapbox.com/mapbox-gl-js/api/markers/#geolocatecontrol.event:trackuserlocationstart Mapbox Geolocate trackuserlocationstart event}*/
  trackuserlocationstart: EventedEvent<
    "trackuserlocationstart",
    GeoLocateControlGL
  > &
    GeolocationPosition;
};

/**
 * Components that implement this interface will allow the user to focus the map
 * on their current location.
 * @see
 * {@link https://docs.mapbox.com/mapbox-gl-js/api/markers/#geolocatecontrol Mapbox GeoLocateControl}
 */
export interface GeolocateControlProps
  extends MbxObj<GeoLocateControlGL>,
    OnEvents<GeolocateEventTypes> {
  /**
   * Configuration for how geolocation appears and operates.
   * @see
   * {@link https://docs.mapbox.com/mapbox-gl-js/api/markers/#geolocatecontrol-parameters Mapbox GeoLocateControl Parameters}
   */
  options?: {
    /**
     * Determines the map appearance as it pans / zooms to the user's location.
     * @see
     * {@link https://docs.mapbox.com/mapbox-gl-js/api/map/#map#fitbounds Mapbox fitBounds options}
     */
    fitBoundsOptions?: FitBoundsOptions;
    /**
     * Configure how the user's location is determined.
     * @see
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition#parameters Mapbox PositionOptions}
     */
    positionOptions?: PositionOptions;
    /**
     * Display a circle on the map indicating the user's location with 95%
     * confidence.
     * @see
     * {@link https://docs.mapbox.com/mapbox-gl-js/api/markers/#geolocatecontrol-parameters Mapbox GeoLocateControl Parameters}
     */
    showAccuracyCircle?: boolean;
    /**
     * Show a dot on the map to indicate the user's location.
     * @see
     * {@link https://docs.mapbox.com/mapbox-gl-js/api/markers/#geolocatecontrol-parameters Mapbox GeoLocateControl Parameters}
     */
    showUserLocation?: boolean;
    /**
     * Continuously update the user's current location.
     * @see
     * {@link https://docs.mapbox.com/mapbox-gl-js/api/markers/#geolocatecontrol-parameters Mapbox GeoLocateControl Parameters}
     */
    trackUserLocation?: boolean;
  };
}
