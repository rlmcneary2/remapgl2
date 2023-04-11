import { useEffect, useState } from "react";
import { AttributionControl as AttributionControlGL } from "mapbox-gl";
import { useMapGL } from "../context/use-mapgl";

/**
 * Display attribution information on a map. The information shown can be
 * customized.
 * @param props
 */
export function AttributionControl({
  compact = false,
  customAttribution
}: AttributionControlProps): null {
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

/**
 *  Components that implement this interface will display an attribution control
 *  on the map.
 * @see
 * {@link https://docs.mapbox.com/mapbox-gl-js/api/markers/#attributioncontrol Mapbox AttributionControl}
 */
export interface AttributionControlProps {
  /**
   * The size of the control.
   * @see
   * {@link https://docs.mapbox.com/mapbox-gl-js/api/markers/#attributioncontrol-parameters Mapbox AttributionControl Parameters}
   */
  compact?: boolean;
  /**
   * Set a custom attribution string.
   * @see
   * {@link https://docs.mapbox.com/mapbox-gl-js/api/markers/#attributioncontrol-parameters Mapbox AttributionControl Parameters}
   */
  customAttribution?: string | string[];
}
