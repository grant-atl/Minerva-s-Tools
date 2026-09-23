import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "@/App";

const routeCases: Array<{ path: string; heading: RegExp }> = [
  { path: "/tools/neumorphism", heading: /neumorphism generator/i },
  { path: "/tools/aspect-ratio", heading: /aspect ratio calculator/i },
  { path: "/tools/flexbox", heading: /flexbox generator/i },
  { path: "/tools/grid", heading: /grid generator/i },
  {
    path: "/tools/color-blindness",
    heading: /color blindness simulator/i,
  },
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

  it.each(["/missing/nested-route?source=typed#details", "/98"])("renders a useful 404 for %s", async (path) => {
    window.history.pushState({}, "", path);
    render(<App />);

    expect(
      await screen.findByRole(
        "heading",
        {
          name: /page not found/i,
        },
        { timeout: 5_000 },
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(path),
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
    await waitFor(() => {
      expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute(
        "content",
        "noindex, follow",
      );
    });
    expect(screen.queryByText(/ads keep us free/i)).not.toBeInTheDocument();
  });

  it("uses a local screenshot workflow instead of an unreliable website iframe", async () => {
    window.history.pushState({}, "", "/tools/color-blindness");
    render(<App />);

    await screen.findByRole("heading", {
      name: /color blindness simulator/i,
    });

    expect(
      screen.queryByRole("tab", { name: /^website$/i }),
    ).not.toBeInTheDocument();
    expect(
      document.querySelector('iframe[title="Website preview"]'),
    ).not.toBeInTheDocument();

    const screenshotTab = screen.getByRole("tab", {
      name: /image \/ screenshot/i,
    });
    fireEvent.mouseDown(screenshotTab, { button: 0, ctrlKey: false });
    expect(screen.getByText(/testing a website/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /upload screenshot or image/i }),
    ).toBeInTheDocument();
  });

  it("uses the canonical Minerva's Tools brand in shared UI and metadata", async () => {
    window.history.pushState({}, "", "/tools/color-blindness");
    render(<App />);

    await screen.findByRole("heading", {
      name: /color blindness simulator/i,
    });

    expect(
      screen.getByRole("link", { name: "Minerva's Tools" }),
    ).toHaveAttribute("href", "/");
    expect(document.title).toContain("Minerva's Tools");
    expect(
      screen.getByText(/© \d{4} Minerva's Tools\./i),
    ).toBeInTheDocument();
  });
});
