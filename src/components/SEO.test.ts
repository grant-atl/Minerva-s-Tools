import { describe, expect, it } from "vitest";
import { resolveCanonicalUrl } from "@/lib/seo";

describe("resolveCanonicalUrl", () => {
  it("returns base URL when canonical is not provided", () => {
    expect(resolveCanonicalUrl()).toBe("https://www.minerva.tools");
  });

  it("resolves leading-slash canonical paths", () => {
    expect(resolveCanonicalUrl("/tools/neumorphism")).toBe("https://www.minerva.tools/tools/neumorphism");
  });

  it("resolves canonical paths without a leading slash", () => {
    expect(resolveCanonicalUrl("tools/neumorphism")).toBe("https://www.minerva.tools/tools/neumorphism");
  });

  it("passes through absolute canonical URLs unchanged", () => {
    expect(resolveCanonicalUrl("https://www.minerva.tools/tools/font-pairing")).toBe(
      "https://www.minerva.tools/tools/font-pairing",
    );
  });
});
