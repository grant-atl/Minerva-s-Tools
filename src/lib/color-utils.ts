// ── Types ──────────────────────────────────────────────────
export interface RGB { r: number; g: number; b: number }
export interface HSL { h: number; s: number; l: number }

export type HarmonyMode =
  | "random"
  | "analogous"
  | "complementary"
  | "triadic"
  | "split-complementary"
  | "monochromatic";

export interface PaletteColor {
  hex: string;
  rgb: RGB;
  hsl: HSL;
  locked: boolean;
}

// ── Conversions ────────────────────────────────────────────
export function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  return (
    "#" +
    [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")
  );
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255,
    gn = g / 255,
    bn = b / 255;
  const max = Math.max(rn, gn, bn),
    min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const sn = s / 100,
    ln = l / 100;
  if (sn === 0) {
    const v = Math.round(ln * 255);
    return { r: v, g: v, b: v };
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;
  const hn = h / 360;
  return {
    r: Math.round(hue2rgb(p, q, hn + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hn) * 255),
    b: Math.round(hue2rgb(p, q, hn - 1 / 3) * 255),
  };
}

export function hslToHex(hsl: HSL): string {
  return rgbToHex(hslToRgb(hsl));
}

// ── Formatting ─────────────────────────────────────────────
export function formatRgb({ r, g, b }: RGB): string {
  return `rgb(${r}, ${g}, ${b})`;
}

export function formatHsl({ h, s, l }: HSL): string {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

// ── WCAG Contrast ──────────────────────────────────────────
export function relativeLuminance({ r, g, b }: RGB): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const srgb = c / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function contrastRatio(c1: RGB, c2: RGB): number {
  const l1 = relativeLuminance(c1);
  const l2 = relativeLuminance(c2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function wcagLevel(ratio: number): { aa: boolean; aaLarge: boolean; aaa: boolean; aaaLarge: boolean } {
  return {
    aa: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaa: ratio >= 7,
    aaaLarge: ratio >= 4.5,
  };
}

// ── Palette Generation ─────────────────────────────────────
function randRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function normalizeHue(h: number): number {
  return ((h % 360) + 360) % 360;
}

function generateFromHues(hues: number[]): HSL[] {
  return hues.map((h, i) => ({
    h: normalizeHue(h),
    s: randRange(50, 85),
    l: 25 + Math.round((i / (hues.length - 1)) * 55), // spread lightness 25-80
  }));
}

export function generatePalette(mode: HarmonyMode, count: number = 5): PaletteColor[] {
  const baseHue = randRange(0, 359);
  let hslColors: HSL[];

  switch (mode) {
    case "analogous": {
      const step = 30;
      hslColors = generateFromHues(
        Array.from({ length: count }, (_, i) => baseHue + (i - Math.floor(count / 2)) * step)
      );
      break;
    }
    case "complementary": {
      const comp = baseHue + 180;
      hslColors = generateFromHues([baseHue, baseHue, comp, comp, baseHue]);
      // vary lightness more distinctly
      hslColors[0].l = randRange(25, 35);
      hslColors[1].l = randRange(45, 55);
      hslColors[2].l = randRange(35, 50);
      hslColors[3].l = randRange(60, 75);
      hslColors[4].l = randRange(80, 90);
      break;
    }
    case "triadic": {
      const h2 = baseHue + 120, h3 = baseHue + 240;
      hslColors = generateFromHues([baseHue, h2, h3, baseHue, h2]);
      hslColors[3].l = randRange(70, 85);
      hslColors[4].l = randRange(25, 40);
      break;
    }
    case "split-complementary": {
      const h2 = baseHue + 150, h3 = baseHue + 210;
      hslColors = generateFromHues([baseHue, h2, h3, baseHue, h2]);
      hslColors[3].l = randRange(70, 85);
      hslColors[4].l = randRange(25, 40);
      break;
    }
    case "monochromatic": {
      hslColors = Array.from({ length: count }, (_, i) => ({
        h: baseHue,
        s: randRange(40, 80),
        l: 15 + Math.round((i / (count - 1)) * 70),
      }));
      break;
    }
    case "random":
    default: {
      hslColors = Array.from({ length: count }, () => ({
        h: randRange(0, 359),
        s: randRange(45, 90),
        l: randRange(30, 80),
      }));
      break;
    }
  }

  return hslColors.map((hsl) => {
    const rgb = hslToRgb(hsl);
    return { hex: rgbToHex(rgb), rgb, hsl, locked: false };
  });
}

// ── Text contrast helper ───────────────────────────────────
export function textColorForBg(bgHex: string): string {
  const rgb = hexToRgb(bgHex);
  return relativeLuminance(rgb) > 0.179 ? "#000000" : "#ffffff";
}
