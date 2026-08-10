import { useMemo, useState } from "react";
import { ArrowCounterClockwise, Check, Copy } from "@phosphor-icons/react";
import { toast } from "sonner";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolSchema from "@/components/ToolSchema";
import ToolContent from "@/components/ToolContent";
import { neumorphismContent } from "@/lib/tool-content-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

type NeumorphismMode = "raised" | "pressed";

interface NeumorphismSettings {
  mode: NeumorphismMode;
  direction: number;
  distance: number;
  blur: number;
  spread: number;
  radius: number;
  width: number;
  height: number;
  intensity: number;
  backgroundColor: string;
  surfaceColor: string;
  lightColor: string;
  darkColor: string;
}

const DEFAULT_SETTINGS: NeumorphismSettings = {
  mode: "raised",
  direction: 135,
  distance: 14,
  blur: 28,
  spread: 0,
  radius: 20,
  width: 220,
  height: 140,
  intensity: 55,
  backgroundColor: "#e8ecf4",
  surfaceColor: "#e8ecf4",
  lightColor: "#ffffff",
  darkColor: "#b7bcc8",
};

const PRESETS: Array<{ name: string; settings: NeumorphismSettings }> = [
  {
    name: "Soft Card",
    settings: {
      ...DEFAULT_SETTINGS,
      mode: "raised",
      direction: 135,
      distance: 14,
      blur: 28,
      intensity: 55,
      radius: 20,
      width: 220,
      height: 140,
      backgroundColor: "#e8ecf4",
      surfaceColor: "#e8ecf4",
      lightColor: "#ffffff",
      darkColor: "#b7bcc8",
    },
  },
  {
    name: "Subtle",
    settings: {
      ...DEFAULT_SETTINGS,
      mode: "raised",
      direction: 135,
      distance: 8,
      blur: 18,
      intensity: 40,
      radius: 16,
      width: 210,
      height: 130,
      backgroundColor: "#eff2f8",
      surfaceColor: "#eff2f8",
      lightColor: "#ffffff",
      darkColor: "#cbd2df",
    },
  },
  {
    name: "Pressed",
    settings: {
      ...DEFAULT_SETTINGS,
      mode: "pressed",
      direction: 135,
      distance: 10,
      blur: 20,
      intensity: 55,
      radius: 18,
      width: 220,
      height: 140,
      backgroundColor: "#e8ecf4",
      surfaceColor: "#e8ecf4",
      lightColor: "#ffffff",
      darkColor: "#b5bac6",
    },
  },
  {
    name: "Slate",
    settings: {
      ...DEFAULT_SETTINGS,
      mode: "raised",
      direction: 145,
      distance: 16,
      blur: 26,
      intensity: 65,
      radius: 22,
      width: 230,
      height: 150,
      backgroundColor: "#2f3646",
      surfaceColor: "#2f3646",
      lightColor: "#4a5370",
      darkColor: "#1f2430",
    },
  },
  {
    name: "Candy",
    settings: {
      ...DEFAULT_SETTINGS,
      mode: "raised",
      direction: 140,
      distance: 12,
      blur: 22,
      intensity: 60,
      radius: 26,
      width: 230,
      height: 145,
      backgroundColor: "#f7dff0",
      surfaceColor: "#f7dff0",
      lightColor: "#fff7ff",
      darkColor: "#d6b7cb",
    },
  },
];

