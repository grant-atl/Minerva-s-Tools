import { useState } from "react";
import { Check, Copy, Palette } from "@phosphor-icons/react";
import { toast } from "sonner";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolSchema from "@/components/ToolSchema";
import ToolContent from "@/components/ToolContent";
import { colorConverterContent } from "@/lib/tool-content-data";
import { formatHsl, formatRgb, hslToRgb, rgbToHex, rgbToHsl } from "@/lib/color-utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function parseHex(value: string): RGB | null {
  const stripped = value.trim().replace(/^#/, "");
  const expanded = stripped.length === 3 ? stripped.split("").map((c) => c + c).join("") : stripped;
  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) return null;
  return {
    r: Number.parseInt(expanded.slice(0, 2), 16),
    g: Number.parseInt(expanded.slice(2, 4), 16),
    b: Number.parseInt(expanded.slice(4, 6), 16),
  };
}

function parseRgb(value: string): RGB | null {
  const match = value.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);
  if (!match) return null;
  return {
    r: clamp(Number(match[1]), 0, 255),
    g: clamp(Number(match[2]), 0, 255),
    b: clamp(Number(match[3]), 0, 255),
  };
}

function parseHsl(value: string): HSL | null {
  const match = value.match(/^hsl\(\s*(-?\d{1,3}(?:\.\d+)?)\s*,\s*(\d{1,3}(?:\.\d+)?)%\s*,\s*(\d{1,3}(?:\.\d+)?)%\s*\)$/i);
  if (!match) return null;
  return {
    h: ((Number(match[1]) % 360) + 360) % 360,
    s: clamp(Number(match[2]), 0, 100),
    l: clamp(Number(match[3]), 0, 100),
  };
}

export default function ColorConverter() {
  const [hex, setHex] = useState("#3B82F6");
  const [rgb, setRgb] = useState("rgb(59, 130, 246)");
  const [hsl, setHsl] = useState("hsl(217, 91%, 60%)");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const setFromRgb = (nextRgb: RGB) => {
    const nextHex = rgbToHex(nextRgb).toUpperCase();
    const nextHsl = rgbToHsl(nextRgb);
    setHex(nextHex);
    setRgb(formatRgb(nextRgb));
    setHsl(formatHsl(nextHsl));
    setError(null);
  };

  const onHexChange = (value: string) => {
    setHex(value);
    const parsed = parseHex(value);
    if (!parsed) {
      setError("Invalid HEX color. Use #RRGGBB or #RGB.");
      return;
    }
    setFromRgb(parsed);
  };

  const onRgbChange = (value: string) => {
    setRgb(value);
    const parsed = parseRgb(value);
    if (!parsed) {
      setError("Invalid RGB color. Use rgb(r, g, b).");
      return;
    }
    setFromRgb(parsed);
  };

  const onHslChange = (value: string) => {
    setHsl(value);
    const parsed = parseHsl(value);
    if (!parsed) {
      setError("Invalid HSL color. Use hsl(h, s%, l%).");
      return;
    }
    setFromRgb(hslToRgb(parsed));
  };

  const copyValue = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    toast.success(`${text} copied`);
    window.setTimeout(() => setCopied(null), 1400);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Color Converter — HEX, RGB, HSL Converter | Minerva"
        description="Convert colors between HEX, RGB, and HSL formats instantly with live preview and one-click copy."
        canonical="/tools/color-converter"
      />
      <ToolSchema
        name="Color Converter"
        description="Convert colors between HEX, RGB, and HSL with live preview."
        url="/tools/color-converter"
        faqs={colorConverterContent.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 sm:px-6 py-10 lg:py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Color Converter</h1>
            <p className="mt-1 text-muted-foreground">Convert HEX, RGB, and HSL with synchronized inputs.</p>
          </div>
          <ShareToolButton toolName="Color Converter" />
        </div>

        <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
          <div className="mb-5 flex items-center gap-3 rounded-md border border-border bg-muted/20 p-3">
            <div className="h-12 w-12 rounded-md border border-border" style={{ backgroundColor: hex }} />
            <div>
              <p className="text-xs text-muted-foreground">Current Color</p>
              <p className="font-mono text-sm">{hex.toUpperCase()}</p>
            </div>
            <Palette className="ml-auto size-5 text-muted-foreground" />
          </div>

          <div className="grid gap-4">
            <InputRow label="HEX" value={hex} onChange={onHexChange} onCopy={() => copyValue(hex, "hex")} copied={copied === "hex"} />
            <InputRow label="RGB" value={rgb} onChange={onRgbChange} onCopy={() => copyValue(rgb, "rgb")} copied={copied === "rgb"} />
            <InputRow label="HSL" value={hsl} onChange={onHslChange} onCopy={() => copyValue(hsl, "hsl")} copied={copied === "hsl"} />
          </div>

          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        </section>

        <ToolContent about={colorConverterContent.about} faqs={colorConverterContent.faqs} />
      </main>

      <Footer />
    </div>
  );
}

function InputRow({
  label,
  value,
  onChange,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div>
      <Label className="mb-1.5 block text-sm">{label}</Label>
      <div className="flex items-center gap-2">
        <Input value={value} onChange={(event) => onChange(event.target.value)} className="font-mono" />
        <Button size="sm" variant="outline" className="gap-1" onClick={onCopy}>
          {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}
          Copy
        </Button>
      </div>
    </div>
  );
}
