import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Copy, Check, MagnifyingGlass, UploadSimple, X } from "@phosphor-icons/react";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolContent from "@/components/ToolContent";
import ToolSchema from "@/components/ToolSchema";
import { fontPairingContent } from "@/lib/tool-content-data";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { GOOGLE_FONTS, loadGoogleFont } from "@/lib/google-fonts";

/* ── Presets ─────────────────────────────────────────────── */

const PRESETS = [
  { name: "Classic Editorial", heading: "Playfair Display", body: "Source Serif 4" },
  { name: "Modern SaaS", heading: "Space Grotesk", body: "Inter" },
  { name: "Friendly App", heading: "Nunito", body: "Open Sans" },
  { name: "Bold Marketing", heading: "Montserrat", body: "Lora" },
  { name: "Tech Docs", heading: "DM Sans", body: "JetBrains Mono" },
  { name: "Elegant", heading: "Cormorant Garamond", body: "Raleway" },
  { name: "Startup", heading: "Plus Jakarta Sans", body: "DM Sans" },
  { name: "Magazine", heading: "Fraunces", body: "Work Sans" },
];

/* ── Font Picker ─────────────────────────────────────────── */

interface FontSlot {
  name: string;
  isCustom: boolean;
}

function FontPicker({
  label,
  slot,
  onSelect,
  onUpload,
  onClearCustom,
}: {
  label: string;
  slot: FontSlot;
  onSelect: (name: string) => void;
  onUpload: (file: File) => void;
  onClearCustom: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return GOOGLE_FONTS;
    return GOOGLE_FONTS.filter((f) => f.name.toLowerCase().includes(q));
  }, [search]);

  const grouped = useMemo(() => {
    const g: Record<string, typeof GOOGLE_FONTS> = {};
    for (const f of filtered) (g[f.category] ??= []).push(f);
    return g;
  }, [filtered]);

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-1.5 rounded-3xl border border-transparent bg-input/50 px-3 py-2 text-sm h-9 transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          style={{ fontFamily: slot.isCustom ? slot.name : `'${slot.name}', sans-serif` }}
        >
          <span className="truncate">
            {slot.name}
            {slot.isCustom && (
              <span className="ml-1.5 text-[10px] font-mono text-muted-foreground uppercase">Custom</span>
            )}
          </span>
          <svg className="size-4 shrink-0 text-muted-foreground" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-2xl bg-popover text-popover-foreground shadow-lg ring-1 ring-foreground/5 dark:ring-foreground/10 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border/40">
              <MagnifyingGlass className="size-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search fonts…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                autoFocus
              />
            </div>
            <div className="max-h-64 overflow-y-auto p-1.5">
              {/* Upload custom */}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-xl hover:bg-accent hover:text-accent-foreground transition-colors text-muted-foreground"
              >
                <UploadSimple className="size-4" />
                Upload custom font…
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".woff2,.ttf,.otf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    onUpload(f);
                    setOpen(false);
                    setSearch("");
                  }
                  e.target.value = "";
                }}
              />

              {slot.isCustom && (
                <button
                  type="button"
                  onClick={() => { onClearCustom(); setOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-xl hover:bg-accent hover:text-accent-foreground transition-colors text-muted-foreground"
                >
                  <X className="size-4" />
                  Remove custom font
                </button>
              )}

              {Object.entries(grouped).map(([cat, fonts]) => (
                <div key={cat}>
                  <p className="px-3 py-1.5 mt-2 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{cat}</p>
                  {fonts.map((f) => (
                    <button
                      key={f.name}
                      onClick={() => { onSelect(f.name); setOpen(false); setSearch(""); }}
                      onMouseEnter={() => loadGoogleFont(f.name)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-xl hover:bg-accent hover:text-accent-foreground transition-colors ${slot.name === f.name && !slot.isCustom ? "bg-accent text-accent-foreground" : ""}`}
                      style={{ fontFamily: `'${f.name}', sans-serif` }}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              ))}

              {filtered.length === 0 && (
                <p className="px-3 py-4 text-sm text-muted-foreground text-center">No fonts found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */

export default function FontPairing() {
  const { toast } = useToast();
  const [heading, setHeading] = useState<FontSlot>({ name: "Playfair Display", isCustom: false });
  const [body, setBody] = useState<FontSlot>({ name: "Inter", isCustom: false });
  const [baseSize, setBaseSize] = useState(16);
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  // Load Google Fonts on mount / change
  useEffect(() => {
    if (!heading.isCustom) loadGoogleFont(heading.name);
  }, [heading]);
  useEffect(() => {
    if (!body.isCustom) loadGoogleFont(body.name);
  }, [body]);

  const handleUpload = useCallback(async (file: File, target: "heading" | "body") => {
    try {
      const buffer = await file.arrayBuffer();
      const baseName = file.name.replace(/\.(woff2|ttf|otf)$/i, "");
      const faceName = `Custom-${target}-${baseName}`;
      const face = new FontFace(faceName, buffer);
      await face.load();
      document.fonts.add(face);
      const slot: FontSlot = { name: faceName, isCustom: true };
      if (target === "heading") setHeading(slot);
      else setBody(slot);
      toast({ title: `Loaded "${baseName}" as ${target} font` });
    } catch {
      toast({ title: "Failed to load font file", variant: "destructive" });
    }
  }, [toast]);

  const applyPreset = (p: typeof PRESETS[number]) => {
    setHeading({ name: p.heading, isCustom: false });
    setBody({ name: p.body, isCustom: false });
  };

  const randomize = useCallback(() => {
    const h = GOOGLE_FONTS[Math.floor(Math.random() * GOOGLE_FONTS.length)];
    let b = GOOGLE_FONTS[Math.floor(Math.random() * GOOGLE_FONTS.length)];
    while (b.name === h.name) b = GOOGLE_FONTS[Math.floor(Math.random() * GOOGLE_FONTS.length)];
    setHeading({ name: h.name, isCustom: false });
    setBody({ name: b.name, isCustom: false });
  }, []);

  // Space to randomize
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" && !["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        randomize();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [randomize]);

  const headingFamily = heading.isCustom ? heading.name : `'${heading.name}', sans-serif`;
  const bodyFamily = body.isCustom ? body.name : `'${body.name}', sans-serif`;

  const cssCode = useMemo(() => {
    const hFont = heading.isCustom ? heading.name : `'${heading.name}', sans-serif`;
    const bFont = body.isCustom ? body.name : `'${body.name}', sans-serif`;
    return `:root {
  --font-heading: ${hFont};
  --font-body: ${bFont};
  --font-size-base: ${baseSize}px;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
}

body, p, li, td {
  font-family: var(--font-body);
  font-size: var(--font-size-base);
}`;
  }, [heading, body, baseSize]);

  const tailwindCode = useMemo(() => {
    const hFont = heading.isCustom ? heading.name : `'${heading.name}'`;
    const bFont = body.isCustom ? body.name : `'${body.name}'`;
    return `// tailwind.config.ts
theme: {
  fontFamily: {
    heading: [${hFont}, 'sans-serif'],
    body: [${bFont}, 'sans-serif'],
  },
  fontSize: {
    base: '${baseSize}px',
  },
}`;
  }, [heading, body, baseSize]);

  const copy = async (text: string, tab: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedTab(tab);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopiedTab(null), 2000);
  };

  return (
    <>
      <SEO
        title="Font Pairing Tool — Find Perfect Font Combinations | Minerva's Tools"
        description="Discover beautiful heading + body font pairings from 30+ Google Fonts. Upload custom fonts, preview in real layouts, and export CSS or Tailwind config."
        canonical="/tools/font-pairing"
      />
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <HomeNav />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Font Pairing</h1>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl">
                Find beautiful heading + body font combinations. Pick from 30+ Google Fonts or upload your own, then preview in real layouts.
              </p>
            </div>
            <ShareToolButton toolName="Font Pairing Tool" />
          </div>

          {/* Presets */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {PRESETS.map((p) => (
              <Button key={p.name} variant="outline" size="sm" onClick={() => applyPreset(p)}>
                {p.name}
              </Button>
            ))}
            <span className="text-xs text-muted-foreground ml-2">
              Press <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted font-mono text-[11px]">Space</kbd> to randomize
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
            {/* Left: Previews */}
            <div className="space-y-6">
              {/* Hero Preview */}
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4">
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-2">Hero</p>
                <h2
                  className="text-3xl sm:text-4xl font-bold leading-tight"
                  style={{ fontFamily: headingFamily }}
                >
                  The quick brown fox jumps over the lazy dog
                </h2>
                <p
                  className="text-muted-foreground leading-relaxed"
                  style={{ fontFamily: bodyFamily, fontSize: `${baseSize}px` }}
                >
                  Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. Good font pairing creates visual hierarchy and guides the reader's eye through your content naturally.
                </p>
              </div>

              {/* Article Preview */}
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4">
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-2">Article</p>
                <h2
                  className="text-2xl font-bold"
                  style={{ fontFamily: headingFamily }}
                >
                  Getting Started with Design Systems
                </h2>
                <h3
                  className="text-xl font-semibold text-muted-foreground"
                  style={{ fontFamily: headingFamily }}
                >
                  Why consistency matters
                </h3>
                <p
                  className="leading-relaxed"
                  style={{ fontFamily: bodyFamily, fontSize: `${baseSize}px` }}
                >
                  A design system is a collection of reusable components, guided by clear standards, that can be assembled to build any number of applications. It bridges the gap between design and development, ensuring consistency across products.
                </p>
                <blockquote
                  className="border-l-2 border-primary pl-4 italic text-muted-foreground"
                  style={{ fontFamily: bodyFamily, fontSize: `${baseSize}px` }}
                >
                  "Design is not just what it looks like and feels like. Design is how it works."
                </blockquote>
                <h3
                  className="text-lg font-semibold"
                  style={{ fontFamily: headingFamily }}
                >
                  Building blocks
                </h3>
                <p
                  className="leading-relaxed"
                  style={{ fontFamily: bodyFamily, fontSize: `${baseSize}px` }}
                >
                  Start with typography, color, and spacing tokens. These foundational elements create the visual language everything else builds on. Pair a distinctive heading font with a readable body font to establish clear hierarchy.
                </p>
              </div>

              {/* Card Preview */}
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-4">Card UI</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: "Analytics Dashboard", desc: "Track your key metrics with real-time charts and custom reports." },
                    { title: "Team Collaboration", desc: "Share designs, leave comments, and iterate together in one place." },
                  ].map((card) => (
                    <div key={card.title} className="rounded-xl border border-border bg-background p-4 space-y-2">
                      <h4
                        className="font-semibold"
                        style={{ fontFamily: headingFamily }}
                      >
                        {card.title}
                      </h4>
                      <p
                        className="text-sm text-muted-foreground leading-relaxed"
                        style={{ fontFamily: bodyFamily }}
                      >
                        {card.desc}
                      </p>
                      <button
                        className="text-sm font-medium text-primary hover:underline"
                        style={{ fontFamily: bodyFamily }}
                      >
                        Learn more →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-5">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Font Selection</h2>

                <FontPicker
                  label="Heading Font"
                  slot={heading}
                  onSelect={(n) => setHeading({ name: n, isCustom: false })}
                  onUpload={(f) => handleUpload(f, "heading")}
                  onClearCustom={() => setHeading({ name: "Playfair Display", isCustom: false })}
                />

                <FontPicker
                  label="Body Font"
                  slot={body}
                  onSelect={(n) => setBody({ name: n, isCustom: false })}
                  onUpload={(f) => handleUpload(f, "body")}
                  onClearCustom={() => setBody({ name: "Inter", isCustom: false })}
                />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Base Font Size</Label>
                    <span className="text-xs font-mono text-muted-foreground">{baseSize}px</span>
                  </div>
                  <Slider min={12} max={24} step={1} value={[baseSize]} onValueChange={([v]) => setBaseSize(v)} />
                </div>
              </div>

              {/* Code Export */}
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <Tabs defaultValue="css">
                  <div className="flex items-center justify-between mb-3">
                    <TabsList>
                      <TabsTrigger value="css">CSS</TabsTrigger>
                      <TabsTrigger value="tailwind">Tailwind</TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="css" className="relative">
                    <Button variant="ghost" size="icon-sm" className="absolute top-2 right-2" onClick={() => copy(cssCode, "css")}>
                      {copiedTab === "css" ? <Check weight="bold" className="size-4" /> : <Copy className="size-4" />}
                    </Button>
                    <pre className="text-xs font-mono bg-muted/50 rounded-xl p-4 overflow-x-auto whitespace-pre">{cssCode}</pre>
                  </TabsContent>
                  <TabsContent value="tailwind" className="relative">
                    <Button variant="ghost" size="icon-sm" className="absolute top-2 right-2" onClick={() => copy(tailwindCode, "tailwind")}>
                      {copiedTab === "tailwind" ? <Check weight="bold" className="size-4" /> : <Copy className="size-4" />}
                    </Button>
                    <pre className="text-xs font-mono bg-muted/50 rounded-xl p-4 overflow-x-auto whitespace-pre">{tailwindCode}</pre>
                  </TabsContent>
                </Tabs>
              </div>

              <p className="text-xs text-muted-foreground">
                Heading: <strong>{heading.name}</strong> · Body: <strong>{body.name}</strong> · Base: {baseSize}px
              </p>
            </div>
          </div>
        </main>
        <ToolContent about={fontPairingContent.about} faqs={fontPairingContent.faqs} />
        <ToolSchema name="Font Pairing Tool" description="Discover beautiful heading and body font combinations from Google Fonts or custom uploads. Preview in real layouts and export CSS or Tailwind config." url="/tools/font-pairing" faqs={fontPairingContent.faqs} />
        <Footer />
      </div>
    </>
  );
}
