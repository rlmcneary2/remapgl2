import { useEffect, useState } from "react";
import { FullscreenControl as FullscreenControlGL } from "mapbox-gl";
import { useMapGL } from "../context/use-mapgl";

/**
 * Add a control that allows the user to toggle the map in and out of
 * fullscreen.
 */
export function FullscreenControl(): null {
  const [, setControl] = useState<FullscreenControlGL>(null);
  const { mapGL } = useMapGL();

  useEffect(() => {
    const nextControl = new FullscreenControlGL();
    mapGL.addControl(nextControl);
    setControl(nextControl);

    return () => {
      mapGL.removeControl(nextControl);
      setControl(null);
    };
  }, [mapGL]);

  return null;
}
