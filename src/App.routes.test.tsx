import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "@/App";

const routeCases: Array<{ path: string; heading: RegExp }> = [
  { path: "/tools/neumorphism", heading: /neumorphism generator/i },
  { path: "/tools/aspect-ratio", heading: /aspect ratio calculator/i },
  { path: "/tools/flexbox", heading: /flexbox generator/i },
  { path: "/tools/grid", heading: /grid generator/i },
  { path: "/tools/image-color-picker", heading: /image color picker/i },
  { path: "/tools/json-formatter", heading: /json formatter/i },
  { path: "/tools/base64", heading: /base64 encoder\/decoder/i },
  { path: "/tools/uuid", heading: /uuid generator/i },
  { path: "/tools/regex-tester", heading: /regex tester & replacer/i },
  { path: "/tools/jwt-decoder", heading: /jwt decoder & inspector/i },
  { path: "/tools/hash-generator", heading: /hash generator/i },
  { path: "/tools/unix-timestamp", heading: /unix timestamp converter/i },
  { path: "/tools/cron-builder", heading: /cron expression builder/i },
  { path: "/tools/image-compressor", heading: /image compressor/i },
  { path: "/tools/svg-optimizer", heading: /svg optimizer/i },
  {
    path: "/tools/code-formatter-minifier",
    heading: /code formatter & minifier/i,
  },
  { path: "/tools/text-utilities", heading: /text utilities/i },
];

describe("App routes", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/");
  });

  it.each(routeCases)("renders $path", async ({ path, heading }) => {
    window.history.pushState({}, "", path);
    render(<App />);

    expect(
      await screen.findByRole("heading", { name: heading }, { timeout: 5_000 }),
    ).toBeInTheDocument();
  });

  it("renders a useful 404 for an unknown nested URL", async () => {
    window.history.pushState(
      {},
      "",
      "/missing/nested-route?source=typed#details",
    );
    render(<App />);

    expect(
      await screen.findByRole(
        "heading",
        {
          name: /this route wandered off the map/i,
        },
        { timeout: 5_000 },
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("/missing/nested-route?source=typed#details"),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /go home/i })).toHaveAttribute(
      "href",
      "/",
    );
    expect(
      screen.getByRole("link", { name: /browse all tools/i }),
    ).toHaveAttribute("href", "/#tools");
    expect(screen.getByRole("link", { name: "Colors" })).toHaveAttribute(
      "href",
      "/#category-colors",
    );
    expect(
      screen.getByRole("link", { name: /format and validate json/i }),
    ).toHaveAttribute("href", "/tools/json-formatter");
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, follow",
    );
    expect(screen.queryByText(/ads keep us free/i)).not.toBeInTheDocument();
  });
});
