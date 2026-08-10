import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, UploadSimple } from "@phosphor-icons/react";
import { toast } from "sonner";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolSchema from "@/components/ToolSchema";
import ToolContent from "@/components/ToolContent";
import { imageColorPickerContent } from "@/lib/tool-content-data";
import { rgbToHex } from "@/lib/color-utils";
import { Button } from "@/components/ui/button";

interface SampleColor {
  hex: string;
  rgb: [number, number, number];
}

function quantizeChannel(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value / 24) * 24));
}

function getDominantColors(ctx: CanvasRenderingContext2D, width: number, height: number): SampleColor[] {
  const sampleStep = Math.max(2, Math.round(Math.max(width, height) / 80));
  const { data } = ctx.getImageData(0, 0, width, height);
  const map = new Map<string, number>();

  for (let y = 0; y < height; y += sampleStep) {
    for (let x = 0; x < width; x += sampleStep) {
      const index = (y * width + x) * 4;
      const alpha = data[index + 3];
      if (alpha < 120) continue;

      const r = quantizeChannel(data[index]);
      const g = quantizeChannel(data[index + 1]);
      const b = quantizeChannel(data[index + 2]);
      const key = `${r},${g},${b}`;
      map.set(key, (map.get(key) || 0) + 1);
    }
  }

  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([key]) => {
      const [r, g, b] = key.split(",").map(Number) as [number, number, number];
      return {
        rgb: [r, g, b],
        hex: rgbToHex({ r, g, b }),
      };
    });
}

export default function ImageColorPicker() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [picked, setPicked] = useState<SampleColor | null>(null);
  const [palette, setPalette] = useState<SampleColor[]>([]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  useEffect(() => {
    if (!imageSrc || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const image = new Image();
    image.onload = () => {
      const maxWidth = 860;
      const maxHeight = 460;
      const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
      const drawWidth = Math.max(1, Math.round(image.width * scale));
      const drawHeight = Math.max(1, Math.round(image.height * scale));

      canvas.width = drawWidth;
      canvas.height = drawHeight;
      context.clearRect(0, 0, drawWidth, drawHeight);
      context.drawImage(image, 0, 0, drawWidth, drawHeight);
      setPalette(getDominantColors(context, drawWidth, drawHeight));
      setPicked(null);
    };
    image.src = imageSrc;
  }, [imageSrc]);

  const hasImage = useMemo(() => Boolean(imageSrc), [imageSrc]);

  const onUpload = async (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(String(reader.result));
    reader.readAsDataURL(file);
  };

  const onCanvasPick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((event.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((event.clientY - rect.top) / rect.height) * canvas.height);
    const pixel = context.getImageData(x, y, 1, 1).data;

    const sample: SampleColor = {
      rgb: [pixel[0], pixel[1], pixel[2]],
      hex: rgbToHex({ r: pixel[0], g: pixel[1], b: pixel[2] }),
    };
    setPicked(sample);
  };

  const copyHex = async (hex: string) => {
    await navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    toast.success(`${hex} copied`);
    window.setTimeout(() => setCopiedHex(null), 1400);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Image Color Picker — Extract Palette from Images | Minerva's Tools"
        description="Upload an image, click to sample exact colors, and extract dominant palette swatches instantly."
        canonical="/tools/image-color-picker"
      />
      <ToolSchema
        name="Image Color Picker"
        description="Sample pixel colors and extract dominant palettes from uploaded images."
        url="/tools/image-color-picker"
        faqs={imageColorPickerContent.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 sm:px-6 py-10 lg:py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Image Color Picker</h1>
            <p className="mt-1 text-muted-foreground">Upload an image, click any pixel, and extract a palette in seconds.</p>
          </div>
          <ShareToolButton toolName="Image Color Picker" />
        </div>

        <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted/40">
              <UploadSimple className="size-4" />
              Upload Image
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={(event) => onUpload(event.target.files?.[0] || null)}
              />
            </label>
            {hasImage && (
              <Button size="sm" variant="outline" onClick={() => setImageSrc(null)}>
                Clear
              </Button>
            )}
          </div>

          {!hasImage && (
            <div className="flex min-h-[240px] items-center justify-center rounded-md border border-dashed border-border bg-muted/20 text-sm text-muted-foreground">
              Upload an image to start picking colors.
            </div>
          )}

          {hasImage && (
            <canvas
              ref={canvasRef}
              onClick={onCanvasPick}
              className="w-full cursor-crosshair rounded-md border border-border bg-background"
              aria-label="Image canvas"
            />
          )}

          {picked && (
            <div className="mt-4 rounded-md border border-border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">Picked color</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-10 w-10 rounded-md border border-border" style={{ backgroundColor: picked.hex }} />
                <div>
                  <p className="font-mono text-sm">{picked.hex}</p>
                  <p className="text-xs text-muted-foreground">rgb({picked.rgb.join(", ")})</p>
                </div>
                <Button size="sm" variant="outline" className="ml-auto gap-1" onClick={() => copyHex(picked.hex)}>
                  {copiedHex === picked.hex ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}
                  Copy
                </Button>
              </div>
            </div>
          )}
        </section>

        {palette.length > 0 && (
          <section className="mt-6 rounded-lg border border-border bg-card p-4 sm:p-5">
            <h2 className="mb-3 text-sm font-semibold">Dominant Palette</h2>
            <div className="grid gap-2 sm:grid-cols-4 md:grid-cols-8">
              {palette.map((color) => (
                <button
                  key={color.hex}
                  className="rounded-md border border-border p-2 text-left hover:bg-muted/40"
                  onClick={() => copyHex(color.hex)}
                >
                  <div className="mb-2 h-10 w-full rounded border border-border" style={{ backgroundColor: color.hex }} />
                  <p className="truncate font-mono text-[11px]">{color.hex}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        <ToolContent about={imageColorPickerContent.about} faqs={imageColorPickerContent.faqs} />
      </main>

      <Footer />
    </div>
  );
}
