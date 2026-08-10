import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Copy, Check, MagnifyingGlass } from "@phosphor-icons/react";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolContent from "@/components/ToolContent";
import ToolSchema from "@/components/ToolSchema";
import { typographyContent } from "@/lib/tool-content-data";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const RATIOS = [
  { name: "Minor Second", value: 1.067 },
  { name: "Major Second", value: 1.125 },
  { name: "Minor Third", value: 1.2 },
  { name: "Major Third", value: 1.25 },
  { name: "Perfect Fourth", value: 1.333 },
  { name: "Augmented Fourth", value: 1.414 },
  { name: "Perfect Fifth", value: 1.5 },
  { name: "Golden Ratio", value: 1.618 },
];

const STEPS = [
  { label: "xs", exp: -3 },
  { label: "sm", exp: -2 },
  { label: "md", exp: -1 },
  { label: "base", exp: 0 },
  { label: "lg", exp: 1 },
  { label: "xl", exp: 2 },
  { label: "2xl", exp: 3 },
];

import { GOOGLE_FONTS, loadGoogleFont } from "@/lib/google-fonts";

const BUILT_IN_FONTS: Record<string, string> = {
  system: "system-ui, -apple-system, sans-serif",
  figtree: "'Figtree Variable', ui-sans-serif, system-ui, sans-serif",
  georgia: "Georgia, Cambria, 'Times New Roman', Times, serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
};

const PRESETS = [
  { name: "UI", ratio: 1.125, font: "figtree", lineHeight: 1.5, base: 16 },
  { name: "Editorial", ratio: 1.618, font: "Playfair Display", lineHeight: 1.6, base: 18 },
  { name: "Marketing", ratio: 1.333, font: "Montserrat", lineHeight: 1.4, base: 16 },
  { name: "Compact", ratio: 1.067, font: "system", lineHeight: 1.4, base: 14 },
];


function isGoogleFont(font: string) {
  return !BUILT_IN_FONTS[font];
}

function getFontFamily(font: string) {
  if (BUILT_IN_FONTS[font]) return BUILT_IN_FONTS[font];
  return `'${font}', sans-serif`;
}

