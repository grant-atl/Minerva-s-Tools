import { useState, useCallback, useMemo } from "react";
import { Copy, MagnifyingGlass, Plus, X } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolContent from "@/components/ToolContent";
import ToolSchema from "@/components/ToolSchema";
import { tailwindColorFinderContent } from "@/lib/tool-content-data";
import {
  findNearest,
  parseColor,
  tailwindPalette,
  hueNames,
  shadeSteps,
} from "@/lib/tailwind-colors";

function copy(text: string, label: string) {
  navigator.clipboard.writeText(text);
  toast.success(`${label} copied`);
}

function contrastOnWhite(r: number, g: number, b: number): boolean {
  const lum = 0.2126 * (r / 255) ** 2.2 + 0.7152 * (g / 255) ** 2.2 + 0.0722 * (b / 255) ** 2.2;
  return lum < 0.4;
}

/* ── Single Color Finder ── */
function SingleFinder() {
  const [input, setInput] = useState("#3B82F6");
  const [pickerColor, setPickerColor] = useState("#3B82F6");

  const parsed = useMemo(() => parseColor(input), [input]);
  const matches = useMemo(
    () => (parsed ? findNearest(parsed[0], parsed[1], parsed[2], 5) : []),
    [parsed]
  );

  const handlePicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPickerColor(e.target.value);
    setInput(e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="flex gap-3 items-end">
        <input
          type="color"
          value={pickerColor}
          onChange={handlePicker}
          className="w-12 h-12 rounded-lg border border-border cursor-pointer shrink-0"
        />
        <div className="flex-1">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">HEX or RGB</label>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="#3B82F6 or rgb(59, 130, 246)"
            className="font-mono border-2 border-border focus-visible:border-primary"
          />
        </div>
      </div>

      {!parsed && input.length > 1 && (
        <p className="text-xs text-destructive">Invalid color — use #hex or rgb(r,g,b)</p>
      )}

      {/* Results */}
      {parsed && matches.length > 0 && (
        <div className="space-y-4">
          {/* Best match hero */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="grid sm:grid-cols-2">
              <div className="h-28 sm:h-auto" style={{ backgroundColor: input }} />
              <div className="h-28 sm:h-auto" style={{ backgroundColor: matches[0].hex }} />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Best match: <span className="font-mono">{matches[0].name}</span></p>
                <p className="text-xs text-muted-foreground">{matches[0].hex} · {matches[0].similarity}% similar</p>
              </div>
              <div className="flex gap-1.5">
                {["bg", "text", "border"].map((prefix) => (
                  <Button
                    key={prefix}
                    size="sm"
                    variant="outline"
                    className="text-xs font-mono h-7 px-2"
                    onClick={() => copy(`${prefix}-${matches[0].name}`, `${prefix}-${matches[0].name}`)}
                  >
                    {prefix}-
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Top 5 */}
          <div className="space-y-1.5">
            {matches.map((m, i) => (
              <div
                key={m.name}
                className="flex items-center gap-3 p-2 rounded-lg border border-border hover:bg-muted/30 transition-colors"
              >
                <span className="text-xs text-muted-foreground w-5 text-right">{i + 1}</span>
                <div
                  className="w-9 h-9 rounded-md border border-border shrink-0"
                  style={{ backgroundColor: m.hex }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.hex}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold">{m.similarity}%</p>
                  <p className="text-[10px] text-muted-foreground">similarity</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="shrink-0 h-8 w-8 p-0"
                  onClick={() => copy(`bg-${m.name}`, m.name)}
                >
                  <Copy size={14} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Batch Mode ── */
function BatchFinder() {
  const [input, setInput] = useState("");

  const results = useMemo(() => {
    return input
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 20)
      .map((raw) => {
        const parsed = parseColor(raw);
        if (!parsed) return { raw, match: null };
        const matches = findNearest(parsed[0], parsed[1], parsed[2], 1);
        return { raw, match: matches[0] || null };
      });
  }, [input]);

  const allClasses = results
    .filter((r) => r.match)
    .map((r) => `bg-${r.match!.name}`)
    .join(" ");

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">
          Paste multiple colors (one per line or comma-separated, max 20)
        </label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"#3B82F6\n#EF4444\nrgb(34, 197, 94)\n#F59E0B"}
          className="font-mono text-xs min-h-[120px] resize-y border-2 border-border focus-visible:border-primary"
        />
      </div>

      {results.length > 0 && (
        <>
          <div className="space-y-1.5">
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg border border-border">
                <div
                  className="w-8 h-8 rounded-md border border-border shrink-0"
                  style={{ backgroundColor: r.raw }}
                />
                <span className="text-xs font-mono text-muted-foreground w-24 shrink-0 truncate">{r.raw}</span>
                <span className="text-muted-foreground">→</span>
                {r.match ? (
                  <>
                    <div
                      className="w-8 h-8 rounded-md border border-border shrink-0"
                      style={{ backgroundColor: r.match.hex }}
                    />
                    <span className="text-sm font-mono font-medium flex-1">{r.match.name}</span>
                    <span className="text-xs text-muted-foreground">{r.match.similarity}%</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 shrink-0"
                      onClick={() => copy(`bg-${r.match!.name}`, r.match!.name)}
                    >
                      <Copy size={14} />
                    </Button>
                  </>
                ) : (
                  <span className="text-xs text-destructive">invalid</span>
                )}
              </div>
            ))}
          </div>

          {allClasses && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => copy(allClasses, "All classes")}
              className="gap-1.5"
            >
              <Copy size={14} weight="bold" />
              Copy all bg- classes
            </Button>
          )}
        </>
      )}
    </div>
  );
}

/* ── Full Palette Browser ── */
function PaletteBrowser() {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Click any swatch to copy its class name</p>
      <div className="space-y-2 overflow-x-auto">
        {hueNames.map((hue) => (
          <div key={hue} className="flex items-center gap-1">
            <span className="text-xs font-mono text-muted-foreground w-16 shrink-0 text-right pr-2">{hue}</span>
            {shadeSteps.map((shade) => {
              const hex = tailwindPalette[hue][shade];
              const name = `${hue}-${shade}`;
              const rgb = parseColor(hex);
              const light = rgb ? !contrastOnWhite(rgb[0], rgb[1], rgb[2]) : true;
              return (
                <button
                  key={shade}
                  onClick={() => copy(`bg-${name}`, name)}
                  className="w-10 h-10 rounded-md border border-border/50 text-[9px] font-mono flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shrink-0"
                  style={{ backgroundColor: hex, color: light ? "#1e293b" : "#f8fafc" }}
                  title={`${name} — ${hex}`}
                >
                  {shade}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main ── */
export default function TailwindColorFinder() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Tailwind Color Finder — Match Any Color to Tailwind CSS Classes | Minerva's Tools"
        description="Find the nearest Tailwind CSS color class for any HEX or RGB color. Top 5 matches with similarity %, batch mode, full palette browser. Free, instant, no sign-up."
        canonical="/tools/tailwind-color"
      />
      <ToolSchema
        name="Tailwind Color Finder"
        description="Find the nearest Tailwind CSS class for any color"
        url="/tools/tailwind-color"
        faqs={tailwindColorFinderContent.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 sm:px-6 pt-10 pb-20">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Tailwind Color Finder</h1>
            <p className="text-sm text-muted-foreground">
              Find the nearest Tailwind CSS class for any color
            </p>
          </div>
          <ShareToolButton toolName="Tailwind Color Finder" />
        </div>

        <Tabs defaultValue="single" className="space-y-6">
          <TabsList>
            <TabsTrigger value="single" className="gap-1.5">
              <MagnifyingGlass size={14} />
              Find Color
            </TabsTrigger>
            <TabsTrigger value="batch" className="gap-1.5">
              <Plus size={14} />
              Batch Mode
            </TabsTrigger>
            <TabsTrigger value="palette" className="gap-1.5">
              <Copy size={14} />
              Full Palette
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single"><SingleFinder /></TabsContent>
          <TabsContent value="batch"><BatchFinder /></TabsContent>
          <TabsContent value="palette"><PaletteBrowser /></TabsContent>
        </Tabs>
      </main>

      <ToolContent about={tailwindColorFinderContent.about} faqs={tailwindColorFinderContent.faqs} />
      <Footer />
    </div>
  );
}
