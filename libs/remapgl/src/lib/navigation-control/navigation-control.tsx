import { useEffect, useRef } from "react";
import { IControl, NavigationControl as NavigationControlGL } from "mapbox-gl";
import { useMapGL } from "../context/use-mapgl";

/**
 * Allow the user to manipulate the location displayed on the map.
 * @param props
 */
export function NavigationControl({
  showCompass,
  showZoom,
  visualizePitch
}: NavigationControlProps) {
  const { mapGL } = useMapGL();
  const control = useRef<IControl>(null);

  useEffect(() => {
    if (control.current) {
      return;
    }

    control.current = new NavigationControlGL({
      showCompass,
      showZoom,
      visualizePitch
    });

    mapGL.addControl(control.current);

    return () => {
      mapGL.removeControl(control.current);
      control.current = null;
    };
  }, [mapGL, showCompass, showZoom, visualizePitch]);

  return null;
}

/**
 * Components that implement this interface will display navigation controls on
 * the map.
 * @see
 * {@link https://docs.mapbox.com/mapbox-gl-js/api/markers/#navigationcontrol-parameters}
 */
export interface NavigationControlProps {
  /**
   * Display a compass control; defaults to `true`.
   * @see
   * {@link https://docs.mapbox.com/mapbox-gl-js/api/markers/#navigationcontrol-parameters Mapbox NavigationControl Parameters}
   */
  showCompass?: boolean;
  /**
   * Display a zoom in / out control; defaults to `true`.
   * @see
   * {@link https://docs.mapbox.com/mapbox-gl-js/api/markers/#navigationcontrol-parameters Mapbox NavigationControl Parameters}
   */
  showZoom?: boolean;
  /**
   * Control pitch using the compass control; defaults to `false`.
   * @see
   * {@link https://docs.mapbox.com/mapbox-gl-js/api/markers/#navigationcontrol-parameters Mapbox NavigationControl Parameters}
   */
  visualizePitch?: boolean;
}
