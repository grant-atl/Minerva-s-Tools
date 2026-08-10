import { useMemo, useState } from "react";
import { Check, Copy, DownloadSimple } from "@phosphor-icons/react";
import { toast } from "sonner";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolSchema from "@/components/ToolSchema";
import ToolContent from "@/components/ToolContent";
import { svgBlobPatternContent } from "@/lib/tool-content-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function createBlobPath(pointsCount: number, variance: number): string {
  const center = 256;
  const baseRadius = 170;
  const points = Array.from({ length: pointsCount }, (_, i) => {
    const angle = (Math.PI * 2 * i) / pointsCount;
    const randomRadius = baseRadius * (1 + (Math.random() * 2 - 1) * variance);
    return {
      x: center + randomRadius * Math.cos(angle),
      y: center + randomRadius * Math.sin(angle),
    };
  });

  const midpoint = (a: { x: number; y: number }, b: { x: number; y: number }) => ({
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  });

  const firstMid = midpoint(points[points.length - 1], points[0]);
  let d = `M ${firstMid.x.toFixed(2)} ${firstMid.y.toFixed(2)}`;

  for (let i = 0; i < points.length; i += 1) {
    const current = points[i];
    const next = points[(i + 1) % points.length];
    const mid = midpoint(current, next);
    d += ` Q ${current.x.toFixed(2)} ${current.y.toFixed(2)} ${mid.x.toFixed(2)} ${mid.y.toFixed(2)}`;
  }

  return `${d} Z`;
}

function downloadSvg(svgText: string, fileName: string) {
  const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export default function SvgBlobPatternGenerator() {
  const [mode, setMode] = useState<"blob" | "pattern">("blob");
  const [points, setPoints] = useState(10);
  const [variance, setVariance] = useState(0.35);
  const [blobFill, setBlobFill] = useState("#4F46E5");
  const [blobBg, setBlobBg] = useState("#EEF2FF");

  const [shape, setShape] = useState<"circle" | "square" | "triangle">("circle");
  const [tileSize, setTileSize] = useState(36);
  const [tileGap, setTileGap] = useState(20);
  const [patternFg, setPatternFg] = useState("#0F172A");
  const [patternBg, setPatternBg] = useState("#F8FAFC");
  const [copied, setCopied] = useState(false);

  const blobPath = useMemo(() => createBlobPath(points, variance), [points, variance]);

  const svgText = useMemo(() => {
    if (mode === "blob") {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">\n  <rect width="512" height="512" fill="${blobBg}"/>\n  <path d="${blobPath}" fill="${blobFill}"/>\n</svg>`;
    }

    const tile = tileSize + tileGap;
    const marker =
      shape === "circle"
        ? `<circle cx="${tile / 2}" cy="${tile / 2}" r="${tileSize / 2}" fill="${patternFg}" />`
        : shape === "square"
          ? `<rect x="${tileGap / 2}" y="${tileGap / 2}" width="${tileSize}" height="${tileSize}" fill="${patternFg}" rx="4" />`
          : `<polygon points="${tile / 2},${tileGap / 2} ${tileGap / 2},${tileSize + tileGap / 2} ${tileSize + tileGap / 2},${tileSize + tileGap / 2}" fill="${patternFg}" />`;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">\n  <defs>\n    <pattern id="pattern" width="${tile}" height="${tile}" patternUnits="userSpaceOnUse">\n      ${marker}\n    </pattern>\n  </defs>\n  <rect width="512" height="512" fill="${patternBg}"/>\n  <rect width="512" height="512" fill="url(#pattern)"/>\n</svg>`;
  }, [mode, blobBg, blobFill, blobPath, patternBg, patternFg, shape, tileGap, tileSize]);

  const preview = useMemo(() => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`, [svgText]);

  const copyCode = async () => {
    await navigator.clipboard.writeText(svgText);
    setCopied(true);
    toast.success("SVG copied");
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="SVG Blob & Pattern Generator — Create SVG Background Assets | Minerva's Tools"
        description="Generate abstract blob SVGs and repeating SVG patterns, then copy code or download the asset instantly."
        canonical="/tools/svg-blob-pattern"
      />
      <ToolSchema
        name="SVG Blob & Pattern Generator"
        description="Generate customizable blob and pattern SVG assets."
        url="/tools/svg-blob-pattern"
        faqs={svgBlobPatternContent.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 sm:px-6 py-10 lg:py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">SVG Blob & Pattern Generator</h1>
            <p className="mt-1 text-muted-foreground">Create organic blobs or repeating patterns for modern UI backgrounds.</p>
          </div>
          <ShareToolButton toolName="SVG Blob & Pattern Generator" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
            <div className="mb-4 flex gap-2">
              <Button size="sm" variant={mode === "blob" ? "default" : "outline"} onClick={() => setMode("blob")}>Blob</Button>
              <Button size="sm" variant={mode === "pattern" ? "default" : "outline"} onClick={() => setMode("pattern")}>Pattern</Button>
            </div>

            {mode === "blob" ? (
              <div className="space-y-4">
                <RangeControl label="Points" value={points} min={6} max={18} step={1} setValue={setPoints} />
                <RangeControl label="Variance" value={variance} min={0.1} max={0.6} step={0.01} setValue={setVariance} />
                <ColorControl label="Blob Fill" value={blobFill} onChange={setBlobFill} />
                <ColorControl label="Background" value={blobBg} onChange={setBlobBg} />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label className="mb-1.5 block text-sm">Shape</Label>
                  <div className="flex gap-1.5">
                    {(["circle", "square", "triangle"] as const).map((option) => (
                      <Button
                        key={option}
                        size="sm"
                        variant={shape === option ? "default" : "outline"}
                        onClick={() => setShape(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
                <RangeControl label="Shape Size" value={tileSize} min={12} max={80} step={1} setValue={setTileSize} />
                <RangeControl label="Gap" value={tileGap} min={0} max={60} step={1} setValue={setTileGap} />
                <ColorControl label="Shape Color" value={patternFg} onChange={setPatternFg} />
                <ColorControl label="Background" value={patternBg} onChange={setPatternBg} />
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              <Button size="sm" className="gap-1" onClick={copyCode}>
                {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />} 
                {copied ? "Copied" : "Copy SVG"}
              </Button>
              <Button size="sm" variant="outline" className="gap-1" onClick={() => downloadSvg(svgText, mode === "blob" ? "blob.svg" : "pattern.svg")}>
                <DownloadSimple className="size-3.5" />
                Download
              </Button>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
            <h2 className="mb-3 text-sm font-semibold">Preview</h2>
            <div className="mb-4 flex min-h-[280px] items-center justify-center rounded-md border border-border bg-muted/20 p-4">
              <img src={preview} alt="Generated SVG preview" className="max-h-[260px] max-w-full rounded-md border border-border" />
            </div>
            <pre className="max-h-[180px] overflow-auto rounded-md border border-border bg-background p-3 text-xs font-mono">
              {svgText}
            </pre>
          </section>
        </div>

        <ToolContent about={svgBlobPatternContent.about} faqs={svgBlobPatternContent.faqs} />
      </main>

      <Footer />
    </div>
  );
}

function ColorControl({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <Label className="mb-1.5 block text-sm">{label}</Label>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-10 rounded-md border border-border" />
        <Input value={value} onChange={(event) => onChange(event.target.value)} className="font-mono" />
      </div>
    </div>
  );
}

function RangeControl({
  label,
  value,
  min,
  max,
  step,
  setValue,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  setValue: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <Label>{label}</Label>
        <span className="font-mono text-muted-foreground">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
      />
    </div>
  );
}
