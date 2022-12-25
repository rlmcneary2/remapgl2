import { render, screen } from "@testing-library/react";
import { RemapGL } from "./remapgl";

jest.mock("./map");

describe("RemapGL", () => {
  console.log(window.URL);
  test("renders", () => {
    render(<RemapGL accessToken="foo" />);
    expect(screen.getAllByText("foo")).toBeInTheDocument();
  });
});
