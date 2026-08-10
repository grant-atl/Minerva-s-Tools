import { useMemo, useState } from "react";
import { Check, Copy, DownloadSimple, UploadSimple } from "@phosphor-icons/react";
import { toast } from "sonner";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolSchema from "@/components/ToolSchema";
import ToolContent from "@/components/ToolContent";
import { imageCompressorContent } from "@/lib/tool-content-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImageStats {
  name: string;
  width: number;
  height: number;
  sizeBytes: number;
}

function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
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

async function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not encode output image"));
          return;
        }
        resolve(blob);
      },
      type,
      quality,
    );
  });
}

export default function ImageCompressor() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState("");
  const [sourceStats, setSourceStats] = useState<ImageStats | null>(null);
  const [quality, setQuality] = useState(0.82);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [outputFormat, setOutputFormat] = useState<"image/jpeg" | "image/webp">("image/webp");
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputPreview, setOutputPreview] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [copied, setCopied] = useState(false);

  const outputStats = useMemo(() => {
    if (!outputBlob) return null;
    return { sizeBytes: outputBlob.size };
  }, [outputBlob]);

  const reductionText = useMemo(() => {
    if (!sourceStats || !outputStats) return "";
    const ratio = 1 - outputStats.sizeBytes / sourceStats.sizeBytes;
    const percent = Math.max(0, ratio * 100);
    return `${percent.toFixed(1)}% smaller`;
  }, [sourceStats, outputStats]);

  const onUpload = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    const preview = await readFileAsDataUrl(file);
    const image = await loadImage(preview);

    setSourceFile(file);
    setSourcePreview(preview);
    setSourceStats({
      name: file.name,
      width: image.naturalWidth,
      height: image.naturalHeight,
      sizeBytes: file.size,
    });
    setOutputBlob(null);
    setOutputPreview("");
  };

  const handleCompress = async () => {
    if (!sourcePreview || !sourceStats) return;

    try {
      setIsWorking(true);

      const image = await loadImage(sourcePreview);
      const scale = Math.min(1, maxWidth / image.naturalWidth);
      const targetWidth = Math.max(1, Math.round(image.naturalWidth * scale));
      const targetHeight = Math.max(1, Math.round(image.naturalHeight * scale));

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is unavailable");

      context.drawImage(image, 0, 0, targetWidth, targetHeight);

      const blob = await canvasToBlob(canvas, outputFormat, quality);
      const preview = URL.createObjectURL(blob);

      if (outputPreview) URL.revokeObjectURL(outputPreview);

      setOutputBlob(blob);
      setOutputPreview(preview);
      toast.success("Compression complete");
    } catch (error) {
      toast.error((error as Error).message || "Compression failed");
    } finally {
      setIsWorking(false);
    }
  };

  const handleDownload = () => {
    if (!outputBlob || !sourceFile) return;
    const extension = outputFormat === "image/jpeg" ? "jpg" : "webp";
    const downloadName = sourceFile.name.replace(/\.[a-zA-Z0-9]+$/, "") + `.compressed.${extension}`;
    const url = URL.createObjectURL(outputBlob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = downloadName;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const copyStats = async () => {
    if (!sourceStats || !outputStats) return;

    const lines = [
      `Original: ${formatBytes(sourceStats.sizeBytes)} (${sourceStats.width}x${sourceStats.height})`,
      `Compressed: ${formatBytes(outputStats.sizeBytes)} (${reductionText})`,
      `Format: ${outputFormat}`,
      `Quality: ${quality.toFixed(2)}`,
    ];

    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    toast.success("Compression summary copied");
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Image Compressor — Reduce JPG/WebP File Size | Minerva's Tools"
        description="Compress images in your browser with quality and max-width controls. Export optimized JPG or WebP files instantly."
        canonical="/tools/image-compressor"
      />
      <ToolSchema
        name="Image Compressor"
        description="Compress images client-side with quality and resize controls."
        url="/tools/image-compressor"
        faqs={imageCompressorContent.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 sm:px-6 py-10 lg:py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Image Compressor</h1>
            <p className="mt-1 text-muted-foreground">Reduce image size without leaving your browser.</p>
          </div>
          <ShareToolButton toolName="Image Compressor" />
        </div>

        <section className="rounded-lg border border-border bg-card p-4 sm:p-5 space-y-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
            <div className="space-y-3">
              <p className="text-sm font-medium">Upload</p>
              <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 px-4 text-center">
                <UploadSimple className="mb-2 size-5" />
                <span className="text-sm">Choose image file</span>
                <span className="text-xs text-muted-foreground">PNG, JPG, WebP, AVIF input</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    void onUpload(event.target.files?.[0] ?? null);
                    event.currentTarget.value = "";
                  }}
                />
              </label>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="output-format">Output format</label>
                <select
                  id="output-format"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={outputFormat}
                  onChange={(event) => setOutputFormat(event.target.value as "image/jpeg" | "image/webp")}
                >
                  <option value="image/webp">WebP</option>
                  <option value="image/jpeg">JPEG</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="quality">Quality: {quality.toFixed(2)}</label>
                <Input
                  id="quality"
                  type="range"
                  min={0.3}
                  max={1}
                  step={0.01}
                  value={quality}
                  onChange={(event) => setQuality(Number(event.target.value))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="max-width">Max width (px)</label>
                <Input
                  id="max-width"
                  type="number"
                  min={100}
                  max={5000}
                  value={maxWidth}
                  onChange={(event) => setMaxWidth(Number(event.target.value) || 1920)}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={() => void handleCompress()} disabled={!sourcePreview || isWorking}>
                  {isWorking ? "Compressing…" : "Compress Image"}
                </Button>
                <Button variant="outline" onClick={handleDownload} disabled={!outputBlob} className="gap-1.5">
                  <DownloadSimple className="size-4" /> Download
                </Button>
                <Button variant="outline" onClick={() => void copyStats()} disabled={!outputBlob} className="gap-1.5">
                  {copied ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />} Copy stats
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium">Original</p>
                <div className="flex min-h-64 items-center justify-center rounded-lg border border-border bg-muted/30 p-3">
                  {sourcePreview ? <img src={sourcePreview} alt="Original upload" className="max-h-60 w-auto rounded" /> : <p className="text-sm text-muted-foreground">Upload an image to begin</p>}
                </div>
                {sourceStats && (
                  <p className="text-xs text-muted-foreground">
                    {sourceStats.name} • {sourceStats.width}×{sourceStats.height} • {formatBytes(sourceStats.sizeBytes)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Compressed</p>
                <div className="flex min-h-64 items-center justify-center rounded-lg border border-border bg-muted/30 p-3">
                  {outputPreview ? <img src={outputPreview} alt="Compressed output" className="max-h-60 w-auto rounded" /> : <p className="text-sm text-muted-foreground">Compressed preview appears here</p>}
                </div>
                {outputStats && (
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(outputStats.sizeBytes)} • {reductionText}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <ToolContent about={imageCompressorContent.about} faqs={imageCompressorContent.faqs} />
      </main>

      <Footer />
    </div>
  );
}
