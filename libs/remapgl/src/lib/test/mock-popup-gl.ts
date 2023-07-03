import type {
  Evented,
  EventedListener,
  LngLatLike,
  PopupOptions
} from "mapbox-gl";
import { Map, Popup as PopupGL } from "mapbox-gl";

export class MockPopupGL implements Partial<PopupGL> {
  constructor(options?: MockPopupGLOptions) {
    // console.log("MockPopupGL: options=", options);

    this.addTo = options?.addTo ?? jest.fn<Partial<PopupGL>, [Map]>(() => this);
    this.on =
      options?.on ??
      jest.fn<Partial<Evented>, [string, EventedListener]>(() => this);
    this.remove = options?.remove ?? jest.fn<Partial<PopupGL>, []>(() => this);
    this.setDOMContent =
      options?.setDOMContent ?? jest.fn<Partial<PopupGL>, [Node]>(() => this);
    options?.setDOMContent ?? jest.fn<Partial<PopupGL>, [Node]>(() => this);
    this.setLngLat =
      options?.setLngLat ?? jest.fn<Partial<PopupGL>, [LngLatLike]>(() => this);
  }

  addTo = null;
  on = null;
  remove = null;
  setDOMContent = null;
  setLngLat = null;
}

interface MockPopupGLOptions extends PopupOptions {
  addTo?: PopupGL["addTo"];
  on?: PopupGL["on"];
  remove?: PopupGL["remove"];
  setDOMContent?: PopupGL["setDOMContent"];
  setLngLat?: PopupGL["setLngLat"];
}
