import { useEffect, useRef } from "react";
import { IControl, NavigationControl as NavigationControlGL } from "mapbox-gl";
import { useMapGL } from "../context/use-mapgl";

export function NavigationControl({
  showCompass,
  showZoom,
  visualizePitch
}: Props) {
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

interface Props {
  showCompass?: boolean;
  showZoom?: boolean;
  visualizePitch?: boolean;
}
