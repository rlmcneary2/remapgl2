import { useEffect, useState } from "react";
import {
  GeolocateControl as GeoLocateControlGL,
  FitBoundsOptions
} from "mapbox-gl";
import { EventedEvent, MbxObj, OnEvents } from "../types";
import { useMapGL } from "../context/use-mapgl";

export function GeolocateControl({ obj, options, on }: Props) {
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
    console.log("GeolocateControl: create.");

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
      console.log("GeolocateControl: destroy.");
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

type GeolocateEventTypes = {
  error: EventedEvent<"error", GeoLocateControlGL> & GeolocationPositionError;
  geolocate: EventedEvent<"geolocate", GeoLocateControlGL> &
    GeolocationPosition;
  outofmaxbounds: EventedEvent<"outofmaxbounds", GeoLocateControlGL> &
    GeolocationPosition;
  trackuserlocationend: EventedEvent<
    "trackuserlocationend",
    GeoLocateControlGL
  > &
    GeolocationPosition;
  trackuserlocationstart: EventedEvent<
    "trackuserlocationstart",
    GeoLocateControlGL
  > &
    GeolocationPosition;
};

interface Props
  extends MbxObj<GeoLocateControlGL>,
    OnEvents<GeolocateEventTypes> {
  options?: {
    positionOptions?: PositionOptions;
    fitBoundsOptions?: FitBoundsOptions;
    trackUserLocation?: boolean;
    showAccuracyCircle?: boolean;
    showUserLocation?: boolean;
  };
}
