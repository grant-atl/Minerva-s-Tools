import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import SEO from "@/components/SEO";
import ToolContent from "@/components/ToolContent";
import { glassmorphismContent } from "@/lib/tool-content-data";
import MegaNav from "@/components/MegaNav";
import Footer from "@/components/Footer";
import ShareToolButton from "@/components/ShareToolButton";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check, ArrowCounterClockwise } from "@phosphor-icons/react";
import { toast } from "sonner";

interface GlassSettings {
  bgColor: string;
  bgOpacity: number;
  blur: number;
  borderOpacity: number;
  borderRadius: number;
  shadow: number;
  saturation: number;
}

const DEFAULTS: GlassSettings = {
  bgColor: "#ffffff",
  bgOpacity: 15,
  blur: 12,
  borderOpacity: 20,
  borderRadius: 16,
  shadow: 20,
  saturation: 120,
};

const PRESETS: { name: string; settings: GlassSettings }[] = [
  { name: "Subtle", settings: { bgColor: "#ffffff", bgOpacity: 10, blur: 8, borderOpacity: 15, borderRadius: 12, shadow: 10, saturation: 100 } },
  { name: "Frosted", settings: { bgColor: "#ffffff", bgOpacity: 20, blur: 16, borderOpacity: 30, borderRadius: 16, shadow: 25, saturation: 140 } },
  { name: "Bold", settings: { bgColor: "#ffffff", bgOpacity: 30, blur: 24, borderOpacity: 40, borderRadius: 20, shadow: 35, saturation: 160 } },
  { name: "Dark Glass", settings: { bgColor: "#000000", bgOpacity: 25, blur: 14, borderOpacity: 15, borderRadius: 16, shadow: 30, saturation: 120 } },
  { name: "Colorful", settings: { bgColor: "#6366f1", bgOpacity: 15, blur: 12, borderOpacity: 25, borderRadius: 16, shadow: 20, saturation: 130 } },
  { name: "Minimal", settings: { bgColor: "#ffffff", bgOpacity: 5, blur: 4, borderOpacity: 10, borderRadius: 8, shadow: 5, saturation: 100 } },
];

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

