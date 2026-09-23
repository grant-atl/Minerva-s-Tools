import { useMemo, useState } from "react";
import { DownloadSimple, UploadSimple } from "@phosphor-icons/react";
import { toast } from "sonner";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolSchema from "@/components/ToolSchema";
import ToolContent from "@/components/ToolContent";
import { imageResizerCropperContent } from "@/lib/tool-content-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PicaFactory = (options?: {
  features?: Array<"js" | "wasm" | "ww" | "cib">;
}) => {
  resize: (
    from: HTMLCanvasElement,
    to: HTMLCanvasElement,
    options?: {
      alpha?: boolean;
      unsharpAmount?: number;
      unsharpRadius?: number;
      unsharpThreshold?: number;
    },
  ) => Promise<HTMLCanvasElement>;
};

let picaCache: Promise<ReturnType<PicaFactory>> | null = null;

async function loadPica() {
  if (!picaCache) {
    picaCache = import("pica").then((mod) => {
      const picaFactory = ((mod as { default?: unknown }).default ?? mod) as PicaFactory;
      return picaFactory({ features: ["js", "wasm", "ww"] });
    });
  }
  return picaCache;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load image"));
    image.src = src;
  });
}

async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Could not export resized image"));
        return;
      }
      resolve(blob);
    }, "image/png", 1);
  });
}

const aspectOptions = [
  { label: "Free", value: "free" },
  { label: "1:1", value: "1:1" },
  { label: "16:9", value: "16:9" },
  { label: "4:5", value: "4:5" },
  { label: "3:2", value: "3:2" },
] as const;

type AspectMode = (typeof aspectOptions)[number]["value"];

function parseAspect(mode: AspectMode): number | null {
  if (mode === "free") return null;
  const [w, h] = mode.split(":").map(Number);
  if (!w || !h) return null;
  return w / h;
}

