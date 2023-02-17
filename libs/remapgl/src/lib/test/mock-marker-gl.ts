import { Marker as MarkerGL } from "mapbox-gl";

export class MockMarkerGL implements Partial<MarkerGL> {
  setPopup = jest.fn();
}