function isHexColor(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

function toRgba(hex: string, alpha: number) {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
}

function getOffsets(direction: number, distance: number) {
  const radians = (direction * Math.PI) / 180;
  return {
    x: Math.round(Math.cos(radians) * distance),
    y: Math.round(Math.sin(radians) * distance),
  };
}

function makeShadow(settings: NeumorphismSettings) {
  const { x, y } = getOffsets(settings.direction, settings.distance);
  const darkAlpha = Math.min(0.8, 0.1 + settings.intensity / 220);
  const lightAlpha = Math.min(0.9, 0.2 + settings.intensity / 180);
  const prefix = settings.mode === "pressed" ? "inset " : "";

  const darkShadow = `${prefix}${x}px ${y}px ${settings.blur}px ${settings.spread}px ${toRgba(settings.darkColor, darkAlpha)}`;
  const lightShadow = `${prefix}${-x}px ${-y}px ${settings.blur}px ${settings.spread}px ${toRgba(settings.lightColor, lightAlpha)}`;

  return {
    darkShadow,
    lightShadow,
    boxShadow: `${darkShadow}, ${lightShadow}`,
  };
}

export default function NeumorphismGenerator() {
  const [settings, setSettings] = useState<NeumorphismSettings>({ ...DEFAULT_SETTINGS });
  const [copied, setCopied] = useState(false);

  const shadow = useMemo(() => makeShadow(settings), [settings]);

  const cssCode = useMemo(
    () =>
      [
        `background: ${settings.surfaceColor};`,
        `border-radius: ${settings.radius}px;`,
        "box-shadow:",
        `  ${shadow.darkShadow},`,
        `  ${shadow.lightShadow};`,
      ].join("\n"),
    [settings.radius, settings.surfaceColor, shadow.darkShadow, shadow.lightShadow],
  );

  const update = <K extends keyof NeumorphismSettings>(
    key: K,
    value: NeumorphismSettings[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const copyCss = async () => {
    await navigator.clipboard.writeText(cssCode);
    setCopied(true);
    toast.success("CSS copied to clipboard");
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Neumorphism Generator — Soft UI CSS Editor | Minerva's Tools"
        description="Create soft neumorphic UI components with visual controls for light direction, distance, blur, intensity, radius, and pressed or raised states."
        canonical="/tools/neumorphism"
      />
      <HomeNav />

      <main className="container mx-auto px-4 sm:px-6 py-10 lg:py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Neumorphism Generator</h1>
            <p className="mt-1 text-muted-foreground">
              Build soft raised or pressed UI surfaces and copy clean production CSS.
            </p>
          </div>
          <ShareToolButton toolName="Neumorphism Generator" />
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={settings.mode === "raised" ? "default" : "outline"}
            size="sm"
            onClick={() => update("mode", "raised")}
          >
            Raised
          </Button>
          <Button
            variant={settings.mode === "pressed" ? "default" : "outline"}
            size="sm"
            onClick={() => update("mode", "pressed")}
          >
            Pressed
          </Button>
          {PRESETS.map((preset) => (
            <Button
              key={preset.name}
              variant="outline"
              size="sm"
              onClick={() => setSettings({ ...preset.settings })}
            >
              {preset.name}
            </Button>
          ))}
          <Button variant="ghost" size="sm" onClick={() => setSettings({ ...DEFAULT_SETTINGS })}>
            <ArrowCounterClockwise className="mr-1 size-3.5" />
            Reset
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-5">
            <SliderControl
              label="Direction"
              value={settings.direction}
              min={0}
              max={360}
              unit="deg"
              onChange={(value) => update("direction", value)}
            />
            <SliderControl
              label="Distance"
              value={settings.distance}
              min={0}
              max={40}
              unit="px"
              onChange={(value) => update("distance", value)}
            />
            <SliderControl
              label="Blur"
              value={settings.blur}
              min={0}
              max={80}
              unit="px"
              onChange={(value) => update("blur", value)}
            />
            <SliderControl
              label="Spread"
              value={settings.spread}
              min={-24}
              max={24}
              unit="px"
              onChange={(value) => update("spread", value)}
            />
            <SliderControl
              label="Intensity"
              value={settings.intensity}
              min={10}
              max={100}
              unit="%"
              onChange={(value) => update("intensity", value)}
            />
            <SliderControl
              label="Radius"
              value={settings.radius}
              min={0}
              max={72}
              unit="px"
              onChange={(value) => update("radius", value)}
            />
            <SliderControl
              label="Width"
              value={settings.width}
              min={120}
              max={360}
              unit="px"
              onChange={(value) => update("width", value)}
            />
            <SliderControl
              label="Height"
              value={settings.height}
              min={80}
              max={260}
              unit="px"
              onChange={(value) => update("height", value)}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <ColorControl
                label="Background"
                value={settings.backgroundColor}
                onChange={(value) => update("backgroundColor", value)}
              />
              <ColorControl
                label="Surface"
                value={settings.surfaceColor}
                onChange={(value) => update("surfaceColor", value)}
              />
              <ColorControl
                label="Light Shadow"
                value={settings.lightColor}
                onChange={(value) => update("lightColor", value)}
              />
              <ColorControl
                label="Dark Shadow"
                value={settings.darkColor}
                onChange={(value) => update("darkColor", value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div
              className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-xl border border-border"
              style={{ backgroundColor: settings.backgroundColor }}
            >
              <div
                aria-label="Neumorphism preview"
                className="transition-all duration-200"
                style={{
                  width: `${settings.width}px`,
                  height: `${settings.height}px`,
                  borderRadius: `${settings.radius}px`,
                  backgroundColor: settings.surfaceColor,
                  boxShadow: shadow.boxShadow,
                }}
              />
            </div>

            <div className="relative rounded-lg border border-border bg-muted/30 p-4">
              <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm text-foreground">
                {cssCode}
              </pre>
              <Button variant="outline" size="sm" className="absolute right-3 top-3" onClick={copyCss}>
                {copied ? <Check className="mr-1 size-3.5 text-green-500" /> : <Copy className="mr-1 size-3.5" />}
                {copied ? "Copied" : "Copy CSS"}
              </Button>
            </div>
          </div>
        </div>

        <ToolContent about={neumorphismContent.about} faqs={neumorphismContent.faqs} />
      </main>

      <ToolSchema
        name="Neumorphism Generator"
        description="Build soft raised and pressed neumorphic UI effects with live preview and copy-ready CSS."
        url="/tools/neumorphism"
        faqs={neumorphismContent.faqs}
      />
      <Footer />
    </div>
  );
}

function SliderControl({
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
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-sm">{label}</Label>
        <span className="font-mono text-sm text-muted-foreground">
          {value}
          {unit}
        </span>
      </div>
      <Slider min={min} max={max} step={1} value={[value]} onValueChange={([next]) => onChange(next)} />
    </div>
  );
}

function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [input, setInput] = useState(value);

  const commit = (next: string) => {
    const normalized = next.startsWith("#") ? next : `#${next}`;
    if (isHexColor(normalized)) {
      onChange(normalized.toLowerCase());
      setInput(normalized.toLowerCase());
      return;
    }

    setInput(value);
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setInput(event.target.value);
          }}
          className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent"
        />
        <Input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onBlur={() => commit(input.trim())}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              commit(input.trim());
            }
          }}
          className="w-28 font-mono text-sm"
          aria-label={`${label} hex value`}
        />
      </div>
    </div>
  );
}