export default function ImageResizerCropper() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState("");
  const [outputPreview, setOutputPreview] = useState("");
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [targetWidth, setTargetWidth] = useState(1200);
  const [targetHeight, setTargetHeight] = useState(800);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [aspectMode, setAspectMode] = useState<AspectMode>("free");
  const [sourceRatio, setSourceRatio] = useState(1);
  const [isWorking, setIsWorking] = useState(false);

  const displayRatio = useMemo(() => {
    const ratio = parseAspect(aspectMode);
    if (!ratio) return "Custom";
    return aspectMode;
  }, [aspectMode]);

  const handleUpload = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    const preview = await readFileAsDataUrl(file);
    const image = await loadImage(preview);

    setSourceFile(file);
    setSourcePreview(preview);
    setSourceRatio(image.naturalWidth / image.naturalHeight);
    setTargetWidth(image.naturalWidth);
    setTargetHeight(image.naturalHeight);
    setOutputBlob(null);
    setOutputPreview("");
  };

  const updateWidth = (value: number) => {
    const safe = Math.max(1, value || 1);
    setTargetWidth(safe);
    if (maintainAspect) {
      setTargetHeight(Math.max(1, Math.round(safe / sourceRatio)));
    }
  };

  const updateHeight = (value: number) => {
    const safe = Math.max(1, value || 1);
    setTargetHeight(safe);
    if (maintainAspect) {
      setTargetWidth(Math.max(1, Math.round(safe * sourceRatio)));
    }
  };

  const handleProcess = async () => {
    if (!sourcePreview) return;

    try {
      setIsWorking(true);
      const image = await loadImage(sourcePreview);
      const sourceCanvas = document.createElement("canvas");
      const sourceContext = sourceCanvas.getContext("2d");
      if (!sourceContext) throw new Error("Canvas is unavailable");

      const outputCanvas = document.createElement("canvas");
      outputCanvas.width = Math.max(1, targetWidth);
      outputCanvas.height = Math.max(1, targetHeight);

      const requestedAspect = parseAspect(aspectMode);

      if (!requestedAspect) {
        sourceCanvas.width = image.naturalWidth;
        sourceCanvas.height = image.naturalHeight;
        sourceContext.drawImage(image, 0, 0, sourceCanvas.width, sourceCanvas.height);
      } else {
        const sourceAspect = image.naturalWidth / image.naturalHeight;
        let sx = 0;
        let sy = 0;
        let sw = image.naturalWidth;
        let sh = image.naturalHeight;

        if (sourceAspect > requestedAspect) {
          sw = Math.round(image.naturalHeight * requestedAspect);
          sx = Math.round((image.naturalWidth - sw) / 2);
        } else if (sourceAspect < requestedAspect) {
          sh = Math.round(image.naturalWidth / requestedAspect);
          sy = Math.round((image.naturalHeight - sh) / 2);
        }

        sourceCanvas.width = sw;
        sourceCanvas.height = sh;
        sourceContext.drawImage(image, sx, sy, sw, sh, 0, 0, sw, sh);
      }

      const pica = await loadPica();
      await pica.resize(sourceCanvas, outputCanvas, {
        alpha: true,
        unsharpAmount: 120,
        unsharpRadius: 0.6,
        unsharpThreshold: 2,
      });

      const blob = await canvasToBlob(outputCanvas);
      const preview = URL.createObjectURL(blob);

      if (outputPreview) URL.revokeObjectURL(outputPreview);

      setOutputBlob(blob);
      setOutputPreview(preview);
      toast.success("Resize/crop complete");
    } catch (error) {
      toast.error((error as Error).message || "Failed to process image");
    } finally {
      setIsWorking(false);
    }
  };

  const handleDownload = () => {
    if (!outputBlob || !sourceFile) return;
    const name = sourceFile.name.replace(/\.[a-zA-Z0-9]+$/, "") + `.resized.png`;
    const url = URL.createObjectURL(outputBlob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = name;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Image Resizer & Cropper — Resize and Center Crop | Minerva's Tools"
        description="Resize images to specified dimensions and apply centered crops using aspect-ratio presets."
        canonical="/tools/image-resizer-cropper"
      />
      <ToolSchema
        name="Image Resizer & Cropper"
        description="Resize images and apply aspect-ratio center crops without uploading files."
        url="/tools/image-resizer-cropper"
        faqs={imageResizerCropperContent.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 sm:px-6 py-10 lg:py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Image Resizer & Cropper</h1>
            <p className="mt-1 text-muted-foreground">Resize dimensions and apply center-crop ratio presets.</p>
          </div>
          <ShareToolButton toolName="Image Resizer & Cropper" />
        </div>

        <section className="rounded-lg border border-border bg-card p-4 sm:p-5 space-y-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
            <div className="space-y-3">
              <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 px-4 text-center">
                <UploadSimple className="mb-2 size-5" />
                <span className="text-sm">Upload image</span>
                <span className="text-xs text-muted-foreground">PNG/JPG/WebP/AVIF supported</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    void handleUpload(event.target.files?.[0] ?? null);
                    event.currentTarget.value = "";
                  }}
                />
              </label>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="target-width" className="text-sm font-medium">Width</label>
                  <Input id="target-width" type="number" min={1} value={targetWidth} onChange={(event) => updateWidth(Number(event.target.value))} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="target-height" className="text-sm font-medium">Height</label>
                  <Input id="target-height" type="number" min={1} value={targetHeight} onChange={(event) => updateHeight(Number(event.target.value))} />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={maintainAspect} onChange={(event) => setMaintainAspect(event.target.checked)} />
                Maintain original ratio while typing
              </label>

              <div className="space-y-2">
                <label htmlFor="crop-aspect" className="text-sm font-medium">Crop aspect</label>
                <select
                  id="crop-aspect"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={aspectMode}
                  onChange={(event) => setAspectMode(event.target.value as AspectMode)}
                >
                  {aspectOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={() => void handleProcess()} disabled={!sourcePreview || isWorking}>
                  {isWorking ? "Processing…" : "Resize/Crop"}
                </Button>
                <Button variant="outline" onClick={handleDownload} disabled={!outputBlob} className="gap-1.5">
                  <DownloadSimple className="size-4" /> Download PNG
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">Current crop mode: {displayRatio}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium">Original</p>
                <div className="flex min-h-64 items-center justify-center rounded-lg border border-border bg-muted/30 p-3">
                  {sourcePreview ? <img src={sourcePreview} alt="Original" className="max-h-60 w-auto rounded" /> : <p className="text-sm text-muted-foreground">Upload an image to begin</p>}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Processed</p>
                <div className="flex min-h-64 items-center justify-center rounded-lg border border-border bg-muted/30 p-3">
                  {outputPreview ? <img src={outputPreview} alt="Processed" className="max-h-60 w-auto rounded" /> : <p className="text-sm text-muted-foreground">Processed output appears here</p>}
                </div>
                {outputBlob && <p className="text-xs text-muted-foreground">Output: {targetWidth}×{targetHeight} PNG</p>}
              </div>
            </div>
          </div>
        </section>

        <ToolContent about={imageResizerCropperContent.about} faqs={imageResizerCropperContent.faqs} />
      </main>

      <Footer />
    </div>
  );
}
