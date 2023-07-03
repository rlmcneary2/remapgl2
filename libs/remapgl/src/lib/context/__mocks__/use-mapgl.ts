const result = {
  mapGL: {},
  ready: true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setMapContainer: jest.fn()
};

export function useMapGL() {
  console.log("MOCK -> useMapGL");
  return result;
}
