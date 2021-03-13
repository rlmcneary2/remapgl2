import React, { useEffect, useRef, useState } from "react";
import { FeatureCollection, Geometry } from "geojson";
import { CircleLayer } from "mapbox-gl";
import { Layer, RemapGL, Marker } from "@remapgl/remapgl";

export default function App() {
  const ref = useRef();
  const [layers, setLayers] = useState(layerData);

  useEffect(() => {
    setTimeout(() => setLayers(current => [...current.reverse()]), 3000);
  }, []);

  return (
    <RemapGL
      accessToken="pk.eyJ1IjoicmxtY25lYXJ5MiIsImEiOiJjajgyZjJuMDAyajJrMndzNmJqZDFucTIzIn0.BYE_k7mYhhVCdLckWeTg0g"
      ref={ref}
    >
      <Marker lnglat={{ lng: -68.2954881, lat: 44.3420759 }} />
      {layers.map(({ id, ...props }: any) => (
        <Layer
          {...props}
          id={id}
          key={id}
          on={["mouseOver", () => console.log(`${id} on mouseover`)]}
        />
      ))}
    </RemapGL>
  );
}

const data: FeatureCollection<Geometry, { [name: string]: any }> = {
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

const paint = {
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
  },
  {
    id: "red",
    paint: { ...paint, "circle-color": "#F22" },
    source: { data, type: "geojson" },
    type: "circle"
  }
];
