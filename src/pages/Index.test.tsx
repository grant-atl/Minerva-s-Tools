import { fireEvent, render, screen, within } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import Index from "./Index";

it("filters the tool library by category and search, and recovers from an empty search", () => {
  render(<HelmetProvider><MemoryRouter initialEntries={["/#category-colors"]}><Index /></MemoryRouter></HelmetProvider>);
  const library = screen.getByRole("region", { name: "Tools" });
  expect(within(library).getByRole("link", { name: /Color Palette Generator/ })).toBeInTheDocument();
  expect(within(library).queryByRole("link", { name: /QR Code Generator/ })).not.toBeInTheDocument();
  fireEvent.change(screen.getByRole("searchbox", { name: "Search tools" }), { target: { value: "contrast" } });
  expect(within(library).getByRole("link", { name: /Contrast Checker/ })).toBeInTheDocument();
  expect(within(library).queryByRole("link", { name: /Color Palette Generator/ })).not.toBeInTheDocument();
  fireEvent.change(screen.getByRole("searchbox", { name: "Search tools" }), { target: { value: "no-such-tool" } });
  fireEvent.click(screen.getByRole("link", { name: /Show all tools/ }));
  expect(within(library).getByRole("link", { name: /QR Code Generator/ })).toBeInTheDocument();
  expect(screen.getByRole("searchbox", { name: "Search tools" })).toHaveValue("");
});
