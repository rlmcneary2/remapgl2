import { useCallback, useContext, useEffect, useRef, useState } from "react";
import mapboxgl, { Map as MapGL } from "mapbox-gl";
import { MapOptions } from "./types";
import { DEFAULT_MAPBOXGL_CSS, DEFAULT_MAPBOX_STYLE } from "../constants";
import { Context } from "./context";

/**
 * A React hook to be used inside React components that need access to the
 * Mapbox Map control.
 */
export function useMapGL(options?: MapOptions) {
  const { mapGL, setMapGL } = useContext(Context);
  const [cssStatus, setCssStatus] = useState<"error" | "loaded">(null);
  const mapCreated = useRef(false);

  const {
    accessToken,
    cssFile = DEFAULT_MAPBOXGL_CSS,
    mapStyle = DEFAULT_MAPBOX_STYLE
  } = options ?? {};

  /**
   * Add the required Mapbox CSS file to the DOM.
   */
  useEffect(() => {
    if (document.getElementById("MAPBOX_GL_CSS_LINK")) {
      setCssStatus(current => (current === "loaded" ? current : "loaded"));
      return;
    }

    const cssLink = document.createElement("link");
    cssLink.href = cssFile;
    cssLink.id = "MAPBOX_GL_CSS_LINK";
    cssLink.rel = "stylesheet";
    cssLink.addEventListener("load", () => {
      console.log("useMapGL: css loaded.");
      setCssStatus("loaded");
    });
    cssLink.addEventListener("error", () => setCssStatus("error"));

    const head = document.getElementsByTagName("head")[0];
    head.appendChild(cssLink);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setMapContainer = useCallback(
    (container: HTMLElement) => {
      if (mapCreated.current) {
        throw new Error(
          "A map has already been created for this instance of RemapGL."
        );
      }

      mapCreated.current = true;

      (async function () {
        const map = await createMap({
          ...options,
          accessToken,
          container,
          mapStyle
        });
        setMapGL(map);
      })();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return {
    mapGL,
    ready: cssStatus === "loaded",
    setMapContainer
  };
}

async function createMap({
  accessToken,
  mapStyle,
  ...options
}: Omit<MapOptions, "cssFile"> & { container: HTMLElement }) {
  mapboxgl.accessToken = mapboxgl.accessToken || accessToken;

  const map = new MapGL({
    ...options,
    attributionControl: false,
    style: mapStyle
  });

  // Wait for the map resources to be loaded. Attempting to manipulate the
  // map before these are complete will result in errors.
  await Promise.all([
    new Promise<void>(resolve => map.once("load", () => resolve())),
    new Promise<void>(resolve => map.once("styledata", () => resolve()))
  ]);

  console.log("useMapGL createMap: map resources loaded.");

  return map;
}
