import { useMemo, useState } from "react";
import { DownloadSimple, FileSvg, UploadSimple } from "@phosphor-icons/react";
import { toast } from "sonner";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolSchema from "@/components/ToolSchema";
import ToolContent from "@/components/ToolContent";
import { svgToPngContent } from "@/lib/tool-content-data";
import { TOOL_TEXTAREA_OUTLINE_CLASS } from "@/lib/tool-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const DEFAULT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0EA5E9"/>
      <stop offset="100%" stop-color="#6366F1"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#g)"/>
  <circle cx="256" cy="256" r="120" fill="rgba(255,255,255,0.2)"/>
  <text x="256" y="285" text-anchor="middle" fill="white" font-family="Figtree, sans-serif" font-size="140" font-weight="700">M</text>
</svg>`;

export default function SvgToPngConverter() {
  const [svgText, setSvgText] = useState(DEFAULT_SVG);
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [error, setError] = useState<string | null>(null);

  const previewSrc = useMemo(() => {
    try {
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
    } catch {
      return "";
    }
  }, [svgText]);

  const onUpload = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSvgText(String(reader.result));
      setError(null);
    };
    reader.readAsText(file);
  };

  const downloadPng = async () => {
    try {
      setError(null);
      const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const image = new Image();

      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("Could not render SVG"));
        image.src = url;
      });

      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, width || image.width || 512);
      canvas.height = Math.max(1, height || image.height || 512);
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is unavailable");

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      const pngBlob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!pngBlob) throw new Error("PNG conversion failed");

      const downloadUrl = URL.createObjectURL(pngBlob);
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.download = "converted-image.png";
      anchor.click();
      URL.revokeObjectURL(downloadUrl);
      toast.success("PNG downloaded");
    } catch (conversionError) {
      setError((conversionError as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="SVG to PNG Converter — Export SVG as PNG | Minerva's Tools"
        description="Convert raw SVG markup or uploaded SVG files into PNG images at custom output sizes."
        canonical="/tools/svg-to-png"
      />
      <ToolSchema
        name="SVG to PNG Converter"
        description="Convert SVG markup into downloadable PNG images with custom dimensions."
        url="/tools/svg-to-png"
        faqs={svgToPngContent.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 sm:px-6 py-10 lg:py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">SVG to PNG Converter</h1>
            <p className="mt-1 text-muted-foreground">Paste SVG or upload a file, then export high-quality PNG output.</p>
          </div>
          <ShareToolButton toolName="SVG to PNG Converter" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <FileSvg className="size-4" />
              SVG Source
            </div>
            <Textarea
              value={svgText}
              onChange={(event) => setSvgText(event.target.value)}
              className={`min-h-[280px] font-mono text-xs ${TOOL_TEXTAREA_OUTLINE_CLASS}`}
            />

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted/40">
                <UploadSimple className="size-4" />
                Upload SVG
                <input type="file" accept="image/svg+xml,.svg" className="hidden" onChange={(e) => onUpload(e.target.files?.[0] || null)} />
              </label>
              <Button size="sm" variant="outline" onClick={() => setSvgText(DEFAULT_SVG)}>Reset Example</Button>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
            <h2 className="mb-3 text-sm font-semibold">Output</h2>
            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="mb-1.5 block text-sm">Width (px)</Label>
                <Input type="number" min={1} value={width} onChange={(event) => setWidth(Number(event.target.value) || 1)} />
              </div>
              <div>
                <Label className="mb-1.5 block text-sm">Height (px)</Label>
                <Input type="number" min={1} value={height} onChange={(event) => setHeight(Number(event.target.value) || 1)} />
              </div>
            </div>

            <div className="mb-4 flex min-h-[260px] items-center justify-center rounded-md border border-border bg-muted/20 p-4">
              {previewSrc ? <img src={previewSrc} alt="SVG preview" className="max-h-[240px] max-w-full" /> : <p className="text-sm text-muted-foreground">Invalid SVG markup</p>}
            </div>

            <Button className="gap-1" onClick={downloadPng}>
              <DownloadSimple className="size-4" />
              Download PNG
            </Button>
            {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          </section>
        </div>

        <ToolContent about={svgToPngContent.about} faqs={svgToPngContent.faqs} />
      </main>

      <Footer />
    </div>
  );
}
