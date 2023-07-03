import { render, screen } from "@testing-library/react";
import { Popup as PopupGL } from "mapbox-gl";
import { MapPopup } from "./map-popup";
import { MockPopupGL } from "../test";

jest.mock("../context/use-mapgl");

const mockPopupGLConstructor = jest.fn();

jest.mock("mapbox-gl", () => ({
  __esModule: true,
  Popup: jest.fn((...args) => mockPopupGLConstructor(...args))
}));

describe("MapPopup", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Can be overridden in a test if you want to see the PopupGL methods that
    // were invoked.
    mockPopupGLConstructor.mockImplementation(opts => new MockPopupGL(opts));
  });

  it("renders", () => {
    // We need to create our own container for the renderer because we need to
    // attach the element for the marker popup. Attaching is something that mapboxgl
    // would do itself.
    const container = document.createElement("div");
    container.id = "CONTAINER";
    document.body.appendChild(container);

    // We will want to inspect properties of the mock PopupGL later to make sure
    // that Marker did the right things.
    let mockPopupGL: MockPopupGL;

    // Use the MockPopupGL class so that we can pass in an implementation for
    // setDOMContent so that the popup element is attached to the container -
    // something that mapboxgl would do itself.
    mockPopupGLConstructor.mockImplementation(opts => {
      mockPopupGL = new MockPopupGL({
        ...opts,
        setDOMContent: jest.fn<PopupGL, [Node]>(popupElement => {
          // The popupElement is appended as a sibling of the container.
          container.parentElement.appendChild(popupElement);
          return mockPopupGL as PopupGL;
        }),
        setLngLat: jest.fn(() => {
          return mockPopupGL as PopupGL;
        })
      });

      return mockPopupGL;
    });

    render(
      <MapPopup lngLat={[0, 0]}>
        <span>MAP_POPUP</span>
      </MapPopup>,
      { container }
    );

    // screen.debug();

    expect(screen.getByText("MAP_POPUP")).toBeInTheDocument();
    expect(mockPopupGL.setLngLat).toHaveBeenCalledTimes(1000);
  });
});
