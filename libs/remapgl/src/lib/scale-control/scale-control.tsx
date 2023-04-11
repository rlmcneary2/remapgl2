import { useEffect, useState } from "react";
import { ScaleControl as ScaleControlGL } from "mapbox-gl";
import { useMapGL } from "../context/use-mapgl";

/**
 * A scale control that indicates the scale at the current zoom level.
 * @param props
 */
export function ScaleControl({ maxWidth, unit }: ScaleControlProps) {
  const [control, setControl] = useState<ScaleControlGL>(null);
  const { mapGL } = useMapGL();

  useEffect(() => {
    let opts: ScaleControlProps;
    if (maxWidth) {
      opts = opts ?? {};
      opts.maxWidth = maxWidth;
    }

    if (unit) {
      opts = opts ?? {};
      opts.unit = unit;
    }

    const nextControl = new ScaleControlGL(opts);
    mapGL.addControl(nextControl);
    setControl(nextControl);

    return () => {
      mapGL.removeControl(nextControl);
      setControl(null);
    };
  }, [mapGL, maxWidth, unit]);

  useEffect(() => {
    control && unit && control.setUnit(unit);
  }, [control, unit]);

  return null;
}

/**
 * Implemented by components that display a scale control on the map.
 * @see
 * {@link https://docs.mapbox.com/mapbox-gl-js/api/markers/#scalecontrol Mapbox ScaleControl}
 */
export interface ScaleControlProps {
  /**
   * Maximum length of the scale control on the display in pixels; defaults to 100.
   * @see
   * {@link https://docs.mapbox.com/mapbox-gl-js/api/markers/#scalecontrol-parameters Mapbox ScaleControl Parameters}
   */
  maxWidth?: number;
  /**
   * Distance units; defaults to "metric".
   * @see
   * {@link https://docs.mapbox.com/mapbox-gl-js/api/markers/#scalecontrol-parameters Mapbox ScaleControl Parameters}
   */
  unit?: "imperial" | "metric" | "nautical";
}
