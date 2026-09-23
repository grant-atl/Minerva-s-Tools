import { useState, useMemo, useRef } from "react";
import { Copy, ArrowsDownUp } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolContent from "@/components/ToolContent";
import ToolSchema from "@/components/ToolSchema";
import { contrastContent } from "@/lib/tool-content-data";
import { hexToRgb, rgbToHsl, formatRgb, formatHsl, contrastRatio, wcagLevel } from "@/lib/color-utils";

const isValidHex = (v: string) => /^#[0-9A-Fa-f]{6}$/.test(v);

export default function ContrastChecker() {
  const [fg, setFg] = useState("#1e293b");
  const [bg, setBg] = useState("#ffffff");

  const ratio = useMemo(() => {
    if (!isValidHex(fg) || !isValidHex(bg)) return null;
    return contrastRatio(hexToRgb(fg), hexToRgb(bg));
  }, [fg, bg]);

  const level = ratio ? wcagLevel(ratio) : null;

  const swap = () => { setFg(bg); setBg(fg); };

  const copyResult = () => {
    if (!ratio) return;
    navigator.clipboard.writeText(`Contrast ratio: ${ratio.toFixed(2)}:1 — FG: ${fg} / BG: ${bg}`);
    toast.success("Copied contrast result");
  };

  const fgRgb = isValidHex(fg) ? hexToRgb(fg) : null;
  const bgRgb = isValidHex(bg) ? hexToRgb(bg) : null;
  const fgHsl = fgRgb ? rgbToHsl(fgRgb) : null;
  const bgHsl = bgRgb ? rgbToHsl(bgRgb) : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Color Contrast Checker — Minerva's Tools"
        description="Check foreground and background colors against WCAG AA and AAA text contrast thresholds."
        canonical="/tools/contrast"
      />
      <HomeNav />

      <main className="flex-1 flex flex-col">
      {/* Toolbar */}
      <div className="border-b border-border">
        <div className="container mx-auto flex flex-col items-start gap-3 px-4 py-3 sm:flex-row sm:items-center sm:px-6">
          <h1 className="text-sm font-semibold text-foreground">Contrast Checker</h1>
          <div className="flex w-full flex-wrap items-center gap-2 sm:ml-auto sm:w-auto">
            <Button size="sm" variant="outline" onClick={copyResult} className="gap-1.5">
              <Copy size={14} weight="bold" />
              Copy Result
            </Button>
            <ShareToolButton toolName="Contrast Checker" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Color inputs */}
        <div className="border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 py-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <ColorField label="Foreground" value={fg} onChange={setFg} />
              <Button size="icon" variant="ghost" onClick={swap} className="shrink-0" title="Swap colors">
                <ArrowsDownUp size={20} />
              </Button>
              <ColorField label="Background" value={bg} onChange={setBg} />
            </div>
          </div>
        </div>

        {/* Ratio display */}
        <div className="border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 py-8 text-center">
            {ratio !== null ? (
              <>
                <p className="text-5xl font-bold text-foreground mb-1">{ratio.toFixed(2)}:1</p>
                <p className="text-sm text-muted-foreground">Contrast Ratio</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Enter valid HEX colors to check contrast</p>
            )}
          </div>
        </div>

        {/* WCAG results */}
        {level && (
          <div className="border-b border-border">
            <div className="container mx-auto px-4 sm:px-6 py-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <WcagCard title="AA Normal" subtitle="≥ 4.5:1" pass={level.aa} />
                <WcagCard title="AA Large" subtitle="≥ 3:1" pass={level.aaLarge} />
                <WcagCard title="AAA Normal" subtitle="≥ 7:1" pass={level.aaa} />
                <WcagCard title="AAA Large" subtitle="≥ 4.5:1" pass={level.aaaLarge} />
              </div>
            </div>
          </div>
        )}

        {/* Live preview */}
        {isValidHex(fg) && isValidHex(bg) && (
          <div className="flex-1">
            <div className="container mx-auto px-4 sm:px-6 py-8">
              <h2 className="text-xs font-semibold text-foreground mb-4">Live Preview</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Text on background */}
                <div className="rounded-xl border border-border overflow-hidden shadow-sm">
                  <div className="px-8 py-10" style={{ backgroundColor: bg, color: fg }}>
                    <h3 className="text-2xl font-bold mb-2">Heading Text</h3>
                    <p className="text-base mb-4">
                      This is body text rendered with your selected foreground color on the background color. Check readability at different sizes.
                    </p>
                    <p className="text-sm mb-3">
                      Small text is harder to read and requires higher contrast ratios to meet WCAG AAA guidelines.
                    </p>
                    <p className="text-xs">
                      Extra small text — if you can read this comfortably, contrast is likely sufficient.
                    </p>
                  </div>
                </div>

                {/* UI mockup */}
                <div className="rounded-xl border border-border overflow-hidden shadow-sm" style={{ backgroundColor: bg }}>
                  <div className="px-6 py-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full" style={{ backgroundColor: fg }} />
                      <div>
                        <p className="text-sm font-semibold" style={{ color: fg }}>Jane Cooper</p>
                        <p className="text-xs opacity-70" style={{ color: fg }}>jane@example.com</p>
                      </div>
                    </div>
                    <div className="rounded-lg px-4 py-3 border" style={{ borderColor: fg + "30" }}>
                      <p className="text-sm" style={{ color: fg }}>A sample card component using your color pairing.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        className="px-5 py-2 rounded-full text-sm font-medium"
                        style={{ backgroundColor: fg, color: bg }}
                      >
                        Primary Button
                      </button>
                      <button
                        className="px-5 py-2 rounded-full text-sm font-medium border"
                        style={{ borderColor: fg, color: fg, backgroundColor: "transparent" }}
                      >
                        Outline Button
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Color details */}
            <div className="container mx-auto px-4 sm:px-6 pb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fgRgb && fgHsl && (
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: fg }} />
                      <span className="text-xs font-semibold text-foreground">Foreground</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs font-mono text-muted-foreground">
                      <span>{fg.toUpperCase()}</span>
                      <span>{formatRgb(fgRgb)}</span>
                      <span>{formatHsl(fgHsl)}</span>
                    </div>
                  </div>
                )}
                {bgRgb && bgHsl && (
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: bg }} />
                      <span className="text-xs font-semibold text-foreground">Background</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs font-mono text-muted-foreground">
                      <span>{bg.toUpperCase()}</span>
                      <span>{formatRgb(bgRgb)}</span>
                      <span>{formatHsl(bgHsl)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <ToolContent about={contrastContent.about} faqs={contrastContent.faqs} />
      <ToolSchema name="Color Contrast Checker" description="Test WCAG AA & AAA color contrast compliance for any color pair." url="/tools/contrast" faqs={contrastContent.faqs} />
      </main>
      <Footer />
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex-1 w-full">
      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="color"
          value={isValidHex(value) ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="w-10 h-10 rounded-lg border border-border shadow-sm cursor-pointer shrink-0"
          style={{ backgroundColor: isValidHex(value) ? value : "#000" }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            let v = e.target.value;
            if (!v.startsWith("#")) v = "#" + v;
            onChange(v);
          }}
          className="h-10 flex-1 rounded-lg border border-border bg-background px-3 font-mono text-sm text-foreground outline-none focus:border-primary transition-colors"
          placeholder="#000000"
          maxLength={7}
        />
      </div>
    </div>
  );
}

function WcagCard({ title, subtitle, pass }: { title: string; subtitle: string; pass: boolean }) {
  return (
    <div className={`rounded-lg border p-4 text-center transition-colors ${
      pass ? "border-green-500/30 bg-green-500/5" : "border-border"
    }`}>
      <Badge variant={pass ? "default" : "secondary"} className="mb-2">
        {pass ? "Pass" : "Fail"}
      </Badge>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}
