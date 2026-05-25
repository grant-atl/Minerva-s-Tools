import { describe, expect, it } from "vitest";
import {
  computeHeightFromWidth,
  computeWidthFromHeight,
  gcd,
  parsePositiveNumber,
  ratioToDecimal,
  simplifyRatio,
} from "@/lib/aspect-ratio";

describe("aspect-ratio math", () => {
  it("computes gcd for positive integers", () => {
    expect(gcd(1920, 1080)).toBe(120);
    expect(gcd(21, 9)).toBe(3);
  });

  it("parses positive numeric input", () => {
    expect(parsePositiveNumber("1920")).toBe(1920);
    expect(parsePositiveNumber("0")).toBeNull();
    expect(parsePositiveNumber("-4")).toBeNull();
    expect(parsePositiveNumber("abc")).toBeNull();
  });

  it("simplifies common ratios", () => {
    expect(simplifyRatio(1920, 1080)).toEqual({ width: 16, height: 9 });
    expect(simplifyRatio(2048, 1536)).toEqual({ width: 4, height: 3 });
  });

  it("simplifies decimal ratios", () => {
    expect(simplifyRatio(2.4, 1.8)).toEqual({ width: 4, height: 3 });
  });

  it("computes decimal ratio from simplified values", () => {
    const decimal = ratioToDecimal({ width: 16, height: 9 });
    expect(decimal).not.toBeNull();
    expect(decimal).toBeCloseTo(1.7778, 4);
  });

  it("computes missing dimensions from ratio", () => {
    expect(computeHeightFromWidth(1920, { width: 16, height: 9 })).toBe(1080);
    expect(computeWidthFromHeight(1080, { width: 16, height: 9 })).toBe(1920);
  });
});
