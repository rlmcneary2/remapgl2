import type { PopupOptions } from "mapbox-gl";
import { Popup as PopupGL } from "mapbox-gl";

export class MockPopupGL implements Partial<PopupGL> {
  constructor(options?: Options) {
    this.setDOMContent = options?.setDOMContent ?? (jest.fn() as any);
  }

  setDOMContent = null;
}

interface Options extends PopupOptions {
  setDOMContent?: PopupGL["setDOMContent"];
}
