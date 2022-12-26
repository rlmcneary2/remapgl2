import { render, screen } from "@testing-library/react";
import { MutableRefObject } from "react";
import type { MapOptions } from "./context/types";
import * as useMapGLModule from "./context/use-mapgl";
import { Map } from "./map";

const mockUseMapGL = jest.fn<
  ReturnType<typeof useMapGLModule.useMapGL>,
  [MapOptions]
>(() => ({
  mapGL: mockUseMapGL_mapGL,
  ready: mockUseMapGL_ready,
  setMapContainer: mockUseMapGL_setMapContainer
}));

jest.mock<typeof useMapGLModule>("./context/use-mapgl", () => ({
  useMapGL: options => mockUseMapGL(options)
}));

let mockUseMapGL_mapGL = undefined;
let mockUseMapGL_ready = false;
const mockUseMapGL_setMapContainer = jest.fn();

describe("Map", () => {
  beforeEach(() => {
    mockUseMapGL.mockClear();
    mockUseMapGL_setMapContainer.mockClear();
  });

  test("render", () => {
    const objHandler = jest.fn();

    mockUseMapGL_ready = false;
    mockUseMapGL_mapGL = undefined;
    render(
      <Map
        accessToken="ACCESS_TOKEN"
        data-testid="MAP_CONTAINER"
        obj={objHandler}
        ref={{} as MutableRefObject<HTMLDivElement>}
      >
        <span>CHILD</span>
      </Map>
    );

    const mapContainer = screen.getByTestId("MAP_CONTAINER");
    expect(mapContainer).toBeInTheDocument();

    expect(screen.queryByText("CHILD")).toBe(null);

    expect(mockUseMapGL).toHaveBeenCalledTimes(1);
    expect(mockUseMapGL).toHaveBeenCalledWith({ accessToken: "ACCESS_TOKEN" });
    expect(objHandler).toHaveBeenCalledTimes(0);
    expect(mockUseMapGL_setMapContainer).toHaveBeenCalledTimes(0);
  });

  test("render becoming ready", () => {
    const objHandler = jest.fn();

    mockUseMapGL_ready = false;
    mockUseMapGL_mapGL = undefined;
    const { rerender } = render(
      <Map
        accessToken="ACCESS_TOKEN"
        data-testid="MAP_CONTAINER"
        obj={objHandler}
        ref={{} as MutableRefObject<HTMLDivElement>}
      >
        <span>CHILD</span>
      </Map>
    );

    const mapContainer = screen.getByTestId("MAP_CONTAINER");
    expect(mapContainer).toBeInTheDocument();

    expect(screen.queryByText("CHILD")).toBe(null);

    expect(mockUseMapGL).toHaveBeenCalledTimes(1);
    expect(mockUseMapGL).toHaveBeenCalledWith({ accessToken: "ACCESS_TOKEN" });
    expect(objHandler).toHaveBeenCalledTimes(0);
    expect(mockUseMapGL_setMapContainer).toHaveBeenCalledTimes(0);

    mockUseMapGL_ready = true;

    rerender(
      <Map
        accessToken="ACCESS_TOKEN"
        data-testid="MAP_CONTAINER"
        obj={objHandler}
        ref={{} as MutableRefObject<HTMLDivElement>}
      >
        <span>CHILD</span>
      </Map>
    );

    expect(objHandler).toHaveBeenCalledTimes(0);
    expect(mockUseMapGL_setMapContainer).toHaveBeenCalledTimes(1);
    expect(mockUseMapGL_setMapContainer).toHaveBeenCalledWith(mapContainer);

    expect(screen.queryByText("CHILD")).toBe(null);
  });

  test("render gets ref", () => {
    const objHandler = jest.fn();

    mockUseMapGL_ready = true;
    mockUseMapGL_mapGL = undefined;
    const { rerender } = render(
      <Map
        accessToken="ACCESS_TOKEN"
        data-testid="MAP_CONTAINER"
        obj={objHandler}
        ref={{} as MutableRefObject<HTMLDivElement>}
      >
        <span>CHILD</span>
      </Map>
    );

    const mapContainer = screen.getByTestId("MAP_CONTAINER");
    expect(mapContainer).toBeInTheDocument();

    expect(screen.queryByText("CHILD")).toBe(null);

    expect(mockUseMapGL).toHaveBeenCalledTimes(1);
    expect(mockUseMapGL).toHaveBeenCalledWith({ accessToken: "ACCESS_TOKEN" });
    expect(objHandler).toHaveBeenCalledTimes(0);
    expect(mockUseMapGL_setMapContainer).toHaveBeenCalledTimes(1);
    expect(mockUseMapGL_setMapContainer).toHaveBeenCalledWith(mapContainer);

    mockUseMapGL_mapGL = "MAPGL";

    rerender(
      <Map
        accessToken="ACCESS_TOKEN"
        data-testid="MAP_CONTAINER"
        obj={objHandler}
        ref={{} as MutableRefObject<HTMLDivElement>}
      >
        <span>CHILD</span>
      </Map>
    );

    // children are only rendered when `mapGL` has a value.
    expect(screen.queryByText("CHILD")).toBeInTheDocument();

    expect(mockUseMapGL).toHaveBeenCalledTimes(2);
    expect(objHandler).toHaveBeenCalledTimes(1);
    expect(objHandler).toHaveBeenLastCalledWith("MAPGL");
    expect(mockUseMapGL_setMapContainer).toHaveBeenCalledTimes(1);
    expect(mockUseMapGL_setMapContainer).toHaveBeenCalledWith(mapContainer);
  });
});
