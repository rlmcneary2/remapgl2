import { useEffect, useState } from "react";
import { AttributionControl as AttributionControlGL } from "mapbox-gl";
import { useMapGL } from "../context/use-mapgl";

/**
 * Custom attributions for the map.
 * @param props
 */
export function AttributionControl({
  compact = false,
  customAttribution
}: AttributionControlProps) {
  const { mapGL } = useMapGL();
  const [, setControl] = useState<AttributionControlGL>(null);

  useEffect(() => {
    const opts: AttributionControlProps = { compact };

    if (customAttribution) {
      opts.customAttribution = customAttribution;
    }

    const nextControl = new AttributionControlGL(opts);

    mapGL.addControl(nextControl);
    setControl(nextControl);

    return () => {
      mapGL.removeControl(nextControl);
      setControl(null);
    };
  }, [compact, customAttribution, mapGL]);

  return null;
}

export interface AttributionControlProps {
  /**
   * The size of the control.
   * @see https://docs.mapbox.com/mapbox-gl-js/api/markers/#attributioncontrol-parameters
   */
  compact?: boolean;
  /**
   * Set a custom attribution string.
   * @see https://docs.mapbox.com/mapbox-gl-js/api/markers/#attributioncontrol-parameters
   */
  customAttribution?: string | string[];
}
