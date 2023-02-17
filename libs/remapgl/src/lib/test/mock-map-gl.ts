import { Map as MapGL } from "mapbox-gl";

export function createMockMapGL() {
  const mockMapGL: Partial<MapGL> = {
    addLayer: jest.fn(),
    addImage: jest.fn(),
    hasImage: jest.fn(),
    loadImage: jest.fn(),
    moveLayer: jest.fn(),
    off: jest.fn(),
    on: jest.fn(),
    removeLayer: jest.fn(),
    removeSource: jest.fn(),
    setLayoutProperty: jest.fn()
  };

  return mockMapGL as MapGL;
}
