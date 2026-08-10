import { useMemo, useState } from "react";
import { DownloadSimple, UploadSimple } from "@phosphor-icons/react";
import { toast } from "sonner";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolSchema from "@/components/ToolSchema";
import ToolContent from "@/components/ToolContent";
import { imageFormatConverterContent } from "@/lib/tool-content-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
          reject(new Error("Failed to convert image"));
          return;
        }
        resolve(blob);
      },
      type,
      quality,
    );
  });
}

function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

const formatOptions = [
  { label: "PNG", value: "image/png", extension: "png" },
  { label: "JPEG", value: "image/jpeg", extension: "jpg" },
  { label: "WebP", value: "image/webp", extension: "webp" },
] as const;

type OutputFormat = (typeof formatOptions)[number]["value"];

export default function ImageFormatConverter() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState("");
  const [sourceSize, setSourceSize] = useState(0);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("image/png");
  const [quality, setQuality] = useState(0.9);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputPreview, setOutputPreview] = useState("");
  const [isWorking, setIsWorking] = useState(false);

  const outputExtension = useMemo(
    () => formatOptions.find((option) => option.value === outputFormat)?.extension ?? "png",
    [outputFormat],
  );

  const handleUpload = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }

    const preview = await readFileAsDataUrl(file);
    setSourceFile(file);
    setSourcePreview(preview);
    setSourceSize(file.size);
    setOutputBlob(null);
    setOutputPreview("");
  };

  const handleConvert = async () => {
    if (!sourcePreview) return;

    try {
      setIsWorking(true);
      const image = await loadImage(sourcePreview);
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is unavailable");

      if (outputFormat === "image/jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }

      context.drawImage(image, 0, 0);

      const blob = await canvasToBlob(canvas, outputFormat, quality);
      const preview = URL.createObjectURL(blob);

      if (outputPreview) URL.revokeObjectURL(outputPreview);

      setOutputBlob(blob);
      setOutputPreview(preview);
      toast.success("Image converted");
    } catch (error) {
      toast.error((error as Error).message || "Conversion failed");
    } finally {
      setIsWorking(false);
    }
  };

  const handleDownload = () => {
    if (!outputBlob || !sourceFile) return;
    const name = sourceFile.name.replace(/\.[a-zA-Z0-9]+$/, "") + `.converted.${outputExtension}`;
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
        title="Image Format Converter — PNG, JPEG, WebP | Minerva's Tools"
        description="Convert image files between PNG, JPEG, and WebP in your browser."
        canonical="/tools/image-format-converter"
      />
      <ToolSchema
        name="Image Format Converter"
        description="Convert image files between common web formats entirely client-side."
        url="/tools/image-format-converter"
        faqs={imageFormatConverterContent.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 sm:px-6 py-10 lg:py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Image Format Converter</h1>
            <p className="mt-1 text-muted-foreground">Switch between PNG, JPEG, and WebP output instantly.</p>
          </div>
          <ShareToolButton toolName="Image Format Converter" />
        </div>

        <section className="rounded-lg border border-border bg-card p-4 sm:p-5 space-y-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
            <div className="space-y-3">
              <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 px-4 text-center">
                <UploadSimple className="mb-2 size-5" />
                <span className="text-sm">Upload source image</span>
                <span className="text-xs text-muted-foreground">Drag/drop or click to choose file</span>
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

              <div className="space-y-2">
                <label htmlFor="output-format" className="text-sm font-medium">Output format</label>
                <select
                  id="output-format"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={outputFormat}
                  onChange={(event) => setOutputFormat(event.target.value as OutputFormat)}
                >
                  {formatOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="quality" className="text-sm font-medium">Quality: {quality.toFixed(2)}</label>
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

              <div className="flex flex-wrap gap-2">
                <Button disabled={!sourcePreview || isWorking} onClick={() => void handleConvert()}>
                  {isWorking ? "Converting…" : "Convert"}
                </Button>
                <Button variant="outline" disabled={!outputBlob} onClick={handleDownload} className="gap-1.5">
                  <DownloadSimple className="size-4" /> Download
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium">Source</p>
                <div className="flex min-h-64 items-center justify-center rounded-lg border border-border bg-muted/30 p-3">
                  {sourcePreview ? <img src={sourcePreview} alt="Source" className="max-h-60 w-auto rounded" /> : <p className="text-sm text-muted-foreground">Awaiting source image</p>}
                </div>
                {sourcePreview && <p className="text-xs text-muted-foreground">{formatBytes(sourceSize)}</p>}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Converted</p>
                <div className="flex min-h-64 items-center justify-center rounded-lg border border-border bg-muted/30 p-3">
                  {outputPreview ? <img src={outputPreview} alt="Converted" className="max-h-60 w-auto rounded" /> : <p className="text-sm text-muted-foreground">Converted preview appears here</p>}
                </div>
                {outputBlob && <p className="text-xs text-muted-foreground">{formatBytes(outputBlob.size)} • .{outputExtension}</p>}
              </div>
            </div>
          </div>
        </section>

        <ToolContent about={imageFormatConverterContent.about} faqs={imageFormatConverterContent.faqs} />
      </main>

      <Footer />
    </div>
  );
}
