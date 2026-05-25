import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Lock, LockOpen, Copy, ArrowsClockwise, PencilSimple } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import HomeNav from "@/components/HomeNav";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolContent from "@/components/ToolContent";
import ToolSchema from "@/components/ToolSchema";
import { paletteContent } from "@/lib/tool-content-data";
import ShareToolButton from "@/components/ShareToolButton";
import {
  type PaletteColor,
  type HarmonyMode,
  generatePalette,
  textColorForBg,
  formatRgb,
  formatHsl,
  contrastRatio,
  wcagLevel,
  hexToRgb,
  rgbToHsl,
} from "@/lib/color-utils";

type ColorFormat = "hex" | "rgb" | "hsl";

const HARMONY_MODES: { value: HarmonyMode; label: string }[] = [
  { value: "random", label: "Random" },
  { value: "analogous", label: "Analogous" },
  { value: "complementary", label: "Complementary" },
  { value: "triadic", label: "Triadic" },
  { value: "split-complementary", label: "Split-Comp" },
  { value: "monochromatic", label: "Monochromatic" },
];

const PALETTE_PRESETS: { name: string; colors: string[] }[] = [
  { name: "Sunset Vibes", colors: ["#ff6b35", "#f7931e", "#fcb045", "#f37335", "#c62828"] },
  { name: "Ocean Breeze", colors: ["#0077b6", "#00b4d8", "#90e0ef", "#caf0f8", "#023e8a"] },
  { name: "Forest", colors: ["#2d6a4f", "#40916c", "#52b788", "#74c69d", "#b7e4c7"] },
  { name: "Berry", colors: ["#7b2d8e", "#c2185b", "#e91e63", "#f48fb1", "#4a148c"] },
  { name: "Earth Tones", colors: ["#6d4c41", "#8d6e63", "#bcaaa4", "#d7ccc8", "#3e2723"] },
  { name: "Pastel Dream", colors: ["#ffd6e0", "#c9e4de", "#c6def1", "#f2c6de", "#dbcdf0"] },
  { name: "Cyberpunk", colors: ["#0d0221", "#0f084b", "#26408b", "#a6f0c6", "#f72585"] },
  { name: "Autumn", colors: ["#bc4749", "#e76f51", "#f4a261", "#e9c46a", "#2a9d8f"] },
  { name: "Monochrome", colors: ["#212121", "#424242", "#757575", "#bdbdbd", "#eeeeee"] },
  { name: "Candy", colors: ["#ff6f91", "#ff9671", "#ffc75f", "#f9f871", "#d65db1"] },
];
const isValidHex = (hex: string): boolean => /^#?([0-9A-Fa-f]{6})$/.test(hex);


