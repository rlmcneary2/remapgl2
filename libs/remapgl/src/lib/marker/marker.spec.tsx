import { render, screen, waitFor } from "@testing-library/react";
import { Marker as MarkerGL, Popup as PopupGL } from "mapbox-gl";
import type { MarkerProps } from "./marker";
import { useMarker } from "./use-marker";
import { Marker } from "./marker";
import { MockMarkerGL, MockPopupGL } from "../test";

const mockPopupGLConstructor = jest.fn();
const mockUseMarker = jest.fn<MarkerGL, Parameters<typeof useMarker>>();

jest.mock("mapbox-gl", () => ({
  __esModule: true,
  Popup: jest.fn((...args) => mockPopupGLConstructor(...args))
}));

jest.mock("./use-marker", () => {
  const result: { useMarker: typeof useMarker } = {
    useMarker: (...args) => mockUseMarker(...args)
  };

  return result;
});

describe("Marker", () => {
  let mockMarkerGL: MarkerGL; // Returned by `mockUseMarker`.

  beforeEach(() => {
    jest.clearAllMocks();

    // Can be overridden in a test if you want to see the PopupGL methods that
    // were invoked.
    mockPopupGLConstructor.mockImplementation(opts => new MockPopupGL(opts));

    mockMarkerGL = new MockMarkerGL() as unknown as MarkerGL; // Only create once per test.
    mockUseMarker.mockImplementation((options, element) => {
      return element ? mockMarkerGL : null;
    });
  });

  it("render", async () => {
    const props: React.PropsWithChildren<MarkerProps> = {
      children: "MARKER",
      lnglat: [0, 0],
      obj: jest.fn()
    };

    render(<Marker {...props} />);

    await waitFor(() => {
      expect(props.obj).toHaveBeenCalledTimes(1);
      expect(mockUseMarker).toHaveBeenCalledTimes(2);
    });

    expect(mockUseMarker).toHaveBeenNthCalledWith(
      1,
      { lnglat: props.lnglat },
      null
    );
    expect(mockUseMarker).toHaveBeenLastCalledWith(
      { lnglat: props.lnglat },
      expect.any(Object)
    );
  });

  it("render with a popup", async () => {
    // We need to create our own container for the renderer because we need to
    // attach the element for the marker popup. Attaching is something that mapboxgl
    // would do itself.
    const container = document.createElement("div");
    container.id = "CONTAINER";
    document.body.appendChild(container);

    // We will want to inspect properties of the mock PopupGL later to make sure
    // that Marker did the right things.
    let mockPopupGL: MockPopupGL;

    // Use the mock PopupGL class so that we can pass in an implementation for
    // setDOMContent so that the popup element is attached to the container -
    // something that mapboxgl would do itself.
    mockPopupGLConstructor.mockImplementation(opts => {
      mockPopupGL = new MockPopupGL({
        ...opts,
        setDOMContent: jest.fn(popupElement =>
          // The popupElement is appended as a sibling of the container.
          container.parentElement.appendChild(popupElement)
        ) as any
      });

      return mockPopupGL;
    });

    const props: React.PropsWithChildren<MarkerProps> = {
      children: "MARKER",
      lnglat: [0, 0],
      popup: () => "POPUP",
      popupOptions: { className: "POPUP_CLASS_NAME" }
    };

    render(<Marker {...props} />, { container });

    await waitFor(() => {
      expect(mockPopupGLConstructor).toHaveBeenCalledTimes(1);
    });

    expect(mockPopupGLConstructor).toHaveBeenLastCalledWith({
      className: "POPUP_CLASS_NAME"
    });

    expect(mockPopupGL.setDOMContent).toHaveBeenCalledTimes(1);
    expect(mockPopupGL.setDOMContent).toHaveBeenLastCalledWith(
      expect.any(HTMLDivElement)
    );

    expect(mockMarkerGL.setPopup).toHaveBeenCalledTimes(1);
    expect(mockMarkerGL.setPopup).toHaveBeenLastCalledWith(mockPopupGL);
  });

  it("obj callback function includes the MapboxGL Marker instance", async () => {
    const mockHandleObj = jest.fn();

    const props: React.PropsWithChildren<MarkerProps> = {
      children: "MARKER",
      lnglat: [0, 0],
      obj: mockHandleObj
    };

    render(<Marker {...props} />);

    await waitFor(() => {
      expect(mockHandleObj).toHaveBeenCalledTimes(1);
    });

    expect(mockHandleObj).toHaveBeenLastCalledWith(expect.any(MockMarkerGL));
  });
});
