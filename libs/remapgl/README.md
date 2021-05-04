# remapgl

React components to create mapbox-gl maps declaratively.

## install

```bash
yarn install remapgl
```

## use

Components accept most of the properties described in the Mapbox GL
documentation as props.

### map

The root component of the map is `RemapGL`, all other components must be children of
`RemapGL`.

```tsx
import { RemapGL } from "remapgl";

export function App() {
  return <RemapGL accessToken="your access token" />;
}
```

### markers

```tsx
import { Marker, RemapGL } from "remapgl";

export function App() {
  return (
    <RemapGL accessToken="your access token">
      <Marker lnglat={{ lng: -68.2954881, lat: 44.3420759 }} />
    </RemapGL>
  );
}
```

### layers

Layer order in the map is controlled by the order of the elements in the array
provided to the `layers` prop.

```tsx
import { CircleLayer, CirclePaint } from "mapbox-gl";
import { FeatureCollection, Geometry } from "geojson";
import { LayerCollection, RemapGL } from "remapgl";

export function App() {
  return (
    <RemapGL accessToken="your access token">
      <LayerCollection layers={layerData} />
    </RemapGL>
  );
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

const layerData: CircleLayer[] = [
  {
    id: "black",
    paint,
    source: { data, type: "geojson" },
    type: "circle"
  }
];
```

### other controls

```tsx
import {
  AttributionControl,
  GeolocateControl,
  NavigationControl,
  RemapGL,
  ScaleControl,
  FullscreenControl
} from "remapgl";


export function App() {
  return (
    <RemapGL accessToken="your access token">
      <AttributionControl />
      <FullscreenControl />
      <GeolocateControl />
      <NavigationControl showCompass showZoom />
      <ScaleControl />
    </RemapGL>
  );
}
```

### imperative functions

This library adopts the same convention as React does regarding HTML elements.
Components that wrap a Mapbox GL control that exposes callable functions support
the `MbxObj` interface. A callback function provided to such a component's `obj`
prop will be invoked with a single argument that is the current instance of the
Mapbox GL control.

The following components support the `MbxObj` interface:
- RemapGL: returns `mapboxgl.Map`.
- Marker: returns: `mapboxgl.Marker`.
- GeolocateControl: returns `mapboxgl.GeoLocateControl`.