export default function TypographyScale() {
  const { toast } = useToast();
  const [baseSize, setBaseSize] = useState(16);
  const [ratio, setRatio] = useState(1.25);
  const [customRatio, setCustomRatio] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [fontFamily, setFontFamily] = useState("figtree");
  const [lineHeight, setLineHeight] = useState(1.5);
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [fontSearch, setFontSearch] = useState("");
  const [fontDropdownOpen, setFontDropdownOpen] = useState(false);
  const fontDropdownRef = useRef<HTMLDivElement>(null);

  // Load Google Font when selected
  useEffect(() => {
    if (isGoogleFont(fontFamily)) {
      loadGoogleFont(fontFamily);
    }
  }, [fontFamily]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (fontDropdownRef.current && !fontDropdownRef.current.contains(e.target as Node)) {
        setFontDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredFonts = useMemo(() => {
    const q = fontSearch.toLowerCase();
    if (!q) return GOOGLE_FONTS;
    return GOOGLE_FONTS.filter((f) => f.name.toLowerCase().includes(q));
  }, [fontSearch]);

  const groupedFonts = useMemo(() => {
    const groups: Record<string, typeof GOOGLE_FONTS> = {};
    for (const f of filteredFonts) {
      (groups[f.category] ??= []).push(f);
    }
    return groups;
  }, [filteredFonts]);

  const scale = useMemo(
    () =>
      STEPS.map((step) => {
        const px = baseSize * Math.pow(ratio, step.exp);
        return { ...step, px: Math.round(px * 100) / 100, rem: Math.round((px / 16) * 1000) / 1000 };
      }),
    [baseSize, ratio]
  );

  const fontFamilyCSS = getFontFamily(fontFamily);

  const cssCode = useMemo(() => {
    const lines = scale.map((s) => `  --font-${s.label}: ${s.rem}rem;`);
    const fontLine = isGoogleFont(fontFamily)
      ? `\n  /* Google Font: ${fontFamily} */\n  --font-family: '${fontFamily}', sans-serif;`
      : `\n  --font-family: ${fontFamilyCSS};`;
    return `:root {\n${lines.join("\n")}\n  --line-height: ${lineHeight};${fontLine}\n}`;
  }, [scale, lineHeight, fontFamily, fontFamilyCSS]);

  const tailwindCode = useMemo(() => {
    const entries = scale.map((s) => `      '${s.label}': ['${s.rem}rem', { lineHeight: '${lineHeight}' }],`);
    const fontConfig = isGoogleFont(fontFamily)
      ? `\n  fontFamily: {\n    custom: ['${fontFamily}', 'sans-serif'],\n  },`
      : "";
    return `// tailwind.config.ts\ntheme: {\n  fontSize: {\n${entries.join("\n")}\n  },${fontConfig}\n}`;
  }, [scale, lineHeight, fontFamily]);

  const copy = async (text: string, tab: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedTab(tab);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setBaseSize(p.base);
    setRatio(p.ratio);
    setFontFamily(p.font);
    setLineHeight(p.lineHeight);
    setIsCustom(false);
    setCustomRatio("");
    if (isGoogleFont(p.font)) loadGoogleFont(p.font);
  };

  const handleRatioSelect = (val: string) => {
    if (val === "custom") {
      setIsCustom(true);
    } else {
      setIsCustom(false);
      setRatio(parseFloat(val));
    }
  };

  const handleCustomRatio = (val: string) => {
    setCustomRatio(val);
    const n = parseFloat(val);
    if (!isNaN(n) && n > 1 && n < 3) setRatio(n);
  };

  const selectFont = useCallback((font: string) => {
    setFontFamily(font);
    setFontDropdownOpen(false);
    setFontSearch("");
    if (isGoogleFont(font)) loadGoogleFont(font);
  }, []);

  const currentRatioName = RATIOS.find((r) => r.value === ratio)?.name ?? `Custom (${ratio})`;
  const displayFontName = BUILT_IN_FONTS[fontFamily]
    ? fontFamily === "figtree" ? "Figtree" : fontFamily === "georgia" ? "Georgia" : fontFamily === "mono" ? "Monospace" : "System"
    : fontFamily;

  return (
    <>
      <SEO
        title="Typography Scale Generator | Minerva's Tools"
        description="Generate harmonious type scales with modular ratios. Preview live with Google Fonts, export CSS custom properties or Tailwind config."
        canonical="/tools/typography-scale"
      />
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <HomeNav />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Typography Scale</h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
                Generate a harmonious type scale from a base size and modular ratio. Preview with 30+ Google Fonts and export CSS or Tailwind config.
              </p>
            </div>
            <ShareToolButton toolName="Typography Scale Generator" />
          </div>

          {/* Presets */}
          <div className="flex flex-wrap gap-2 mb-8">
            {PRESETS.map((p) => (
              <Button key={p.name} variant="outline" size="sm" onClick={() => applyPreset(p)}>
                {p.name}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Preview */}
            <div className="space-y-1 rounded-2xl border border-border bg-card p-5 sm:p-6 overflow-hidden">
              <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Preview</h2>
              {[...scale].reverse().map((s) => (
                <div
                  key={s.label}
                  className="flex items-baseline gap-3 py-2 border-b border-border/40 last:border-0"
                >
                  <span className="text-[11px] font-mono text-muted-foreground w-8 shrink-0 text-right">{s.label}</span>
                  <span
                    className="truncate leading-tight"
                    style={{
                      fontSize: `${s.px}px`,
                      fontFamily: fontFamilyCSS,
                      lineHeight: `${lineHeight}`,
                    }}
                  >
                    The quick brown fox
                  </span>
                  <span className="ml-auto text-[11px] font-mono text-muted-foreground shrink-0">
                    {s.px}px / {s.rem}rem
                  </span>
                </div>
              ))}
            </div>

            {/* Right: Controls + Code */}
            <div className="space-y-6">
              {/* Controls */}
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-5">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Settings</h2>

                {/* Base Size */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Base Size</Label>
                    <span className="text-xs font-mono text-muted-foreground">{baseSize}px</span>
                  </div>
                  <Slider min={10} max={28} step={1} value={[baseSize]} onValueChange={([v]) => setBaseSize(v)} />
                </div>

                {/* Ratio */}
                <div className="space-y-2">
                  <Label>Scale Ratio</Label>
                  <Select
                    value={isCustom ? "custom" : String(ratio)}
                    onValueChange={handleRatioSelect}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RATIOS.map((r) => (
                        <SelectItem key={r.value} value={String(r.value)}>
                          {r.name} ({r.value})
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Custom…</SelectItem>
                    </SelectContent>
                  </Select>
                  {isCustom && (
                    <Input
                      type="number"
                      min={1.01}
                      max={2.99}
                      step={0.001}
                      placeholder="e.g. 1.333"
                      value={customRatio}
                      onChange={(e) => handleCustomRatio(e.target.value)}
                      className="mt-2"
                    />
                  )}
                </div>

                {/* Font Family — searchable dropdown */}
                <div className="space-y-2">
                  <Label>Font Family</Label>
                  <div className="relative" ref={fontDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setFontDropdownOpen((o) => !o)}
                      className="flex w-full items-center justify-between gap-1.5 rounded-3xl border border-transparent bg-input/50 px-3 py-2 text-sm h-9 transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                      style={{ fontFamily: fontFamilyCSS }}
                    >
                      <span className="truncate">{displayFontName}</span>
                      <svg className="size-4 shrink-0 text-muted-foreground" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>

                    {fontDropdownOpen && (
                      <div className="absolute z-50 mt-1 w-full rounded-2xl bg-popover text-popover-foreground shadow-lg ring-1 ring-foreground/5 dark:ring-foreground/10 overflow-hidden">
                        {/* Search */}
                        <div className="flex items-center gap-2 px-3 py-2 border-b border-border/40">
                          <MagnifyingGlass className="size-4 text-muted-foreground shrink-0" />
                          <input
                            type="text"
                            placeholder="Search fonts…"
                            value={fontSearch}
                            onChange={(e) => setFontSearch(e.target.value)}
                            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                            autoFocus
                          />
                        </div>
                        <div className="max-h-64 overflow-y-auto p-1.5">
                          {/* Built-in */}
                          <p className="px-3 py-1.5 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Built-in</p>
                          {[
                            { key: "system", label: "System" },
                            { key: "figtree", label: "Figtree" },
                            { key: "georgia", label: "Georgia" },
                            { key: "mono", label: "Monospace" },
                          ]
                            .filter((f) => !fontSearch || f.label.toLowerCase().includes(fontSearch.toLowerCase()))
                            .map((f) => (
                              <button
                                key={f.key}
                                onClick={() => selectFont(f.key)}
                                className={`w-full text-left px-3 py-2 text-sm rounded-xl hover:bg-accent hover:text-accent-foreground transition-colors ${fontFamily === f.key ? "bg-accent text-accent-foreground" : ""}`}
                                style={{ fontFamily: BUILT_IN_FONTS[f.key] }}
                              >
                                {f.label}
                              </button>
                            ))}

                          {/* Google Fonts by category */}
                          {Object.entries(groupedFonts).map(([cat, fonts]) => (
                            <div key={cat}>
                              <p className="px-3 py-1.5 mt-2 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{cat}</p>
                              {fonts.map((f) => (
                                <button
                                  key={f.name}
                                  onClick={() => selectFont(f.name)}
                                  onMouseEnter={() => loadGoogleFont(f.name)}
                                  className={`w-full text-left px-3 py-2 text-sm rounded-xl hover:bg-accent hover:text-accent-foreground transition-colors ${fontFamily === f.name ? "bg-accent text-accent-foreground" : ""}`}
                                  style={{ fontFamily: `'${f.name}', sans-serif` }}
                                >
                                  {f.name}
                                </button>
                              ))}
                            </div>
                          ))}

                          {filteredFonts.length === 0 && !fontSearch.match(/system|figtree|georgia|mono/i) && (
                            <p className="px-3 py-4 text-sm text-muted-foreground text-center">No fonts found</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Line Height */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Line Height</Label>
                    <span className="text-xs font-mono text-muted-foreground">{lineHeight}</span>
                  </div>
                  <Slider min={1} max={2} step={0.05} value={[lineHeight]} onValueChange={([v]) => setLineHeight(Math.round(v * 100) / 100)} />
                </div>
              </div>

              {/* Code Output */}
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <Tabs defaultValue="css">
                  <div className="flex items-center justify-between mb-3">
                    <TabsList>
                      <TabsTrigger value="css">CSS</TabsTrigger>
                      <TabsTrigger value="tailwind">Tailwind</TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="css" className="relative">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="absolute top-2 right-2"
                      onClick={() => copy(cssCode, "css")}
                    >
                      {copiedTab === "css" ? <Check weight="bold" className="size-4" /> : <Copy className="size-4" />}
                    </Button>
                    <pre className="text-xs font-mono bg-muted/50 rounded-xl p-4 overflow-x-auto whitespace-pre">
                      {cssCode}
                    </pre>
                  </TabsContent>
                  <TabsContent value="tailwind" className="relative">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="absolute top-2 right-2"
                      onClick={() => copy(tailwindCode, "tailwind")}
                    >
                      {copiedTab === "tailwind" ? <Check weight="bold" className="size-4" /> : <Copy className="size-4" />}
                    </Button>
                    <pre className="text-xs font-mono bg-muted/50 rounded-xl p-4 overflow-x-auto whitespace-pre">
                      {tailwindCode}
                    </pre>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Info */}
              <p className="text-xs text-muted-foreground">
                Using <strong>{currentRatioName}</strong> ratio with {baseSize}px base → scale from{" "}
                {scale[0].px}px to {scale[scale.length - 1].px}px.
              </p>
            </div>
          </div>
        </main>
        <ToolContent about={typographyContent.about} faqs={typographyContent.faqs} />
        <ToolSchema name="Typography Scale Generator" description="Generate harmonious type scales with modular ratios and Google Fonts preview." url="/tools/typography-scale" faqs={typographyContent.faqs} />
        <Footer />
      </div>
    </>
  );
}
