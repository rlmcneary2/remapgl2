import { useCallback, useContext, useEffect, useRef, useState } from "react";
import mapboxgl, { LngLatLike, Map as MapGL } from "mapbox-gl";
import { MapGLOptions } from "./types";
import { Context } from "./context";

const DEFAULT_CENTER: LngLatLike = { lng: -68.2954881, lat: 44.3420759 };
const DEFAULT_MAPBOXGL_CSS =
  "//api.tiles.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.css";
const DEFAULT_MAPBOX_STYLE = "mapbox://styles/mapbox/outdoors-v11";
const DEFAULT_ZOOM = 9;

export function useMapGL(options?: MapGLOptions) {
  const { mapGL, setMapGL } = useContext(Context);
  const [cssStatus, setCssStatus] = useState<"error" | "loaded">(null);
  const mapCreated = useRef(false);

  const {
    accessToken,
    center = DEFAULT_CENTER,
    cssFile = DEFAULT_MAPBOXGL_CSS,
    mapStyle = DEFAULT_MAPBOX_STYLE,
    zoom = DEFAULT_ZOOM
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
          accessToken,
          center,
          container,
          mapStyle,
          zoom
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
}: Omit<MapGLOptions, "cssFile"> & { container: HTMLElement }) {
  mapboxgl.accessToken = mapboxgl.accessToken || accessToken;

  const map = new MapGL({ ...options, style: mapStyle });

  // Wait for the map resources to be loaded. Attempting to manipulate the
  // map before these are complete will result in errors.
  await Promise.all([
    new Promise<void>(resolve => {
      function handleLoad() {
        map.off("load", handleLoad);
        resolve();
      }

      map.on("load", handleLoad);
    }),
    new Promise<void>(resolve => {
      function handleStyleData() {
        map.off("styledata", handleStyleData);
        resolve();
      }

      map.on("styledata", handleStyleData);
    })
  ]);

  console.log("createMap: map resources loaded.");

  return map;
}
