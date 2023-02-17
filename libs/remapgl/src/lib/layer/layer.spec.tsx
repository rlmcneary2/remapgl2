import { render, screen, waitFor } from "@testing-library/react";
import { Map as MapGL } from "mapbox-gl";
import { useMapGL } from "../context/use-mapgl";
import type { LayerProps } from "./layer";
import { Layer } from "./layer";
import { createMockMapGL } from "../test";

const mockMapGL = createMockMapGL();

jest.mock("../context/use-mapgl", () => {
  const hook: typeof useMapGL = () => ({
    mapGL: mockMapGL,
    ready: true,
    setMapContainer: jest.fn()
  });

  return {
    useMapGL: hook
  };
});

describe("Layer", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (mockMapGL.removeLayer as jest.Mock).mockImplementation(() => mockMapGL);
  });

  it("mounts and unmounts", async () => {
    const handleLayerChanged = jest.fn();
    const addedLayers: string[] = [];
    const { unmount } = render(
      <Layer
        addedLayers={addedLayers}
        id="LAYER_1"
        onLayerChanged={handleLayerChanged}
        type="line"
      />
    );

    await waitFor(() => expect(mockMapGL.addLayer).toHaveBeenCalledTimes(1));

    expect(mockMapGL.addLayer).toHaveBeenLastCalledWith({
      id: "LAYER_1",
      paint: undefined,
      source: undefined,
      type: "line"
    });
    expect(mockMapGL.removeLayer).toHaveBeenCalledTimes(0);
    expect(mockMapGL.removeSource).toHaveBeenCalledTimes(0);
    expect(mockMapGL.moveLayer).toHaveBeenCalledTimes(0);
    expect(handleLayerChanged).toHaveBeenCalledTimes(1);
    expect(handleLayerChanged).toHaveBeenLastCalledWith("LAYER_1", "added");

    unmount();

    expect(mockMapGL.removeLayer).toHaveBeenCalledTimes(1);
    expect(mockMapGL.removeLayer).toHaveBeenLastCalledWith("LAYER_1");
    expect(mockMapGL.removeSource).toHaveBeenCalledTimes(1);
    expect(mockMapGL.removeSource).toHaveBeenLastCalledWith("LAYER_1");
    expect(mockMapGL.moveLayer).toHaveBeenCalledTimes(0);
    expect(handleLayerChanged).toHaveBeenCalledTimes(2);
    expect(handleLayerChanged).toHaveBeenLastCalledWith("LAYER_1", "removed");
  });

  it("reorder the layer", async () => {
    const handleLayerChanged = jest.fn();

    // Initial render of layer, before it has been added to the MapGL.
    let addedLayers: string[] = [];
    const { rerender } = render(
      <Layer
        addedLayers={addedLayers}
        id="LAYER_2"
        onLayerChanged={handleLayerChanged}
        type="line"
      />
    );

    await waitFor(() => expect(mockMapGL.addLayer).toHaveBeenCalledTimes(1));

    expect(mockMapGL.moveLayer).toHaveBeenCalledTimes(0);
    expect(handleLayerChanged).toHaveBeenCalledTimes(1);
    expect(handleLayerChanged).toHaveBeenLastCalledWith("LAYER_2", "added");

    // Render after all layers have been added to the MapGL.
    addedLayers = ["LAYER_1", "LAYER_2"];
    rerender(
      <Layer
        addedLayers={addedLayers}
        id="LAYER_2"
        onLayerChanged={handleLayerChanged}
        type="line"
      />
    );

    expect(mockMapGL.moveLayer).toHaveBeenCalledTimes(0);
    expect(handleLayerChanged).toHaveBeenCalledTimes(1);

    // Render moving LAYER_2 in front of LAYER_1.
    addedLayers = ["LAYER_1", "LAYER_2"];
    rerender(
      <Layer
        addedLayers={addedLayers}
        beforeId="LAYER_1"
        id="LAYER_2"
        onLayerChanged={handleLayerChanged}
        type="line"
      />
    );

    expect(mockMapGL.moveLayer).toHaveBeenCalledTimes(1);
    expect(mockMapGL.moveLayer).toHaveBeenLastCalledWith("LAYER_2", "LAYER_1");
    expect(handleLayerChanged).toHaveBeenCalledTimes(1);
  });

  it("loads a symbol layer image", async () => {
    (mockMapGL.hasImage as jest.Mock).mockReturnValueOnce(false);
    (mockMapGL.hasImage as jest.Mock).mockReturnValueOnce(false);
    (
      mockMapGL.loadImage as jest.Mock<MapGL, Parameters<MapGL["loadImage"]>>
    ).mockImplementationOnce((url, callback) => {
      callback(null, { type: "BITMAP_IMAGE", url } as any);
      return mockMapGL as MapGL;
    });

    const props: LayerProps = {
      addedLayers: [],
      iconImageUrl: "ICON_IMAGE_URL",
      id: "LAYER_1",
      layout: { "icon-image": "ICON_IMAGE_ID" },
      onLayerChanged: jest.fn(),
      type: "symbol"
    };
    render(<Layer {...props} />);

    await waitFor(() => expect(mockMapGL.addLayer).toHaveBeenCalledTimes(1));

    expect(mockMapGL.hasImage).toHaveBeenCalledTimes(2);
    expect(mockMapGL.hasImage).toHaveBeenNthCalledWith(1, "ICON_IMAGE_ID");
    expect(mockMapGL.hasImage).toHaveBeenNthCalledWith(2, "ICON_IMAGE_ID");
    expect(mockMapGL.loadImage).toHaveBeenCalledTimes(1);
    expect(mockMapGL.loadImage).toHaveBeenLastCalledWith(
      "ICON_IMAGE_URL",
      expect.any(Function)
    );
    expect(mockMapGL.addImage).toHaveBeenCalledTimes(1);
    expect(mockMapGL.addImage).toHaveBeenLastCalledWith("ICON_IMAGE_ID", {
      type: "BITMAP_IMAGE",
      url: "ICON_IMAGE_URL"
    });
  });

  it("connects event handlers", async () => {
    const handleLayerChanged = jest.fn();
    const handleOnClick = jest.fn();
    const addedLayers: string[] = [];
    const { unmount } = render(
      <Layer
        addedLayers={addedLayers}
        id="LAYER_1"
        on={{ click: handleOnClick }}
        onLayerChanged={handleLayerChanged}
        type="line"
      />
    );

    await waitFor(() => expect(mockMapGL.addLayer).toHaveBeenCalledTimes(1));

    expect(mockMapGL.on).toHaveBeenCalledTimes(1);
    expect(mockMapGL.on).toHaveBeenLastCalledWith(
      "click",
      "LAYER_1",
      handleOnClick
    );
    expect(mockMapGL.off).toHaveBeenCalledTimes(0);

    unmount();

    expect(mockMapGL.on).toHaveBeenCalledTimes(1);
    expect(mockMapGL.off).toHaveBeenCalledTimes(1);
    expect(mockMapGL.off).toHaveBeenLastCalledWith(
      "click",
      "LAYER_1",
      handleOnClick
    );
  });
});
