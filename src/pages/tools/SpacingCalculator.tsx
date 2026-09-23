import { useState, useCallback, useMemo } from "react";
import { Copy, ArrowsOutSimple } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolContent from "@/components/ToolContent";
import ToolSchema from "@/components/ToolSchema";
import { spacingCalcContent } from "@/lib/tool-content-data";

interface Preset {
  name: string;
  base: number;
  method: "linear" | "geometric";
  multiplier: number;
  steps: number;
  unit: "px" | "rem";
}

const presets: Preset[] = [
  { name: "Material Design (4px)", base: 4, method: "linear", multiplier: 1, steps: 16, unit: "px" },
  { name: "Tailwind Default", base: 4, method: "linear", multiplier: 1, steps: 16, unit: "rem" },
  { name: "Bootstrap", base: 4, method: "linear", multiplier: 1, steps: 12, unit: "rem" },
  { name: "8pt Grid", base: 8, method: "linear", multiplier: 1, steps: 12, unit: "px" },
  { name: "Golden Ratio", base: 4, method: "geometric", multiplier: 1.618, steps: 10, unit: "px" },
  { name: "Major Third", base: 4, method: "geometric", multiplier: 1.25, steps: 12, unit: "rem" },
];

const tailwindLabels = ["0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "5", "6", "7", "8", "9", "10", "11", "12", "14", "16", "20", "24"];
const bootstrapMultipliers = [0, 0.25, 0.5, 1, 1.5, 3, 4, 5, 6, 8, 10, 12];

function generateScale(base: number, method: "linear" | "geometric", multiplier: number, steps: number, presetName: string): number[] {
  if (presetName === "Tailwind Default") {
    return [2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48].slice(0, steps);
  }
  if (presetName === "Bootstrap") {
    return bootstrapMultipliers.slice(0, steps).map((m) => Math.round(base * 4 * m));
  }

  const values: number[] = [];
  for (let i = 1; i <= steps; i++) {
    if (method === "linear") {
      values.push(Math.round(base * i * 100) / 100);
    } else {
      values.push(Math.round(base * Math.pow(multiplier, i - 1) * 100) / 100);
    }
  }
  return values;
}

function toUnit(px: number, unit: "px" | "rem", rootSize: number): string {
  if (unit === "rem") return `${(px / rootSize).toFixed(px % rootSize === 0 ? 1 : 3).replace(/\.?0+$/, "")}rem`;
  return `${px}px`;
}

function generateCssVars(scale: number[], unit: "px" | "rem", rootSize: number): string {
  return `:root {\n${scale.map((v, i) => `  --space-${i + 1}: ${toUnit(v, unit, rootSize)};`).join("\n")}\n}`;
}

function generateTailwindConfig(scale: number[], unit: "px" | "rem", rootSize: number, presetName: string): string {
  const entries = scale.map((v, i) => {
    const key = presetName === "Tailwind Default" && i < tailwindLabels.length ? tailwindLabels[i] : String(i + 1);
    return `    '${key}': '${toUnit(v, unit, rootSize)}',`;
  });
  return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    spacing: {\n${entries.join("\n")}\n    },\n  },\n};`;
}

export default function SpacingCalculator() {
  const [base, setBase] = useState(4);
  const [method, setMethod] = useState<"linear" | "geometric">("linear");
  const [multiplier, setMultiplier] = useState(1);
  const [steps, setSteps] = useState(12);
  const [unit, setUnit] = useState<"px" | "rem">("px");
  const [rootSize, setRootSize] = useState(16);
  const [activePreset, setActivePreset] = useState("Material Design (4px)");

  const scale = useMemo(
    () => generateScale(base, method, multiplier, steps, activePreset),
    [base, method, multiplier, steps, activePreset]
  );

  const maxVal = Math.max(...scale, 1);

  const applyPreset = useCallback((name: string) => {
    const p = presets.find((pr) => pr.name === name);
    if (!p) return;
    setBase(p.base);
    setMethod(p.method);
    setMultiplier(p.multiplier);
    setSteps(p.steps);
    setUnit(p.unit);
    setActivePreset(p.name);
  }, []);

  const copyText = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  }, []);

  const cssVars = generateCssVars(scale, unit, rootSize);
  const twConfig = generateTailwindConfig(scale, unit, rootSize, activePreset);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Spacing Calculator — Generate Consistent Spacing Scales | Minerva's Tools"
        description="Generate linear or geometric spacing scales and export CSS custom properties or Tailwind configuration."
        canonical="/tools/spacing"
      />
      <ToolSchema
        name="Spacing Calculator"
        description="Generate consistent spacing and sizing scales for design systems"
        url="/tools/spacing"
        faqs={spacingCalcContent.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 sm:px-6 pt-10 pb-20">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Spacing Calculator</h1>
            <p className="text-sm text-muted-foreground">
              Generate consistent spacing scales for your design system
            </p>
          </div>
          <ShareToolButton toolName="Spacing Calculator" />
        </div>

        <div className="grid lg:grid-cols-[340px_1fr] gap-8">
          {/* Controls */}
          <div className="space-y-5">
            {/* Presets */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Preset</label>
              <Select value={activePreset} onValueChange={applyPreset}>
                <SelectTrigger className="border-2 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {presets.map((p) => (
                    <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Base Unit (px)</label>
                <Input
                  type="number"
                  min={1}
                  max={64}
                  value={base}
                  onChange={(e) => { setBase(Number(e.target.value) || 1); setActivePreset("Custom"); }}
                  className="border-2 border-border focus-visible:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Steps</label>
                <Input
                  type="number"
                  min={2}
                  max={24}
                  value={steps}
                  onChange={(e) => { setSteps(Math.min(24, Math.max(2, Number(e.target.value) || 2))); setActivePreset("Custom"); }}
                  className="border-2 border-border focus-visible:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Scale Method</label>
              <Select value={method} onValueChange={(v) => { setMethod(v as "linear" | "geometric"); setActivePreset("Custom"); }}>
                <SelectTrigger className="border-2 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear (base × n)</SelectItem>
                  <SelectItem value="geometric">Geometric (base × ratio^n)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {method === "geometric" && (
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Ratio</label>
                <Input
                  type="number"
                  min={1.01}
                  max={3}
                  step={0.01}
                  value={multiplier}
                  onChange={(e) => { setMultiplier(Number(e.target.value) || 1.5); setActivePreset("Custom"); }}
                  className="border-2 border-border focus-visible:border-primary"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Output Unit</label>
                <Select value={unit} onValueChange={(v) => setUnit(v as "px" | "rem")}>
                  <SelectTrigger className="border-2 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="px">px</SelectItem>
                    <SelectItem value="rem">rem</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {unit === "rem" && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Root Font Size</label>
                  <Input
                    type="number"
                    min={1}
                    max={32}
                    value={rootSize}
                    onChange={(e) => setRootSize(Number(e.target.value) || 16)}
                    className="border-2 border-border focus-visible:border-primary"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Output */}
          <div className="space-y-6">
            {/* Visual scale */}
            <div>
              <h2 className="text-sm font-semibold mb-3">Visual Scale</h2>
              <div className="space-y-1.5 rounded-lg border border-border bg-muted/20 p-4">
                {scale.map((val, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground w-10 text-right shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div
                        className="h-7 rounded-md transition-all duration-200"
                        style={{
                          width: `${Math.max((val / maxVal) * 100, 3)}%`,
                          backgroundColor: "oklch(0.488 0.243 264.376)",
                        }}
                      />
                    </div>
                    <span className="text-xs font-mono text-foreground shrink-0 w-28 text-right">
                      {toUnit(val, unit, rootSize)}
                      <span className="text-muted-foreground ml-1">({val}px)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Box preview */}
            <div>
              <h2 className="text-sm font-semibold mb-3">Box Preview</h2>
              <div className="flex flex-wrap gap-2 items-end">
                {scale.slice(0, 12).map((val, i) => (
                  <div
                    key={i}
                    className="bg-primary/20 border border-primary/40 rounded transition-all duration-200 group relative"
                    style={{ width: Math.max(val, 4), height: Math.max(val, 4), maxWidth: 120, maxHeight: 120 }}
                    title={`${toUnit(val, unit, rootSize)} (${val}px)`}
                  >
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Export */}
            <div>
              <h2 className="text-sm font-semibold mb-3">Export</h2>
              <Tabs defaultValue="css">
                <TabsList>
                  <TabsTrigger value="css">CSS Variables</TabsTrigger>
                  <TabsTrigger value="tailwind">Tailwind Config</TabsTrigger>
                </TabsList>

                <TabsContent value="css" className="mt-3">
                  <div className="relative rounded-lg border border-border bg-muted/30 p-4">
                    <pre className="font-mono text-xs text-foreground whitespace-pre-wrap break-all">{cssVars}</pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 gap-1.5"
                      onClick={() => copyText(cssVars, "CSS variables")}
                    >
                      <Copy size={14} weight="bold" />
                      Copy
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="tailwind" className="mt-3">
                  <div className="relative rounded-lg border border-border bg-muted/30 p-4">
                    <pre className="font-mono text-xs text-foreground whitespace-pre-wrap break-all">{twConfig}</pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 gap-1.5"
                      onClick={() => copyText(twConfig, "Tailwind config")}
                    >
                      <Copy size={14} weight="bold" />
                      Copy
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <ToolContent about={spacingCalcContent.about} faqs={spacingCalcContent.faqs} />
      <Footer />
    </div>
  );
}
