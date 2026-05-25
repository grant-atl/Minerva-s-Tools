import { describe, expect, it } from "vitest";
import { categories, tools } from "@/lib/tools-data";

const expectedRoutes = [
  "/tools/palette",
  "/tools/qr-code",
  "/tools/gradient",
  "/tools/contrast",
  "/tools/box-shadow",
  "/tools/typography-scale",
  "/tools/favicon",
  "/tools/svg-to-css",
  "/tools/color-blindness",
  "/tools/font-pairing",
  "/tools/spacing",
  "/tools/glassmorphism",
  "/tools/neumorphism",
  "/tools/tailwind-color",
  "/tools/aspect-ratio",
  "/tools/px-rem",
  "/tools/meta-preview",
  "/tools/lorem-ipsum",
  "/tools/flexbox",
  "/tools/grid",
  "/tools/border-radius",
  "/tools/clamp-calculator",
  "/tools/image-color-picker",
  "/tools/image-compressor",
  "/tools/image-format-converter",
  "/tools/image-resizer-cropper",
  "/tools/image-base64",
  "/tools/color-converter",
  "/tools/svg-to-png",
  "/tools/svg-blob-pattern",
  "/tools/svg-optimizer",
  "/tools/svg-to-react",
  "/tools/json-formatter",
  "/tools/code-formatter-minifier",
  "/tools/base64",
  "/tools/url-encode",
  "/tools/uuid",
  "/tools/regex-tester",
  "/tools/jwt-decoder",
  "/tools/hash-generator",
  "/tools/unix-timestamp",
  "/tools/cron-builder",
  "/tools/css-animation-generator",
  "/tools/clip-path-bezier",
  "/tools/text-utilities",
].sort();

describe("tools-data", () => {
  it("lists all expected tool routes", () => {
    const routes = tools.map((tool) => tool.route).sort();

    expect(routes).toEqual(expectedRoutes);
  });

  it("uses valid categories for every tool", () => {
    for (const tool of tools) {
      expect(categories).toContain(tool.category);
      expect(tool.tier).toBe(1);
    }
  });
});
