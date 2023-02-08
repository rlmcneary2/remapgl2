import { useEffect } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import type { LayerCollectionProps } from "./layer-collection";
import { LayerCollection } from "./layer-collection";
import type { LayerProps } from "../layer/layer";

let mockHandleLayerChanged: jest.Mock | null = null;
jest.mock("../layer/layer", () => ({
  Layer: ({ onLayerChanged: propsOnLayerChanged, ...props }: LayerProps) => (
    <MockLayer
      {...props}
      onLayerChanged={(...args) => {
        mockHandleLayerChanged =
          mockHandleLayerChanged ??
          jest.fn((id, status) => propsOnLayerChanged(id, status));

        mockHandleLayerChanged(...args);
      }}
    />
  )
}));

describe("LayerCollection", () => {
  beforeEach(() => {
    mockHandleLayerChanged = null;
  });

  it("render a single layer", async () => {
    const layers: LayerCollectionProps["layers"] = [{ id: "1", type: "line" }];
    render(<LayerCollection layers={layers} />);

    await waitFor(() => {
      expect(screen.getByText("LAYER_1")).toBeInTheDocument();
    });

    expect(mockHandleLayerChanged).toHaveBeenCalledTimes(1);
    expect(mockHandleLayerChanged).toHaveBeenLastCalledWith("1", "added");

    const layer1 = screen.getByText("LAYER_1");
    expect(layer1.attributes.getNamedItem("data-beforeid").value).toBe("~");
    expect(layer1.attributes.getNamedItem("data-addedlayers").value).toBe(
      `["1"]`
    );
  });

  it("render 3 layers", async () => {
    const layers: LayerCollectionProps["layers"] = [
      { id: "1", type: "line" },
      { id: "2", type: "line" },
      { id: "3", type: "line" }
    ];
    render(<LayerCollection layers={layers} />);

    await waitFor(() => {
      expect(screen.getByText("LAYER_1")).toBeInTheDocument();
      expect(screen.getByText("LAYER_2")).toBeInTheDocument();
    });

    expect(mockHandleLayerChanged).toHaveBeenCalledTimes(3);
    expect(mockHandleLayerChanged).toHaveBeenNthCalledWith(1, "1", "added");
    expect(mockHandleLayerChanged).toHaveBeenNthCalledWith(2, "2", "added");
    expect(mockHandleLayerChanged).toHaveBeenLastCalledWith("3", "added");

    const layer1 = screen.getByText("LAYER_1");
    const layer2 = screen.getByText("LAYER_2");
    const layer3 = screen.getByText("LAYER_3");

    expect(layer1.nextElementSibling).toBe(layer2);
    expect(layer1.attributes.getNamedItem("data-beforeid").value).toBe("2");
    expect(layer1.attributes.getNamedItem("data-addedlayers").value).toBe(
      `["1","2","3"]`
    );
    expect(layer2.nextElementSibling).toBe(layer3);
    expect(layer2.attributes.getNamedItem("data-beforeid").value).toBe("3");
    expect(layer2.attributes.getNamedItem("data-addedlayers").value).toBe(
      `["1","2","3"]`
    );
    expect(layer3.nextElementSibling).toBe(null);
    expect(layer3.attributes.getNamedItem("data-beforeid").value).toBe("~");
    expect(layer3.attributes.getNamedItem("data-addedlayers").value).toBe(
      `["1","2","3"]`
    );
  });

  it("remove the last of three layers", async () => {
    const layers: LayerCollectionProps["layers"] = [
      { id: "1", type: "line" },
      { id: "2", type: "line" },
      { id: "3", type: "line" }
    ];
    const { rerender } = render(<LayerCollection layers={layers} />);

    await waitFor(() => {
      expect(screen.getByText("LAYER_1")).toBeInTheDocument();
      expect(screen.getByText("LAYER_2")).toBeInTheDocument();
      expect(screen.getByText("LAYER_3")).toBeInTheDocument();
    });

    expect(mockHandleLayerChanged).toHaveBeenCalledTimes(3);

    const [firstLayer, secondLayer] = layers;
    rerender(<LayerCollection layers={[firstLayer, secondLayer]} />);

    await waitFor(() => {
      expect(screen.queryByText("LAYER_3")).toBeNull();
    });

    expect(mockHandleLayerChanged).toHaveBeenCalledTimes(4);
    expect(mockHandleLayerChanged).toHaveBeenLastCalledWith("3", "removed");

    const layer1 = screen.getByText("LAYER_1");
    const layer2 = screen.getByText("LAYER_2");

    expect(layer1.nextElementSibling).toBe(layer2);
    expect(layer1.attributes.getNamedItem("data-beforeid").value).toBe("2");
    expect(layer1.attributes.getNamedItem("data-addedlayers").value).toBe(
      `["1","2"]`
    );
    expect(layer2.nextElementSibling).toBe(null);
    expect(layer2.attributes.getNamedItem("data-beforeid").value).toBe("~");
    expect(layer2.attributes.getNamedItem("data-addedlayers").value).toBe(
      `["1","2"]`
    );
  });

  it("remove the first of three layers", async () => {
    const layers: LayerCollectionProps["layers"] = [
      { id: "1", type: "line" },
      { id: "2", type: "line" },
      { id: "3", type: "line" }
    ];
    const { rerender } = render(<LayerCollection layers={layers} />);

    await waitFor(() => {
      expect(screen.getByText("LAYER_1")).toBeInTheDocument();
      expect(screen.getByText("LAYER_2")).toBeInTheDocument();
      expect(screen.getByText("LAYER_3")).toBeInTheDocument();
    });

    expect(mockHandleLayerChanged).toHaveBeenCalledTimes(3);

    const [, secondLayer, thirdLayer] = layers;
    rerender(<LayerCollection layers={[secondLayer, thirdLayer]} />);

    await waitFor(() => {
      expect(screen.queryByText("LAYER_!")).toBeNull();
    });

    expect(mockHandleLayerChanged).toHaveBeenCalledTimes(4);
    expect(mockHandleLayerChanged).toHaveBeenLastCalledWith("1", "removed");

    const layer2 = screen.getByText("LAYER_2");
    const layer3 = screen.getByText("LAYER_3");

    expect(layer2.nextElementSibling).toBe(layer3);
    expect(layer2.attributes.getNamedItem("data-beforeid").value).toBe("3");
    expect(layer2.attributes.getNamedItem("data-addedlayers").value).toBe(
      `["2","3"]`
    );
    expect(layer3.nextElementSibling).toBe(null);
    expect(layer3.attributes.getNamedItem("data-beforeid").value).toBe("~");
    expect(layer3.attributes.getNamedItem("data-addedlayers").value).toBe(
      `["2","3"]`
    );
  });

  it("remove the second of three layers", async () => {
    const layers: LayerCollectionProps["layers"] = [
      { id: "1", type: "line" },
      { id: "2", type: "line" },
      { id: "3", type: "line" }
    ];
    const { rerender } = render(<LayerCollection layers={layers} />);

    await waitFor(() => {
      expect(screen.getByText("LAYER_1")).toBeInTheDocument();
      expect(screen.getByText("LAYER_2")).toBeInTheDocument();
      expect(screen.getByText("LAYER_3")).toBeInTheDocument();
    });

    expect(mockHandleLayerChanged).toHaveBeenCalledTimes(3);

    const [firstLayer, , thirdLayer] = layers;
    rerender(<LayerCollection layers={[firstLayer, thirdLayer]} />);

    await waitFor(() => {
      expect(screen.queryByText("LAYER_2")).toBeNull();
    });

    expect(mockHandleLayerChanged).toHaveBeenCalledTimes(4);
    expect(mockHandleLayerChanged).toHaveBeenLastCalledWith("2", "removed");

    const layer1 = screen.getByText("LAYER_1");
    const layer3 = screen.getByText("LAYER_3");

    expect(layer1.nextElementSibling).toBe(layer3);
    expect(layer1.attributes.getNamedItem("data-beforeid").value).toBe("3");
    expect(layer1.attributes.getNamedItem("data-addedlayers").value).toBe(
      `["1","3"]`
    );
    expect(layer3.nextElementSibling).toBe(null);
    expect(layer3.attributes.getNamedItem("data-beforeid").value).toBe("~");
    expect(layer3.attributes.getNamedItem("data-addedlayers").value).toBe(
      `["1","3"]`
    );
  });
});

function MockLayer({ addedLayers, beforeId, id, onLayerChanged }: LayerProps) {
  useEffect(() => {
    onLayerChanged(id, "added");
    return () => onLayerChanged(id, "removed");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const content = addedLayers.length ? `LAYER_${id}` : "";

  return (
    <div
      data-addedlayers={JSON.stringify(addedLayers)}
      data-beforeid={beforeId ?? "~"}
      data-id={id}
    >
      {content}
    </div>
  );
}
