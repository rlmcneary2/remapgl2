import { useEffect, useState } from "react";
import { ScaleControl as ScaleControlGL } from "mapbox-gl";
import { useMapGL } from "../context/use-mapgl";

/**
 * Scale control displayed on the map.
 * @param props
 */
export function ScaleControl(props: Options = {}) {
  const [control, setControl] = useState<ScaleControlGL>(null);
  const { mapGL } = useMapGL();

  const { maxWidth, unit } = props;

  useEffect(() => {
    let opts: Options;
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

interface Options {
  maxWidth?: number;
  unit?: "imperial" | "metric" | "nautical";
}
