import { useState, useMemo, useRef } from "react";
import { Copy, Plus, Trash, ArrowsClockwise } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolContent from "@/components/ToolContent";
import ToolSchema from "@/components/ToolSchema";
import { gradientContent } from "@/lib/tool-content-data";

interface ColorStop {
  id: string;
  color: string;
  position: number;
}

type GradientType = "linear" | "radial" | "conic";

const RADIAL_POSITIONS = [
  "center",
  "top",
  "top right",
  "right",
  "bottom right",
  "bottom",
  "bottom left",
  "left",
  "top left",
] as const;

const PRESETS: { name: string; stops: Omit<ColorStop, "id">[]; type: GradientType; angle: number }[] = [
  { name: "Sunset", type: "linear", angle: 135, stops: [{ color: "#f97316", position: 0 }, { color: "#ec4899", position: 50 }, { color: "#8b5cf6", position: 100 }] },
  { name: "Ocean", type: "linear", angle: 135, stops: [{ color: "#06b6d4", position: 0 }, { color: "#3b82f6", position: 50 }, { color: "#6366f1", position: 100 }] },
  { name: "Berry", type: "linear", angle: 135, stops: [{ color: "#ec4899", position: 0 }, { color: "#8b5cf6", position: 100 }] },
  { name: "Emerald", type: "linear", angle: 135, stops: [{ color: "#10b981", position: 0 }, { color: "#06b6d4", position: 100 }] },
  { name: "Flame", type: "linear", angle: 0, stops: [{ color: "#ef4444", position: 0 }, { color: "#f97316", position: 50 }, { color: "#eab308", position: 100 }] },
  { name: "Lavender", type: "linear", angle: 135, stops: [{ color: "#c084fc", position: 0 }, { color: "#f9a8d4", position: 100 }] },
  { name: "Midnight", type: "linear", angle: 180, stops: [{ color: "#0f172a", position: 0 }, { color: "#1e3a5f", position: 50 }, { color: "#312e81", position: 100 }] },
  { name: "Peach", type: "linear", angle: 135, stops: [{ color: "#fdba74", position: 0 }, { color: "#f87171", position: 100 }] },
  { name: "Aurora", type: "linear", angle: 135, stops: [{ color: "#22d3ee", position: 0 }, { color: "#a78bfa", position: 33 }, { color: "#f472b6", position: 66 }, { color: "#fb923c", position: 100 }] },
  { name: "Forest", type: "linear", angle: 180, stops: [{ color: "#064e3b", position: 0 }, { color: "#059669", position: 50 }, { color: "#a7f3d0", position: 100 }] },
  { name: "Steel", type: "linear", angle: 135, stops: [{ color: "#475569", position: 0 }, { color: "#94a3b8", position: 100 }] },
  { name: "Neon", type: "linear", angle: 90, stops: [{ color: "#00ff87", position: 0 }, { color: "#60efff", position: 50 }, { color: "#ff00e5", position: 100 }] },
];

let idCounter = 0;
const makeId = () => `stop-${++idCounter}`;

const makeStop = (color: string, position: number): ColorStop => ({
  id: makeId(),
  color,
  position,
});

function randomColor() {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
}

