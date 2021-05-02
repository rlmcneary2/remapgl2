import { useEffect, useState } from "react";
import { AttributionControl as AttributionControlMbx } from "mapbox-gl";
import { useMapGL } from "../context/use-mapgl";

/**
 * Custom attributions for the map.
 * @param props
 */
export function AttributionControl(props: Options = {}) {
  const { mapGL } = useMapGL();
  const [, setControl] = useState<AttributionControlMbx>(null);

  const { compact, customAttribution } = props;
  useEffect(() => {
    const opts: Options = { compact: compact ?? false };

    if (customAttribution) {
      opts.customAttribution = customAttribution;
    }

    const nextControl = new AttributionControlMbx(opts);

    mapGL.addControl(nextControl);
    setControl(nextControl);

    return () => {
      mapGL.removeControl(nextControl);
      setControl(null);
    };
  }, [compact, customAttribution, mapGL]);

  return null;
}

interface Options {
  compact?: boolean;
  customAttribution?: string | string[];
}
