import { useState, useMemo, useRef } from "react";
import { Copy, Plus, Trash, ArrowsClockwise } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolContent from "@/components/ToolContent";
import ToolSchema from "@/components/ToolSchema";
import { boxShadowContent } from "@/lib/tool-content-data";

interface ShadowLayer {
  id: string;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

let idCounter = 0;
const makeId = () => `shadow-${++idCounter}`;

const makeLayer = (overrides: Partial<Omit<ShadowLayer, "id">> = {}): ShadowLayer => ({
  id: makeId(),
  x: 0,
  y: 4,
  blur: 12,
  spread: 0,
  color: "#000000",
  opacity: 15,
  inset: false,
  ...overrides,
});

function hexToRgba(hex: string, opacity: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${(opacity / 100).toFixed(2)})`;
}

interface Preset {
  name: string;
  layers: Omit<ShadowLayer, "id">[];
}

const PRESETS: Preset[] = [
  { name: "Subtle", layers: [{ x: 0, y: 1, blur: 3, spread: 0, color: "#000000", opacity: 10, inset: false }] },
  { name: "Elevated", layers: [{ x: 0, y: 4, blur: 6, spread: -1, color: "#000000", opacity: 10, inset: false }, { x: 0, y: 10, blur: 15, spread: -3, color: "#000000", opacity: 10, inset: false }] },
  { name: "Sharp", layers: [{ x: 4, y: 4, blur: 0, spread: 0, color: "#000000", opacity: 25, inset: false }] },
  { name: "Dreamy", layers: [{ x: 0, y: 8, blur: 32, spread: 0, color: "#000000", opacity: 8, inset: false }, { x: 0, y: 4, blur: 16, spread: 0, color: "#000000", opacity: 6, inset: false }] },
  { name: "Neumorphic", layers: [{ x: 6, y: 6, blur: 12, spread: 0, color: "#000000", opacity: 12, inset: false }, { x: -6, y: -6, blur: 12, spread: 0, color: "#ffffff", opacity: 80, inset: false }] },
  { name: "Layered", layers: [{ x: 0, y: 1, blur: 2, spread: 0, color: "#000000", opacity: 5, inset: false }, { x: 0, y: 2, blur: 4, spread: 0, color: "#000000", opacity: 5, inset: false }, { x: 0, y: 4, blur: 8, spread: 0, color: "#000000", opacity: 5, inset: false }, { x: 0, y: 8, blur: 16, spread: 0, color: "#000000", opacity: 5, inset: false }] },
  { name: "Colorful", layers: [{ x: 0, y: 8, blur: 24, spread: -4, color: "#3b82f6", opacity: 40, inset: false }] },
  { name: "Deep", layers: [{ x: 0, y: 20, blur: 40, spread: -8, color: "#000000", opacity: 20, inset: false }, { x: 0, y: 8, blur: 16, spread: -4, color: "#000000", opacity: 12, inset: false }] },
];

export default function BoxShadowGenerator() {
  const [layers, setLayers] = useState<ShadowLayer[]>([
    makeLayer({ y: 4, blur: 6, spread: -1, opacity: 10 }),
    makeLayer({ y: 10, blur: 15, spread: -3, opacity: 10 }),
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState("#f4f4f5");
  const [boxColor, setBoxColor] = useState("#ffffff");

  const cssString = useMemo(() => {
    return layers
      .map((l) => {
        const rgba = hexToRgba(l.color, l.opacity);
        return `${l.inset ? "inset " : ""}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${rgba}`;
      })
      .join(",\n    ");
  }, [layers]);

  const fullCss = `box-shadow:\n    ${cssString};`;

  const copyCSS = () => {
    navigator.clipboard.writeText(fullCss);
    toast.success("CSS copied to clipboard");
  };

  const addLayer = () => {
    if (layers.length >= 8) return;
    const newLayer = makeLayer();
    setLayers((prev) => [...prev, newLayer]);
    setSelectedId(newLayer.id);
  };

  const removeLayer = (id: string) => {
    if (layers.length <= 1) return;
    setLayers((prev) => prev.filter((l) => l.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const updateLayer = (id: string, updates: Partial<Omit<ShadowLayer, "id">>) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const loadPreset = (preset: Preset) => {
    const newLayers = preset.layers.map((l) => makeLayer(l));
    setLayers(newLayers);
    setSelectedId(newLayers[0]?.id ?? null);
  };

  const randomize = () => {
    const count = 1 + Math.floor(Math.random() * 3);
    const newLayers: ShadowLayer[] = [];
    for (let i = 0; i < count; i++) {
      newLayers.push(
        makeLayer({
          x: Math.floor(Math.random() * 40) - 20,
          y: Math.floor(Math.random() * 40) - 20,
          blur: Math.floor(Math.random() * 40),
          spread: Math.floor(Math.random() * 20) - 10,
          color: "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0"),
          opacity: 10 + Math.floor(Math.random() * 40),
          inset: Math.random() > 0.8,
        })
      );
    }
    setLayers(newLayers);
    setSelectedId(newLayers[0]?.id ?? null);
  };

  const selectedLayer = layers.find((l) => l.id === selectedId) ?? null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="CSS Box Shadow Generator — Minervas"
        description="Design beautiful CSS box shadows with a visual editor. Add multiple layers, adjust offset, blur, spread, color, and opacity. Copy CSS instantly."
        canonical="/tools/box-shadow"
      />
      <HomeNav />

      {/* Toolbar */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3">
          <h1 className="text-sm font-semibold text-foreground">Box Shadow Generator</h1>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={randomize} className="gap-1.5">
              <ArrowsClockwise size={14} weight="bold" />
              Randomize
            </Button>
            <Button size="sm" onClick={copyCSS} className="gap-1.5">
              <Copy size={14} weight="bold" />
              Copy CSS
            </Button>
            <ShareToolButton toolName="Box Shadow Generator" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Main content: preview + controls */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-[400px]">
          {/* Preview */}
          <div
            className="p-6 sm:p-10 flex items-center justify-center"
            style={{ backgroundColor: bgColor }}
          >
            <div
              className="w-48 h-48 sm:w-64 sm:h-64 rounded-2xl transition-shadow duration-200"
              style={{
                backgroundColor: boxColor,
                boxShadow: layers
                  .map((l) => {
                    const rgba = hexToRgba(l.color, l.opacity);
                    return `${l.inset ? "inset " : ""}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${rgba}`;
                  })
                  .join(", "),
              }}
            />
          </div>

          {/* Controls */}
          <div className="border-t lg:border-t-0 lg:border-l border-border overflow-y-auto">
            {/* Background & box color */}
            <div className="border-b border-border px-4 sm:px-6 py-3 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Background</span>
                <ColorInput color={bgColor} onChange={setBgColor} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Box</span>
                <ColorInput color={boxColor} onChange={setBoxColor} />
              </div>
            </div>

            {/* Layer list */}
            <div className="border-b border-border px-4 sm:px-6 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-foreground">
                  Layers ({layers.length}/8)
                </span>
                {layers.length < 8 && (
                  <Button size="xs" variant="outline" onClick={addLayer} className="gap-1">
                    <Plus size={12} />
                    Add
                  </Button>
                )}
              </div>
              <div className="flex flex-col gap-1">
                {layers.map((layer, i) => (
                  <div
                    key={layer.id}
                    onClick={() => setSelectedId(layer.id)}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-colors text-xs ${
                      selectedId === layer.id
                        ? "bg-primary/10 border border-primary/30"
                        : "hover:bg-muted border border-transparent"
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded border border-border flex-shrink-0"
                      style={{ backgroundColor: hexToRgba(layer.color, layer.opacity) }}
                    />
                    <span className="text-muted-foreground flex-1 truncate">
                      {layer.inset ? "inset " : ""}
                      {layer.x}px {layer.y}px {layer.blur}px {layer.spread}px
                    </span>
                    {layers.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeLayer(layer.id);
                        }}
                        className="p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Selected layer controls */}
            {selectedLayer && (
              <div className="px-4 sm:px-6 py-4 space-y-4">
                <SliderRow
                  label="X Offset"
                  value={selectedLayer.x}
                  min={-100}
                  max={100}
                  unit="px"
                  onChange={(v) => updateLayer(selectedLayer.id, { x: v })}
                />
                <SliderRow
                  label="Y Offset"
                  value={selectedLayer.y}
                  min={-100}
                  max={100}
                  unit="px"
                  onChange={(v) => updateLayer(selectedLayer.id, { y: v })}
                />
                <SliderRow
                  label="Blur"
                  value={selectedLayer.blur}
                  min={0}
                  max={100}
                  unit="px"
                  onChange={(v) => updateLayer(selectedLayer.id, { blur: v })}
                />
                <SliderRow
                  label="Spread"
                  value={selectedLayer.spread}
                  min={-50}
                  max={50}
                  unit="px"
                  onChange={(v) => updateLayer(selectedLayer.id, { spread: v })}
                />
                <SliderRow
                  label="Opacity"
                  value={selectedLayer.opacity}
                  min={0}
                  max={100}
                  unit="%"
                  onChange={(v) => updateLayer(selectedLayer.id, { opacity: v })}
                />
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-muted-foreground w-16">Color</span>
                  <ColorInput
                    color={selectedLayer.color}
                    onChange={(c) => updateLayer(selectedLayer.id, { color: c })}
                  />
                  <input
                    type="text"
                    value={selectedLayer.color}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (/^#[0-9a-fA-F]{6}$/.test(v)) {
                        updateLayer(selectedLayer.id, { color: v });
                      }
                    }}
                    className="w-20 h-7 rounded-md border border-border bg-background px-2 text-xs font-mono text-foreground outline-none focus:border-primary"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-muted-foreground w-16">Inset</span>
                  <Switch
                    checked={selectedLayer.inset}
                    onCheckedChange={(v) => updateLayer(selectedLayer.id, { inset: v })}
                  />
                </div>
              </div>
            )}

            {!selectedLayer && (
              <div className="px-4 sm:px-6 py-8 text-center text-xs text-muted-foreground">
                Select a layer to edit its properties
              </div>
            )}
          </div>
        </div>

        {/* CSS output */}
        <div className="border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-semibold text-foreground">CSS Output</span>
              <Button size="xs" variant="ghost" onClick={copyCSS} className="gap-1 text-muted-foreground">
                <Copy size={12} />
                Copy
              </Button>
            </div>
            <pre className="bg-muted rounded-lg px-4 py-3 text-xs font-mono text-foreground overflow-x-auto">
              {fullCss}
            </pre>
          </div>
        </div>

        {/* Presets */}
        <div className="border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 py-5">
            <h2 className="text-xs font-semibold text-foreground mb-3">Presets</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {PRESETS.map((preset) => {
                const shadow = preset.layers
                  .map((l) => {
                    const rgba = hexToRgba(l.color, l.opacity);
                    return `${l.inset ? "inset " : ""}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${rgba}`;
                  })
                  .join(", ");
                return (
                  <button
                    key={preset.name}
                    onClick={() => loadPreset(preset)}
                    className="flex-shrink-0 group"
                    title={preset.name}
                  >
                    <div
                      className="w-16 h-16 rounded-lg bg-background border border-border transition-transform group-hover:scale-105"
                      style={{ boxShadow: shadow }}
                    />
                    <p className="text-[10px] text-muted-foreground mt-1 text-center group-hover:text-foreground transition-colors">
                      {preset.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <ToolContent about={boxShadowContent.about} faqs={boxShadowContent.faqs} />
      <ToolSchema name="CSS Box Shadow Generator" description="Design multi-layer CSS box shadows with a visual editor." url="/tools/box-shadow" faqs={boxShadowContent.faqs} />
      <Footer />
    </div>
  );
}

/* ── Slider row ── */

function SliderRow({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-muted-foreground w-16 flex-shrink-0">{label}</span>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        className="flex-1"
      />
      <span className="text-xs font-mono text-foreground w-12 text-right">
        {value}{unit}
      </span>
    </div>
  );
}

/* ── Color swatch input ── */

function ColorInput({ color, onChange }: { color: string; onChange: (hex: string) => void }) {
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
        className="w-7 h-7 rounded-md border border-border cursor-pointer shadow-sm"
        style={{ backgroundColor: color }}
        title={color}
      />
    </>
  );
}