export default function GradientGenerator() {
  const [stops, setStops] = useState<ColorStop[]>([
    makeStop("#3b82f6", 0),
    makeStop("#8b5cf6", 50),
    makeStop("#ec4899", 100),
  ]);
  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [radialPosition, setRadialPosition] = useState("center");
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);

  const sortedStops = useMemo(
    () => [...stops].sort((a, b) => a.position - b.position),
    [stops]
  );

  const cssString = useMemo(() => {
    const stopsStr = sortedStops.map((s) => `${s.color} ${s.position}%`).join(", ");
    if (gradientType === "linear") return `linear-gradient(${angle}deg, ${stopsStr})`;
    if (gradientType === "radial") return `radial-gradient(circle at ${radialPosition}, ${stopsStr})`;
    return `conic-gradient(from ${angle}deg, ${stopsStr})`;
  }, [sortedStops, gradientType, angle, radialPosition]);

  const fullCss = `background: ${cssString};`;

  const copyCSS = () => {
    navigator.clipboard.writeText(fullCss);
    toast.success("CSS copied to clipboard");
  };

  const addStop = () => {
    if (stops.length >= 8) return;
    const positions = stops.map((s) => s.position).sort((a, b) => a - b);
    let newPos = 50;
    for (let i = 0; i < positions.length - 1; i++) {
      const gap = positions[i + 1] - positions[i];
      if (gap > 10) {
        newPos = Math.round(positions[i] + gap / 2);
        break;
      }
    }
    setStops((prev) => [...prev, makeStop(randomColor(), newPos)]);
  };

  const removeStop = (id: string) => {
    if (stops.length <= 2) return;
    setStops((prev) => prev.filter((s) => s.id !== id));
    if (selectedStopId === id) setSelectedStopId(null);
  };

  const updateStop = (id: string, updates: Partial<Omit<ColorStop, "id">>) => {
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const loadPreset = (preset: (typeof PRESETS)[number]) => {
    setStops(preset.stops.map((s) => makeStop(s.color, s.position)));
    setGradientType(preset.type);
    setAngle(preset.angle);
    setSelectedStopId(null);
  };

  const randomize = () => {
    const count = 2 + Math.floor(Math.random() * 3);
    const newStops: ColorStop[] = [];
    for (let i = 0; i < count; i++) {
      newStops.push(makeStop(randomColor(), Math.round((i / (count - 1)) * 100)));
    }
    setStops(newStops);
    setAngle(Math.floor(Math.random() * 360));
    setSelectedStopId(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="CSS Gradient Generator — Minerva"
        description="Build beautiful CSS gradients with a visual editor. Supports linear, radial, and conic gradients with up to 8 color stops. Copy CSS instantly."
        canonical="/tools/gradient"
      />
      <HomeNav />

      {/* Toolbar */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3">
          <h1 className="text-sm font-semibold text-foreground">Gradient Generator</h1>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {/* Type toggle */}
            <div className="flex rounded-lg border border-border overflow-hidden text-xs">
              {(["linear", "radial", "conic"] as GradientType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setGradientType(t)}
                  className={`px-2.5 py-1.5 capitalize font-medium transition-colors ${
                    gradientType === t
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <Button size="sm" variant="outline" onClick={randomize} className="gap-1.5">
              <ArrowsClockwise size={14} weight="bold" />
              Randomize
            </Button>
            <Button size="sm" onClick={copyCSS} className="gap-1.5">
              <Copy size={14} weight="bold" />
              Copy CSS
            </Button>
            <ShareToolButton toolName="Gradient Generator" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Controls row */}
        <div className="border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4">
            {/* Angle / Position control */}
            {gradientType === "linear" || gradientType === "conic" ? (
              <div className="flex items-center gap-4">
                <span className="text-xs font-medium text-muted-foreground w-14">
                  {gradientType === "linear" ? "Angle" : "From"}
                </span>
                <Slider
                  value={[angle]}
                  onValueChange={([v]) => setAngle(v)}
                  min={0}
                  max={360}
                  className="flex-1 max-w-xs"
                />
                <span className="text-xs font-mono text-foreground w-10 text-right">{angle}°</span>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-xs font-medium text-muted-foreground w-14">Position</span>
                <div className="flex flex-wrap gap-1">
                  {RADIAL_POSITIONS.map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setRadialPosition(pos)}
                      className={`px-2 py-1 text-xs rounded-md transition-colors ${
                        radialPosition === pos
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Gradient bar with stops */}
            <GradientBar
              stops={sortedStops}
              cssString={cssString}
              selectedId={selectedStopId}
              onSelect={setSelectedStopId}
              onUpdatePosition={(id, pos) => updateStop(id, { position: pos })}
            />

            {/* Stop controls */}
            <div className="flex flex-wrap items-end gap-3 overflow-x-auto pb-1">
              {sortedStops.map((stop) => (
                <div
                  key={stop.id}
                  className={`flex items-center gap-2 rounded-lg border p-2 transition-colors cursor-pointer ${
                    selectedStopId === stop.id
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                  onClick={() => setSelectedStopId(stop.id)}
                >
                  <ColorInput
                    color={stop.color}
                    onChange={(c) => updateStop(stop.id, { color: c })}
                  />
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={stop.position}
                    onChange={(e) =>
                      updateStop(stop.id, { position: Math.min(100, Math.max(0, Number(e.target.value))) })
                    }
                    className="w-14 h-7 rounded-md border border-border bg-background px-2 text-xs font-mono text-foreground text-center outline-none focus:border-primary"
                  />
                  <span className="text-xs text-muted-foreground">%</span>
                  {stops.length > 2 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeStop(stop.id);
                      }}
                      className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Remove stop"
                    >
                      <Trash size={14} />
                    </button>
                  )}
                </div>
              ))}
              {stops.length < 8 && (
                <Button size="sm" variant="outline" onClick={addStop} className="gap-1">
                  <Plus size={14} />
                  Add Stop
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Preview area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-[400px]">
          {/* Raw gradient */}
          <div className="p-6 flex items-center justify-center bg-muted/30">
            <div
              className="w-full h-full min-h-[300px] rounded-xl border border-border shadow-sm"
              style={{ background: cssString }}
            />
          </div>

          {/* Site preview */}
          <div className="p-6 flex items-center justify-center bg-muted/30 lg:border-l border-border">
            <div className="w-full max-w-md rounded-xl border border-border overflow-hidden shadow-lg bg-background">
              {/* Mock hero */}
              <div
                className="px-8 py-12 text-center"
                style={{ background: cssString }}
              >
                <p className="text-xs font-medium uppercase tracking-wider text-white/70 mb-2">
                  Live Preview
                </p>
                <h2 className="text-2xl font-bold text-white mb-3">
                  Beautiful Gradients
                </h2>
                <p className="text-sm text-white/80 mb-6 max-w-xs mx-auto">
                  See how your gradient looks as a hero section background on a real website.
                </p>
                <button className="px-5 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium border border-white/20 hover:bg-white/30 transition-colors">
                  Get Started
                </button>
              </div>
              {/* Mock content */}
              <div className="px-6 py-6 space-y-3">
                <div className="flex gap-3">
                  <div className="flex-1 rounded-lg bg-muted h-20" />
                  <div className="flex-1 rounded-lg bg-muted h-20" />
                </div>
                <div className="rounded-lg bg-muted h-10" />
                <div className="rounded-lg bg-muted h-10 w-2/3" />
              </div>
            </div>
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

        {/* Preset gallery */}
        <div className="border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 py-5">
            <h2 className="text-xs font-semibold text-foreground mb-3">Presets</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {PRESETS.map((preset) => {
                const stopsStr = preset.stops
                  .map((s) => `${s.color} ${s.position}%`)
                  .join(", ");
                const bg = `linear-gradient(135deg, ${stopsStr})`;
                return (
                  <button
                    key={preset.name}
                    onClick={() => loadPreset(preset)}
                    className="flex-shrink-0 group"
                    title={preset.name}
                  >
                    <div
                      className="w-16 h-16 rounded-lg border border-border shadow-sm transition-transform group-hover:scale-105"
                      style={{ background: bg }}
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

      <ToolContent about={gradientContent.about} faqs={gradientContent.faqs} />
      <ToolSchema name="CSS Gradient Generator" description="Build linear, radial, and conic CSS gradients with a visual editor." url="/tools/gradient" faqs={gradientContent.faqs} />
      <Footer />
    </div>
  );
}

/* ── Gradient bar with draggable handles ── */

function GradientBar({
  stops,
  cssString,
  selectedId,
  onSelect,
  onUpdatePosition,
}: {
  stops: ColorStop[];
  cssString: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onUpdatePosition: (id: string, position: number) => void;
}) {
  const barRef = useRef<HTMLDivElement>(null);

  const handleDrag = (id: string, e: React.PointerEvent) => {
    e.preventDefault();
    const bar = barRef.current;
    if (!bar) return;

    const move = (ev: PointerEvent) => {
      const rect = bar.getBoundingClientRect();
      const x = Math.max(0, Math.min(ev.clientX - rect.left, rect.width));
      const pct = Math.round((x / rect.width) * 100);
      onUpdatePosition(id, pct);
    };

    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    onSelect(id);
  };

  return (
    <div className="relative">
      <div
        ref={barRef}
        className="h-8 rounded-lg border border-border"
        style={{ background: cssString.replace(/linear-gradient\([^,]+,/, "linear-gradient(90deg,") }}
      />
      {stops.map((stop) => (
        <div
          key={stop.id}
          className={`absolute top-0 w-4 h-full cursor-ew-resize flex items-end justify-center`}
          style={{ left: `calc(${stop.position}% - 8px)` }}
          onPointerDown={(e) => handleDrag(stop.id, e)}
        >
          <div
            className={`w-3 h-3 rounded-full border-2 shadow-md translate-y-1/2 ${
              selectedId === stop.id ? "border-primary scale-125" : "border-white"
            }`}
            style={{ backgroundColor: stop.color }}
          />
        </div>
      ))}
    </div>
  );
}

/* ── Color swatch input ── */

function ColorInput({
  color,
  onChange,
}: {
  color: string;
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
        className="w-7 h-7 rounded-md border border-border cursor-pointer shadow-sm"
        style={{ backgroundColor: color }}
        title={color}
      />
    </>
  );
}
