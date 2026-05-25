import { useMemo, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { toast } from "sonner";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolSchema from "@/components/ToolSchema";
import ToolContent from "@/components/ToolContent";
import { aspectRatioContent } from "@/lib/tool-content-data";
import {
  computeHeightFromWidth,
  computeWidthFromHeight,
  parsePositiveNumber,
  ratioToDecimal,
  simplifyRatio,
  type Ratio,
} from "@/lib/aspect-ratio";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PRESETS: Array<{ label: string; ratio: Ratio }> = [
  { label: "1:1", ratio: { width: 1, height: 1 } },
  { label: "4:3", ratio: { width: 4, height: 3 } },
  { label: "3:2", ratio: { width: 3, height: 2 } },
  { label: "16:9", ratio: { width: 16, height: 9 } },
  { label: "21:9", ratio: { width: 21, height: 9 } },
  { label: "9:16", ratio: { width: 9, height: 16 } },
  { label: "4:5", ratio: { width: 4, height: 5 } },
  { label: "2:1", ratio: { width: 2, height: 1 } },
];

function formatNumber(value: number | null, decimals = 4) {
  if (value === null || !Number.isFinite(value)) return "—";
  const rounded = Number.parseFloat(value.toFixed(decimals));
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

export default function AspectRatioCalculator() {
  const [sourceWidth, setSourceWidth] = useState("1920");
  const [sourceHeight, setSourceHeight] = useState("1080");
  const [ratioWidth, setRatioWidth] = useState("16");
  const [ratioHeight, setRatioHeight] = useState("9");
  const [knownWidth, setKnownWidth] = useState("1920");
  const [knownHeight, setKnownHeight] = useState("1080");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const parsedSourceWidth = parsePositiveNumber(sourceWidth);
  const parsedSourceHeight = parsePositiveNumber(sourceHeight);
  const simplifiedSourceRatio = useMemo(
    () =>
      parsedSourceWidth && parsedSourceHeight
        ? simplifyRatio(parsedSourceWidth, parsedSourceHeight)
        : null,
    [parsedSourceWidth, parsedSourceHeight],
  );

  const sourceDecimal = simplifiedSourceRatio ? ratioToDecimal(simplifiedSourceRatio) : null;
  const sourceInverseDecimal = sourceDecimal ? 1 / sourceDecimal : null;

  const parsedRatioWidth = parsePositiveNumber(ratioWidth);
  const parsedRatioHeight = parsePositiveNumber(ratioHeight);
  const solverRatio = useMemo(
    () =>
      parsedRatioWidth && parsedRatioHeight
        ? simplifyRatio(parsedRatioWidth, parsedRatioHeight)
        : null,
    [parsedRatioWidth, parsedRatioHeight],
  );

  const parsedKnownWidth = parsePositiveNumber(knownWidth);
  const parsedKnownHeight = parsePositiveNumber(knownHeight);
  const computedHeight = parsedKnownWidth && solverRatio ? computeHeightFromWidth(parsedKnownWidth, solverRatio) : null;
  const computedWidth = parsedKnownHeight && solverRatio ? computeWidthFromHeight(parsedKnownHeight, solverRatio) : null;

  const ratioString = solverRatio ? `${solverRatio.width}:${solverRatio.height}` : "—";
  const cssSnippet = solverRatio ? `aspect-ratio: ${solverRatio.width} / ${solverRatio.height};` : "";

  const previewAspectRatio = solverRatio
    ? `${solverRatio.width} / ${solverRatio.height}`
    : "16 / 9";

  const applyPreset = (ratio: Ratio) => {
    setRatioWidth(String(ratio.width));
    setRatioHeight(String(ratio.height));
    setSourceWidth(String(ratio.width * 100));
    setSourceHeight(String(ratio.height * 100));
  };

  const copyValue = async (key: string, value: string) => {
    if (!value || value === "—") return;
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    toast.success("Copied to clipboard");
    window.setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Aspect Ratio Calculator — Simplify, Convert, and Scale Ratios | Minerva"
        description="Calculate, simplify, and convert aspect ratios. Solve missing dimensions, use common presets, and copy CSS aspect-ratio values instantly."
        canonical="/tools/aspect-ratio"
      />
      <ToolSchema
        name="Aspect Ratio Calculator"
        description="Calculate and convert aspect ratios with presets, dimension solving, and CSS export."
        url="/tools/aspect-ratio"
        faqs={aspectRatioContent.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 sm:px-6 py-10 lg:py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Aspect Ratio Calculator</h1>
            <p className="mt-1 text-muted-foreground">
              Simplify ratios, solve dimensions, and generate CSS <code>aspect-ratio</code> values.
            </p>
          </div>
          <ShareToolButton toolName="Aspect Ratio Calculator" />
        </div>

        <section className="mb-6 rounded-lg border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold">Common Presets</h2>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                size="sm"
                onClick={() => applyPreset(preset.ratio)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
            <h2 className="mb-4 text-sm font-semibold">Simplify Ratio</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Width" value={sourceWidth} onChange={setSourceWidth} />
              <Field label="Height" value={sourceHeight} onChange={setSourceHeight} />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <OutputCard
                label="Simplified Ratio"
                value={
                  simplifiedSourceRatio
                    ? `${simplifiedSourceRatio.width}:${simplifiedSourceRatio.height}`
                    : "—"
                }
                copied={copiedKey === "simplified"}
                onCopy={() =>
                  copyValue(
                    "simplified",
                    simplifiedSourceRatio
                      ? `${simplifiedSourceRatio.width}:${simplifiedSourceRatio.height}`
                      : "",
                  )
                }
              />
              <OutputCard
                label="Decimal Ratio"
                value={formatNumber(sourceDecimal, 6)}
                copied={copiedKey === "decimal"}
                onCopy={() => copyValue("decimal", sourceDecimal ? formatNumber(sourceDecimal, 6) : "")}
              />
              <OutputCard
                label="Inverse Decimal"
                value={formatNumber(sourceInverseDecimal, 6)}
                copied={copiedKey === "inverse"}
                onCopy={() =>
                  copyValue("inverse", sourceInverseDecimal ? formatNumber(sourceInverseDecimal, 6) : "")
                }
              />
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
            <h2 className="mb-4 text-sm font-semibold">Dimension Solver</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Ratio Width" value={ratioWidth} onChange={setRatioWidth} />
              <Field label="Ratio Height" value={ratioHeight} onChange={setRatioHeight} />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Known Width" value={knownWidth} onChange={setKnownWidth} />
              <Field label="Known Height" value={knownHeight} onChange={setKnownHeight} />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <OutputCard
                label="Computed Height"
                value={formatNumber(computedHeight, 4)}
                copied={copiedKey === "height"}
                onCopy={() => copyValue("height", computedHeight ? formatNumber(computedHeight, 4) : "")}
              />
              <OutputCard
                label="Computed Width"
                value={formatNumber(computedWidth, 4)}
                copied={copiedKey === "width"}
                onCopy={() => copyValue("width", computedWidth ? formatNumber(computedWidth, 4) : "")}
              />
            </div>

            <div className="mt-4 rounded-md border border-border bg-muted/30 p-3">
              <p className="text-xs font-medium text-muted-foreground">Ratio String</p>
              <div className="mt-1 flex items-center justify-between gap-2">
                <code className="font-mono text-sm">{ratioString}</code>
                <CopyButton
                  copied={copiedKey === "ratio"}
                  onClick={() => copyValue("ratio", ratioString === "—" ? "" : ratioString)}
                />
              </div>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-lg border border-border bg-card p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold">CSS Output</h2>
            <CopyButton
              copied={copiedKey === "css"}
              onClick={() => copyValue("css", cssSnippet)}
              label={copiedKey === "css" ? "Copied" : "Copy CSS"}
            />
          </div>
          <pre className="rounded-md border border-border bg-muted/30 p-3 font-mono text-sm">
            {cssSnippet || "aspect-ratio: 16 / 9;"}
          </pre>
        </section>

        <section className="mt-6 rounded-lg border border-border bg-card p-4 sm:p-5">
          <h2 className="mb-3 text-sm font-semibold">Live Preview</h2>
          <div className="flex min-h-[180px] items-center justify-center rounded-md border border-border bg-muted/30 p-6">
            <div className="w-full max-w-[320px]" style={{ aspectRatio: previewAspectRatio }}>
              <div className="flex h-full w-full items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-xs font-medium text-primary">
                {ratioString === "—" ? "16:9" : ratioString}
              </div>
            </div>
          </div>
        </section>

        <ToolContent about={aspectRatioContent.about} faqs={aspectRatioContent.faqs} />
      </main>

      <Footer />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      <Input
        type="number"
        step="any"
        min={0}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function OutputCard({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="rounded-md border border-border bg-muted/30 p-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <code className="font-mono text-sm">{value}</code>
        <CopyButton copied={copied} onClick={onCopy} />
      </div>
    </div>
  );
}

function CopyButton({
  copied,
  onClick,
  label,
}: {
  copied: boolean;
  onClick: () => void;
  label?: string;
}) {
  return (
    <Button size="xs" variant="outline" onClick={onClick} className="gap-1">
      {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}
      {label ?? (copied ? "Copied" : "Copy")}
    </Button>
  );
}
