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
  { path: "/tools/code-formatter-minifier", heading: /code formatter & minifier/i },
  { path: "/tools/text-utilities", heading: /text utilities/i },
];

describe("App routes", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/");
  });

  it.each(routeCases)("renders $path", async ({ path, heading }) => {
    window.history.pushState({}, "", path);
    render(<App />);

    expect(await screen.findByRole("heading", { name: heading })).toBeInTheDocument();
  });
});
