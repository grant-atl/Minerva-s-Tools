import { useMemo, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { toast } from "sonner";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolSchema from "@/components/ToolSchema";
import ToolContent from "@/components/ToolContent";
import { clipPathBezierContent } from "@/lib/tool-content-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const clipPresets: Record<string, string> = {
  diamond: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
  hexagon: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
  triangle: "polygon(50% 0%, 100% 100%, 0% 100%)",
  arrow: "polygon(0% 35%, 70% 35%, 70% 15%, 100% 50%, 70% 85%, 70% 65%, 0% 65%)",
};

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export default function ClipPathBezierEditor() {
  const [preset, setPreset] = useState<keyof typeof clipPresets>("diamond");
  const [x1, setX1] = useState(0.25);
  const [y1, setY1] = useState(0.1);
  const [x2, setX2] = useState(0.25);
  const [y2, setY2] = useState(1);
  const [copied, setCopied] = useState(false);

  const bezier = useMemo(
    () => `cubic-bezier(${clamp(x1).toFixed(2)}, ${clamp(y1).toFixed(2)}, ${clamp(x2).toFixed(2)}, ${clamp(y2).toFixed(2)})`,
    [x1, y1, x2, y2],
  );

  const cssCode = useMemo(
    () => `.shape {
  clip-path: ${clipPresets[preset]};
  transition: transform 320ms ${bezier};
}

.shape:hover {
  transform: scale(1.08);
}
`,
    [preset, bezier],
  );

  const copyCode = async () => {
    await navigator.clipboard.writeText(cssCode);
    setCopied(true);
    toast.success("CSS copied");
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Clip-Path & Bezier Editor — CSS Shape + Easing | Minerva's Tools"
        description="Pick a clip-path shape and tune cubic-bezier easing with interactive controls."
        canonical="/tools/clip-path-bezier"
      />
      <ToolSchema
        name="Clip-Path & Bezier Editor"
        description="Generate CSS clip-path shapes with custom cubic-bezier timing curves."
        url="/tools/clip-path-bezier"
        faqs={clipPathBezierContent.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 sm:px-6 py-10 lg:py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clip-Path & Bezier Editor</h1>
            <p className="mt-1 text-muted-foreground">Design shape masks and transition easing in one tool.</p>
          </div>
          <ShareToolButton toolName="Clip-Path & Bezier Editor" />
        </div>

        <section className="rounded-lg border border-border bg-card p-4 sm:p-5 space-y-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
            <div className="space-y-3">
              <div className="space-y-2">
                <label htmlFor="shape-preset" className="text-sm font-medium">Clip-path preset</label>
                <select
                  id="shape-preset"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={preset}
                  onChange={(event) => setPreset(event.target.value as keyof typeof clipPresets)}
                >
                  <option value="diamond">Diamond</option>
                  <option value="hexagon">Hexagon</option>
                  <option value="triangle">Triangle</option>
                  <option value="arrow">Arrow</option>
                </select>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="x1">x1</label>
                  <Input id="x1" type="number" min={0} max={1} step={0.01} value={x1} onChange={(event) => setX1(Number(event.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="y1">y1</label>
                  <Input id="y1" type="number" min={0} max={1} step={0.01} value={y1} onChange={(event) => setY1(Number(event.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="x2">x2</label>
                  <Input id="x2" type="number" min={0} max={1} step={0.01} value={x2} onChange={(event) => setX2(Number(event.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="y2">y2</label>
                  <Input id="y2" type="number" min={0} max={1} step={0.01} value={y2} onChange={(event) => setY2(Number(event.target.value) || 0)} />
                </div>
              </div>

              <p className="rounded-md border border-border bg-muted/20 p-2 text-xs text-muted-foreground">Timing: {bezier}</p>

              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => void copyCode()}>
                {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />} Copy CSS
              </Button>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-medium">Preview</p>
              <div className="flex min-h-44 items-center justify-center rounded-lg border border-border bg-muted/30">
                <div
                  className="h-28 w-28 bg-primary/80 transition-transform duration-300"
                  style={{
                    clipPath: clipPresets[preset],
                    transitionTimingFunction: bezier,
                  }}
                />
              </div>
              <pre className="max-h-72 overflow-auto rounded-md border border-border bg-muted/20 p-3 text-xs leading-relaxed text-muted-foreground">{cssCode}</pre>
            </div>
          </div>
        </section>

        <ToolContent about={clipPathBezierContent.about} faqs={clipPathBezierContent.faqs} />
      </main>

      <Footer />
    </div>
  );
}
