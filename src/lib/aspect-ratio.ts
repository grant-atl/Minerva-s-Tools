export interface Ratio {
  width: number;
  height: number;
}

function countDecimals(value: number) {
  const text = value.toString();
  if (text.includes("e-")) {
    const [, exp] = text.split("e-");
    return Number.parseInt(exp, 10) || 0;
  }
  const parts = text.split(".");
  return parts[1]?.length ?? 0;
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));

  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }

  return x === 0 ? 1 : x;
}

export function parsePositiveNumber(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}

export function simplifyRatio(width: number, height: number): Ratio {
  const safeWidth = Math.max(width, 0);
  const safeHeight = Math.max(height, 0);

  if (safeWidth === 0 || safeHeight === 0) {
    return { width: 0, height: 0 };
  }

  const precision = Math.min(6, Math.max(countDecimals(safeWidth), countDecimals(safeHeight)));
  const scale = 10 ** precision;
  const widthInt = Math.round(safeWidth * scale);
  const heightInt = Math.round(safeHeight * scale);
  const divisor = gcd(widthInt, heightInt);

  return {
    width: widthInt / divisor,
    height: heightInt / divisor,
  };
}

export function ratioToDecimal(ratio: Ratio): number | null {
  if (ratio.width <= 0 || ratio.height <= 0) return null;
  return ratio.width / ratio.height;
}

export function decimalToRatio(decimal: number): Ratio | null {
  if (!Number.isFinite(decimal) || decimal <= 0) return null;
  return simplifyRatio(decimal, 1);
}

export function computeHeightFromWidth(width: number, ratio: Ratio): number | null {
  if (width <= 0 || ratio.width <= 0 || ratio.height <= 0) return null;
  return (width * ratio.height) / ratio.width;
}

export function computeWidthFromHeight(height: number, ratio: Ratio): number | null {
  if (height <= 0 || ratio.width <= 0 || ratio.height <= 0) return null;
  return (height * ratio.width) / ratio.height;
}
