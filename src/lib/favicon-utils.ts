/**
 * Render content (image, text, or emoji) onto a canvas at the given size.
 */
export function renderToCanvas(
  size: number,
  options: {
    mode: "image" | "text" | "emoji";
    imageData?: string; // data URL
    text?: string;
    emoji?: string;
    fontFamily?: string;
    textColor?: string;
    bgColor?: string;
    borderRadius?: number; // 0–50
    padding?: number; // 0–30
  }
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const { bgColor = "#4f46e5", borderRadius = 0, padding = 10 } = options;
  const r = (borderRadius / 100) * size;
  const pad = (padding / 100) * size;

  // Clip to rounded rect
  ctx.beginPath();
  roundedRect(ctx, 0, 0, size, size, r);
  ctx.closePath();
  ctx.clip();

  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  return canvas;
}

export function drawContentOnCanvas(
  canvas: HTMLCanvasElement,
  options: {
    mode: "image" | "text" | "emoji";
    imageElement?: HTMLImageElement;
    text?: string;
    emoji?: string;
    fontFamily?: string;
    textColor?: string;
    padding?: number;
  }
) {
  const ctx = canvas.getContext("2d")!;
  const size = canvas.width;
  const pad = ((options.padding ?? 10) / 100) * size;

  if (options.mode === "image" && options.imageElement) {
    const img = options.imageElement;
    const drawSize = size - pad * 2;
    const scale = Math.min(drawSize / img.naturalWidth, drawSize / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
  } else if (options.mode === "text" && options.text) {
    const fontSize = Math.floor((size - pad * 2) * 0.7);
    ctx.font = `bold ${fontSize}px ${options.fontFamily || "sans-serif"}`;
    ctx.fillStyle = options.textColor || "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(options.text, size / 2, size / 2);
  } else if (options.mode === "emoji" && options.emoji) {
    const fontSize = Math.floor((size - pad * 2) * 0.7);
    ctx.font = `${fontSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(options.emoji, size / 2, size / 2 + fontSize * 0.05);
  }
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
}

/**
 * Encode multiple PNG data as a single ICO file (PNG-in-ICO).
 */
export function encodeICO(pngBuffers: ArrayBuffer[]): ArrayBuffer {
  // ICO header: 6 bytes
  // Each entry: 16 bytes
  const headerSize = 6 + pngBuffers.length * 16;
  let totalSize = headerSize;
  for (const buf of pngBuffers) totalSize += buf.byteLength;

  const ico = new ArrayBuffer(totalSize);
  const view = new DataView(ico);

  // Header
  view.setUint16(0, 0, true); // Reserved
  view.setUint16(2, 1, true); // Type: ICO
  view.setUint16(4, pngBuffers.length, true); // Count

  let dataOffset = headerSize;
  pngBuffers.forEach((png, i) => {
    const entryOffset = 6 + i * 16;
    // Read dimensions from PNG header
    const pngView = new DataView(png);
    const width = pngView.getUint32(16, false);
    const height = pngView.getUint32(20, false);

    view.setUint8(entryOffset, width >= 256 ? 0 : width);
    view.setUint8(entryOffset + 1, height >= 256 ? 0 : height);
    view.setUint8(entryOffset + 2, 0); // Color palette
    view.setUint8(entryOffset + 3, 0); // Reserved
    view.setUint16(entryOffset + 4, 1, true); // Color planes
    view.setUint16(entryOffset + 6, 32, true); // Bits per pixel
    view.setUint32(entryOffset + 8, png.byteLength, true); // Size
    view.setUint32(entryOffset + 12, dataOffset, true); // Offset

    new Uint8Array(ico, dataOffset, png.byteLength).set(new Uint8Array(png));
    dataOffset += png.byteLength;
  });

  return ico;
}

export async function canvasToArrayBuffer(canvas: HTMLCanvasElement): Promise<ArrayBuffer> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      blob!.arrayBuffer().then(resolve);
    }, "image/png");
  });
}

export function canvasToDataURL(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL("image/png");
}

export const FAVICON_SIZES = [
  { name: "favicon-16x16.png", size: 16, icoOnly: false },
  { name: "favicon-32x32.png", size: 32, icoOnly: false },
  { name: "favicon-48x48.png", size: 48, icoOnly: true },
  { name: "apple-touch-icon.png", size: 180, icoOnly: false },
  { name: "android-chrome-192x192.png", size: 192, icoOnly: false },
  { name: "android-chrome-512x512.png", size: 512, icoOnly: false },
] as const;

export const MANIFEST_TEMPLATE = {
  name: "",
  short_name: "",
  icons: [
    { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
    { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
  ],
  theme_color: "#ffffff",
  background_color: "#ffffff",
  display: "standalone",
};

export const HTML_SNIPPET = `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="manifest" href="/site.webmanifest">`;
