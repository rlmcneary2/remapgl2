import React, { useEffect } from "react";
import { render, screen } from "@testing-library/react";
import type { RemapGLGlobal, RemapGLProps } from "./remapgl";
import { RemapGL } from "./remapgl";
import mapboxgl from "mapbox-gl";

jest.mock("./map", () => {
  return {
    Map: {
      $$typeof: Symbol.for("react.forward_ref"),
      render: (props: RemapGLProps, ref: React.ForwardedRef<HTMLDivElement>) =>
        mockMap(props, ref)
    }
  };
});

describe("RemapGL", () => {
  beforeEach(() => {
    mockMap.mockClear();
  });

  test("renders", () => {
    const mockObjHandler = jest.fn();
    const mockRefHandler = jest.fn();

    render(
      <RemapGL accessToken="foo" obj={mockObjHandler} ref={mockRefHandler} />
    );

    expect(screen.getByTestId("MAP")).toBeInTheDocument();
    expect((RemapGL as RemapGLGlobal).defaultMapboxGLCss).toBe(
      "//api.tiles.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.css"
    );
    expect((RemapGL as RemapGLGlobal).defaultMapboxGLStyle).toBe(
      "mapbox://styles/mapbox/outdoors-v11"
    );
    expect(mockMap).toHaveBeenCalledTimes(1);
    expect(mockMap).toHaveBeenCalledWith(
      { accessToken: "foo", children: undefined, obj: mockObjHandler },
      mockRefHandler
    );

    expect(mockObjHandler).toHaveBeenCalledTimes(1);
    expect(mockObjHandler).toHaveBeenCalledWith({});

    expect(mockRefHandler).toHaveBeenCalledTimes(1);
    expect(mockRefHandler).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });
});

const mockMap = jest.fn<
  JSX.Element,
  [RemapGLProps, React.ForwardedRef<HTMLDivElement>]
>(({ obj, ...props }, ref) => {
  useEffect(() => {
    obj && obj({} as mapboxgl.Map);
  }, [obj]);

  return <div data-testid="MAP" ref={ref}></div>;
});
