import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { FeatureCollection, Geometry } from "geojson";
import {
  CircleLayer,
  CirclePaint,
  LngLatLike,
  Marker as MarkerGL,
  Popup as PopupGL,
  SymbolLayer,
  SymbolPaint
} from "mapbox-gl";
import {
  AnyLayer,
  AttributionControl,
  GeolocateControl,
  LayerCollection,
  Marker,
  NavigationControl,
  RemapGL,
  MapPopup,
  ScaleControl,
  FullscreenControl,
  SymbolIconLayer,
  useMapGL
} from "@remapgl/remapgl";

const mapOptions = {
  accessToken: window.location.hash.slice(1),
  center: { lng: -68.2954881, lat: 44.3420759 },
  zoom: 9
};

export default function App() {
  const ref = useRef();

  return (
    <RemapGL ref={ref} {...mapOptions}>
      <AttributionControl />
      <FullscreenControl />
      <GeolocateControl
        obj={o => {
          // o.trigger();
        }}
        on={{
          geolocate: e => console.log("App: geolocate=%o", e),
          error: e => console.log("App: error=%o", e)
        }}
        options={{
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true
        }}
      />
      <NavigationControl showCompass showZoom />
      <ScaleControl unit="imperial" />
      <DynamicMap />
    </RemapGL>
  );
}

function DynamicMap() {
  const { mapGL } = useMapGL();
  const [layers, setLayers] = useState(layerData);
  const [popupLocation, setPopupLocation] = useState<LngLatLike>(null);

  const eventLayers = useMemo<AnyLayer[]>(() => {
    return layers.map(layer => {
      const anyLayer: AnyLayer = {
        ...layer,
        on: {
          click: evt => setPopupLocation(evt.lngLat),
          mouseover: () => console.log(`${layer.id} on mouseover`)
        }
      };

      if (layer.type === "symbol" && layer.layout) {
        (anyLayer as SymbolIconLayer).iconImageUrl = "assets/trh.png";
        anyLayer.layout = layer.layout;
      }

      return anyLayer;
    });
  }, [layers]);

  const handleMarkerObj = useCallback(
    (mrk: MarkerGL) =>
      setTimeout(() => {
        // mrk.togglePopup();
      }, 4000),
    []
  );

  useEffect(() => {
    setTimeout(() => setLayers(current => [...current.reverse()]), 3000);
  }, []);

  return (
    <>
      {/* <Marker
        draggable={true}
        lnglat={{ lng: -68.3864896, lat: 44.3420759 }}
        popup={popupGL => <Popup popupGL={popupGL} />}
        popupOptions={{ closeButton: false, closeOnClick: true }}
      >
        <MarkerElement />
      </Marker> */}
      <Marker
        draggable={true}
        lnglat={{ lng: -68.2954881, lat: 44.3420759 }}
        on={{ click: evt => console.log(evt) }}
        // popup={popupGL => <Popup popupGL={popupGL} />}
      />
      <LayerCollection layers={eventLayers} />
      {popupLocation ? (
        <MapPopup
          lngLat={popupLocation}
          options={{ closeButton: false, closeOnClick: true }}
        >
          <div>POPPED</div>
        </MapPopup>
      ) : null}
    </>
  );
}

function MarkerElement() {
  return (
    <section
      style={{
        backgroundColor: "yellow",
        color: "black",
        height: "50px",
        width: "50px"
      }}
    >
      hello
    </section>
  );
}

function Popup({ popupGL }: { popupGL: PopupGL }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    popupGL.on("dragstart", () => console.log("POPUP DRAGSTART"));
  }, [popupGL]);

  useEffect(() => {
    setInterval(() => setCount(c => c + 1), 3000);
  }, []);

  console.log(popupGL);

  return <span>Popped! {count}</span>;
}

const data: FeatureCollection<Geometry, Record<string, any>> = {
  features: [
    {
      geometry: {
        coordinates: [-68.18928528, 44.32134247],
        type: "Point"
      },
      properties: {
        title: "Thunder Hole"
      },
      type: "Feature"
    },
    {
      geometry: {
        coordinates: [-68.18968201, 44.31101227],
        type: "Point"
      },
      properties: {
        title: "Otter Cliff"
      },
      type: "Feature"
    },
    {
      geometry: {
        coordinates: [-68.19212177, 44.31437683],
        type: "Point"
      },
      properties: {
        title: "Fabbri Picnic Area"
      },
      type: "Feature"
    },
    {
      geometry: {
        coordinates: [-68.184021, 44.32995987],
        type: "Point"
      },
      properties: {
        title: "Sand Beach"
      },
      type: "Feature"
    },
    {
      geometry: {
        coordinates: [-68.20548248, 44.38788986],
        type: "Point"
      },
      properties: {
        title: "Village Green"
      },
      type: "Feature"
    },
    {
      geometry: {
        coordinates: [-68.232262, 44.379589],
        type: "Point"
      },
      properties: {
        title: "Cadillac N Ridge"
      },
      type: "Feature"
    },
    {
      geometry: {
        coordinates: [-68.20748138, 44.36243439],
        type: "Point"
      },
      properties: {
        title: "Sieur De Monts"
      },
      type: "Feature"
    },
    {
      geometry: {
        coordinates: [-68.191312, 44.307236],
        type: "Point"
      },
      properties: {
        title: "Otter Point"
      },
      type: "Feature"
    }
  ],
  type: "FeatureCollection"
};

const paint: CirclePaint = {
  "circle-color": "#222",
  "circle-radius": {
    base: 1.15,
    stops: [
      [10, 5],
      [14, 5]
    ]
  },
  "circle-stroke-color": "#FFF",
  "circle-stroke-opacity": 0.8,
  "circle-stroke-width": {
    base: 1.15,
    stops: [
      [10, 3],
      [14, 3]
    ]
  }
};

// const layerData: CircleLayer[] = [
//   {
//     id: "black",
//     paint,
//     source: { data, type: "geojson" },
//     type: "circle"
//   },
//   {
//     id: "red",
//     paint: { ...paint, "circle-color": "#F22" },
//     source: { data, type: "geojson" },
//     type: "circle"
//   }
// ];

const symPaint: SymbolPaint = {};

const layerData: SymbolLayer[] = [
  {
    id: "sym-black",
    layout: { "icon-image": "trh", "icon-size": 0.5 },
    paint: symPaint,
    source: { data, type: "geojson" },
    type: "symbol"
  }
];