export default function PaletteGenerator() {
  const [mode, setMode] = useState<HarmonyMode>("random");
  const [colors, setColors] = useState<PaletteColor[]>(() => generatePalette("random"));
  const [format, setFormat] = useState<ColorFormat>("hex");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [onlyAccessible, setOnlyAccessible] = useState(false);

  const regenerate = useCallback(() => {
    const maxAttempts = onlyAccessible ? 500 : 1;
    setColors((prev) => {
      let best = prev;
      let bestCount = -1;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const fresh = generatePalette(mode);
        const candidate = prev.map((c, i) => (c.locked ? c : fresh[i]));
        if (!onlyAccessible) return candidate;
        // Count AA-passing pairs (ratio >= 4.5)
        let aaPairs = 0;
        for (let i = 0; i < candidate.length; i++) {
          for (let j = i + 1; j < candidate.length; j++) {
            if (contrastRatio(candidate[i].rgb, candidate[j].rgb) >= 4.5) aaPairs++;
          }
        }
        if (aaPairs >= 6) return candidate;
        if (aaPairs > bestCount) { best = candidate; bestCount = aaPairs; }
      }
      toast.info(`Best attempt has ${bestCount} accessible pairs`);
      return best;
    });
  }, [mode, onlyAccessible]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body && editingIndex === null) {
        e.preventDefault();
        regenerate();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [regenerate, editingIndex]);

  const toggleLock = (index: number) => {
    setColors((prev) =>
      prev.map((c, i) => (i === index ? { ...c, locked: !c.locked } : c))
    );
  };

  const getFormattedValue = (c: PaletteColor): string => {
    if (format === "rgb") return formatRgb(c.rgb);
    if (format === "hsl") return formatHsl(c.hsl);
    return c.hex.toUpperCase();
  };

  const copyColor = (c: PaletteColor) => {
    const value = getFormattedValue(c);
    navigator.clipboard.writeText(value);
    toast.success(`Copied ${value}`);
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(colors[index].hex.toUpperCase());
  };

  const commitEdit = () => {
    if (editingIndex === null) return;
    let hex = editValue.trim();
    if (!hex.startsWith("#")) hex = "#" + hex;
    if (!isValidHex(hex)) {
      toast.error("Invalid HEX color");
      setEditingIndex(null);
      return;
    }
    hex = hex.toLowerCase();
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb);
    setColors((prev) =>
      prev.map((c, i) => (i === editingIndex ? { ...c, hex, rgb, hsl } : c))
    );
    setEditingIndex(null);
  };

  const handleColorPicker = (index: number, hex: string) => {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb);
    setColors((prev) =>
      prev.map((c, i) => (i === index ? { ...c, hex, rgb, hsl } : c))
    );
  };

  const loadPreset = (preset: typeof PALETTE_PRESETS[number]) => {
    setColors(preset.colors.map((hex) => {
      const rgb = hexToRgb(hex);
      const hsl = rgbToHsl(rgb);
      return { hex, rgb, hsl, locked: false };
    }));
  };

  // Contrast stats
  const pairs: { i: number; j: number; ratio: number }[] = [];
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      pairs.push({ i, j, ratio: contrastRatio(colors[i].rgb, colors[j].rgb) });
    }
  }
  const displayPairs = onlyAccessible ? pairs.filter((p) => p.ratio >= 4.5) : pairs;
  const bestPair = pairs.reduce((a, b) => (b.ratio > a.ratio ? b : a), pairs[0]);
  const accessiblePairs = pairs.filter((p) => p.ratio >= 4.5).length;
  const avgContrast = pairs.reduce((s, p) => s + p.ratio, 0) / pairs.length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Color Palette Generator — Minerva"
        description="Generate harmonious color palettes with analogous, complementary, triadic, and monochromatic modes. Copy HEX, RGB, HSL. Built-in WCAG contrast checker."
        canonical="/tools/palette"
      />

      <HomeNav />

      {/* Toolbar */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3">
          <h1 className="text-sm font-semibold text-foreground">Color Palette Generator</h1>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="flex rounded-lg border border-border overflow-hidden text-xs">
              {(["hex", "rgb", "hsl"] as ColorFormat[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`px-2.5 py-1.5 uppercase font-medium transition-colors ${
                    format === f
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <Select value={mode} onValueChange={(v) => setMode(v as HarmonyMode)}>
              <SelectTrigger className="w-[150px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HARMONY_MODES.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <ShareToolButton toolName="Color Palette Generator" />

            <Button size="sm" onClick={regenerate} className="gap-1.5">
              <ArrowsClockwise size={14} weight="bold" />
              Generate
            </Button>
          </div>
        </div>
      </div>

      {/* Preset Gallery */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <h2 className="text-xs font-semibold text-foreground mb-3">Presets</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {PALETTE_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => loadPreset(preset)}
                className="flex-shrink-0 group"
                title={preset.name}
              >
                <div className="flex h-10 w-20 rounded-lg border border-border overflow-hidden shadow-sm transition-transform group-hover:scale-105">
                  {preset.colors.map((c, i) => (
                    <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 text-center group-hover:text-foreground transition-colors">
                  {preset.name}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Palette Swatches */}
      <div className="flex-1 flex flex-col md:flex-row">
        {colors.map((color, index) => {
          const textColor = textColorForBg(color.hex);
          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center justify-end gap-3 py-8 md:py-0 md:pb-10 min-h-[140px] md:min-h-0 transition-colors duration-200"
              style={{ backgroundColor: color.hex }}
            >
              {/* Lock */}
              <button
                onClick={() => toggleLock(index)}
                className="p-2 rounded-full transition-colors hover:bg-black/10"
                style={{ color: textColor }}
                title={color.locked ? "Unlock" : "Lock"}
              >
                {color.locked ? <Lock size={20} weight="fill" /> : <LockOpen size={20} />}
              </button>

              {/* Edit / Color picker */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => startEdit(index)}
                  className="p-1.5 rounded-full transition-colors hover:bg-black/10"
                  style={{ color: textColor }}
                  title="Edit color"
                >
                  <PencilSimple size={14} />
                </button>
                <ColorPickerInput
                  color={color.hex}
                  textColor={textColor}
                  onChange={(hex) => handleColorPicker(index, hex)}
                />
              </div>

              {/* Color value or inline edit */}
              {editingIndex === index ? (
                <input
                  autoFocus
                  className="bg-black/20 backdrop-blur-sm text-center font-mono text-sm font-medium px-3 py-1.5 rounded-lg border-none outline-none w-28"
                  style={{ color: textColor }}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitEdit();
                    if (e.key === "Escape") setEditingIndex(null);
                  }}
                  onBlur={commitEdit}
                />
              ) : (
                <button
                  onClick={() => copyColor(color)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-sm font-medium transition-colors hover:bg-black/10"
                  style={{ color: textColor }}
                  title="Click to copy"
                >
                  {getFormattedValue(color)}
                  <Copy size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Contrast Stats */}
      <div className="border-t border-border bg-card">
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Palette Contrast Stats</h2>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-muted-foreground">Only accessible</span>
                    <Switch checked={onlyAccessible} onCheckedChange={setOnlyAccessible} />
                  </label>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[260px] text-center">
                  AA does not require a fixed number of accessible color pairs — we will try to find a palette with 6 to 12 pairs.
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="rounded-lg border border-border p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{avgContrast.toFixed(1)}:1</p>
              <p className="text-xs text-muted-foreground mt-1">Average Contrast</p>
            </div>
            <div className="rounded-lg border border-border p-4 text-center">
              <p className="text-2xl font-bold text-foreground">
                {accessiblePairs}/{pairs.length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">AA Accessible Pairs</p>
            </div>
            <div className="rounded-lg border border-border p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span
                  className="inline-block w-5 h-5 rounded-full border border-border"
                  style={{ backgroundColor: colors[bestPair.i].hex }}
                />
                <span
                  className="inline-block w-5 h-5 rounded-full border border-border"
                  style={{ backgroundColor: colors[bestPair.j].hex }}
                />
              </div>
              <p className="text-lg font-bold text-foreground">{bestPair.ratio.toFixed(1)}:1</p>
              <p className="text-xs text-muted-foreground mt-1">Best Contrast Pair</p>
            </div>
          </div>

          {displayPairs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No accessible pairings found. Try generating a new palette.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Pair</th>
                    <th className="text-center py-2 px-2 font-medium text-muted-foreground">Ratio</th>
                    <th className="text-center py-2 px-2 font-medium text-muted-foreground">AA</th>
                    <th className="text-center py-2 px-2 font-medium text-muted-foreground">AA Large</th>
                    <th className="text-center py-2 px-2 font-medium text-muted-foreground">AAA</th>
                    <th className="text-center py-2 px-2 font-medium text-muted-foreground">AAA Large</th>
                  </tr>
                </thead>
                <tbody>
                  {displayPairs.map(({ i, j, ratio }) => {
                    const level = wcagLevel(ratio);
                    return (
                      <tr key={`${i}-${j}`} className="border-b border-border last:border-0">
                        <td className="py-2 pr-4">
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-block w-4 h-4 rounded-full border border-border"
                              style={{ backgroundColor: colors[i].hex }}
                            />
                            <span
                              className="inline-block w-4 h-4 rounded-full border border-border"
                              style={{ backgroundColor: colors[j].hex }}
                            />
                            <span className="text-muted-foreground font-mono">
                              {colors[i].hex.toUpperCase()} / {colors[j].hex.toUpperCase()}
                            </span>
                          </div>
                        </td>
                        <td className="text-center py-2 px-2 font-mono font-medium text-foreground">
                          {ratio.toFixed(2)}:1
                        </td>
                        <td className="text-center py-2 px-2">
                          <PassFail pass={level.aa} />
                        </td>
                        <td className="text-center py-2 px-2">
                          <PassFail pass={level.aaLarge} />
                        </td>
                        <td className="text-center py-2 px-2">
                          <PassFail pass={level.aaa} />
                        </td>
                        <td className="text-center py-2 px-2">
                          <PassFail pass={level.aaaLarge} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-4 text-center">
            Press <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted font-mono text-[10px]">Space</kbd> to generate a new palette
          </p>
        </div>
      </div>

      <ToolContent about={paletteContent.about} faqs={paletteContent.faqs} />
      <ToolSchema name="Color Palette Generator" description="Generate harmonious color palettes with WCAG contrast analysis." url="/tools/palette" faqs={paletteContent.faqs} />
      <Footer />
    </div>
  );
}

function ColorPickerInput({
  color,
  textColor,
  onChange,
}: {
  color: string;
  textColor: string;
  onChange: (hex: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
        tabIndex={-1}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="w-5 h-5 rounded-full border-2 cursor-pointer"
        style={{ backgroundColor: color, borderColor: textColor + "40" }}
        title="Pick color"
      />
    </>
  );
}

function PassFail({ pass }: { pass: boolean }) {
  return (
    <Badge variant={pass ? "default" : "secondary"} className="text-[10px] px-1.5">
      {pass ? "Pass" : "Fail"}
    </Badge>
  );
}