export default function GlassmorphismGenerator() {
  const [settings, setSettings] = useState<GlassSettings>({ ...DEFAULTS });
  const [copied, setCopied] = useState(false);

  const update = <K extends keyof GlassSettings>(key: K, value: GlassSettings[K]) =>
    setSettings((s) => ({ ...s, [key]: value }));

  const rgb = hexToRgb(settings.bgColor);

  const cssCode = useMemo(() => {
    const { bgOpacity, blur, borderOpacity, borderRadius, shadow, saturation } = settings;
    return [
      `background: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(bgOpacity / 100).toFixed(2)});`,
      `backdrop-filter: blur(${blur}px) saturate(${saturation}%);`,
      `-webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);`,
      `border-radius: ${borderRadius}px;`,
      `border: 1px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(borderOpacity / 100).toFixed(2)});`,
      `box-shadow: 0 ${Math.round(shadow * 0.4)}px ${shadow}px rgba(0, 0, 0, ${(shadow / 200).toFixed(2)});`,
    ].join("\n");
  }, [settings, rgb]);

  const copyCSS = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    toast.success("CSS copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <SEO
        title="Glassmorphism Generator — Frosted Glass CSS Editor | Minerva's Tools"
        description="Create frosted glass UI effects with a visual editor. Adjust blur, transparency, border, and saturation. Copy clean CSS. Free, no sign-up."
        canonical="/tools/glassmorphism"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Glassmorphism Generator",
            url: "https://minervas.tools/tools/glassmorphism",
            applicationCategory: "DesignApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description: "Create frosted glass UI effects with backdrop-filter, blur, transparency, and live preview.",
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <MegaNav />
        <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Glassmorphism Generator</h1>
              <p className="mt-1 text-muted-foreground">
                Create frosted-glass UI effects with live preview and one-click CSS export.
              </p>
            </div>
            <ShareToolButton toolName="Glassmorphism Generator" />
          </div>

          {/* Presets */}
          <div className="mb-6 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <Button
                key={p.name}
                variant="outline"
                size="sm"
                onClick={() => setSettings({ ...p.settings })}
              >
                {p.name}
              </Button>
            ))}
            <Button variant="ghost" size="sm" onClick={() => setSettings({ ...DEFAULTS })}>
              <ArrowCounterClockwise className="size-3.5 mr-1" /> Reset
            </Button>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            {/* Controls */}
            <div className="space-y-5">
              <ControlRow label="Background Color">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.bgColor}
                    onChange={(e) => update("bgColor", e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent"
                  />
                  <Input
                    value={settings.bgColor}
                    onChange={(e) => update("bgColor", e.target.value)}
                    className="w-28 font-mono text-sm"
                  />
                </div>
              </ControlRow>

              <SliderControl label="Background Opacity" value={settings.bgOpacity} min={0} max={100} unit="%" onChange={(v) => update("bgOpacity", v)} />
              <SliderControl label="Blur" value={settings.blur} min={0} max={40} unit="px" onChange={(v) => update("blur", v)} />
              <SliderControl label="Saturation" value={settings.saturation} min={100} max={200} unit="%" onChange={(v) => update("saturation", v)} />
              <SliderControl label="Border Opacity" value={settings.borderOpacity} min={0} max={100} unit="%" onChange={(v) => update("borderOpacity", v)} />
              <SliderControl label="Border Radius" value={settings.borderRadius} min={0} max={48} unit="px" onChange={(v) => update("borderRadius", v)} />
              <SliderControl label="Shadow Intensity" value={settings.shadow} min={0} max={60} unit="" onChange={(v) => update("shadow", v)} />
            </div>

            {/* Preview */}
            <div className="flex flex-col gap-4">
              <div
                className="relative flex items-center justify-center overflow-hidden rounded-xl border border-border"
                style={{
                  minHeight: 360,
                  background: "linear-gradient(135deg, oklch(0.65 0.25 280), oklch(0.7 0.2 330), oklch(0.75 0.18 40))",
                }}
              >
                {/* Decorative shapes behind glass */}
                <div className="absolute left-[15%] top-[20%] h-24 w-24 rounded-full" style={{ background: "oklch(0.8 0.22 300 / 0.7)" }} />
                <div className="absolute right-[10%] bottom-[15%] h-32 w-32 rounded-full" style={{ background: "oklch(0.75 0.2 40 / 0.6)" }} />
                <div className="absolute left-[50%] top-[60%] h-20 w-20 rounded-full" style={{ background: "oklch(0.85 0.15 180 / 0.5)" }} />

                {/* Glass card */}
                <div
                  className="relative z-10 w-72 p-6"
                  style={{
                    background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${settings.bgOpacity / 100})`,
                    backdropFilter: `blur(${settings.blur}px) saturate(${settings.saturation}%)`,
                    WebkitBackdropFilter: `blur(${settings.blur}px) saturate(${settings.saturation}%)`,
                    borderRadius: `${settings.borderRadius}px`,
                    border: `1px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${settings.borderOpacity / 100})`,
                    boxShadow: `0 ${Math.round(settings.shadow * 0.4)}px ${settings.shadow}px rgba(0, 0, 0, ${settings.shadow / 200})`,
                  }}
                >
                  <div className="mb-3 h-10 w-10 rounded-lg bg-white/30" />
                  <div className="mb-2 h-4 w-3/4 rounded bg-white/40" />
                  <div className="mb-1 h-3 w-full rounded bg-white/20" />
                  <div className="mb-1 h-3 w-5/6 rounded bg-white/20" />
                  <div className="h-3 w-2/3 rounded bg-white/20" />
                  <div className="mt-4 h-8 w-24 rounded-lg bg-white/30" />
                </div>
              </div>

              {/* CSS output */}
              <div className="relative rounded-lg border border-border bg-muted/30 p-4">
                <pre className="overflow-x-auto font-mono text-sm text-foreground whitespace-pre-wrap">{cssCode}</pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-3 top-3"
                  onClick={copyCSS}
                >
                  {copied ? <Check className="size-3.5 mr-1 text-green-500" /> : <Copy className="size-3.5 mr-1" />}
                  {copied ? "Copied" : "Copy CSS"}
                </Button>
              </div>
            </div>
          </div>

          <ToolContent about={glassmorphismContent.about} faqs={glassmorphismContent.faqs} />
        </main>
        <Footer />
      </div>
    </>
  );
}

function ControlRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  );
}

function SliderControl({
  label, value, min, max, unit, onChange,
}: {
  label: string; value: number; min: number; max: number; unit: string; onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-sm">{label}</Label>
        <span className="text-sm font-mono text-muted-foreground">{value}{unit}</span>
      </div>
      <Slider min={min} max={max} step={1} value={[value]} onValueChange={([v]) => onChange(v)} />
    </div>
  );
}
