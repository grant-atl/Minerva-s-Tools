import { useMemo, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { toast } from "sonner";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolSchema from "@/components/ToolSchema";
import ToolContent from "@/components/ToolContent";
import { cssAnimationContent } from "@/lib/tool-content-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const animationMap: Record<string, string> = {
  fadeIn: "0% { opacity: 0; } 100% { opacity: 1; }",
  slideUp: "0% { transform: translateY(18px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; }",
  pulse: "0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); }",
  spin: "0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }",
  bounce: "0%, 100% { transform: translateY(0); } 50% { transform: translateY(-16px); }",
};

export default function CssAnimationGenerator() {
  const [preset, setPreset] = useState<keyof typeof animationMap>("fadeIn");
  const [duration, setDuration] = useState(0.8);
  const [delay, setDelay] = useState(0);
  const [iterationCount, setIterationCount] = useState("1");
  const [timing, setTiming] = useState("ease");
  const [fillMode, setFillMode] = useState("both");
  const [copied, setCopied] = useState(false);

  const keyframeName = `minerva-${preset}`;

  const cssCode = useMemo(() => {
    return `@keyframes ${keyframeName} {
  ${animationMap[preset]}
}

.animated-element {
  animation-name: ${keyframeName};
  animation-duration: ${duration}s;
  animation-delay: ${delay}s;
  animation-timing-function: ${timing};
  animation-iteration-count: ${iterationCount};
  animation-fill-mode: ${fillMode};
}
`;
  }, [preset, duration, delay, iterationCount, timing, fillMode, keyframeName]);

  const previewStyle = {
    animationName: keyframeName,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    animationTimingFunction: timing,
    animationIterationCount: iterationCount,
    animationFillMode: fillMode as "none" | "forwards" | "backwards" | "both",
  } as const;

  const copyCode = async () => {
    await navigator.clipboard.writeText(cssCode);
    setCopied(true);
    toast.success("Animation CSS copied");
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="CSS Animation Generator — Keyframes Builder | Minerva's Tools"
        description="Preview animation presets and generate CSS keyframes with duration, easing, and repeat controls."
        canonical="/tools/css-animation-generator"
      />
      <ToolSchema
        name="CSS Animation Generator"
        description="Generate keyframes and animation shorthand settings with live preview."
        url="/tools/css-animation-generator"
        faqs={cssAnimationContent.faqs}
      />

      <style>{`@keyframes ${keyframeName} { ${animationMap[preset]} }`}</style>

      <HomeNav />

      <main className="container mx-auto px-4 sm:px-6 py-10 lg:py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">CSS Animation Generator</h1>
            <p className="mt-1 text-muted-foreground">Adjust animation presets and copy the CSS keyframes.</p>
          </div>
          <ShareToolButton toolName="CSS Animation Generator" />
        </div>

        <section className="rounded-lg border border-border bg-card p-4 sm:p-5 space-y-5">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            <div className="space-y-3">
              <div className="space-y-2">
                <label htmlFor="preset" className="text-sm font-medium">Preset</label>
                <select
                  id="preset"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={preset}
                  onChange={(event) => setPreset(event.target.value as keyof typeof animationMap)}
                >
                  <option value="fadeIn">Fade In</option>
                  <option value="slideUp">Slide Up</option>
                  <option value="pulse">Pulse</option>
                  <option value="spin">Spin</option>
                  <option value="bounce">Bounce</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="duration" className="text-sm font-medium">Duration (s)</label>
                <Input id="duration" type="number" min={0.1} max={10} step={0.1} value={duration} onChange={(event) => setDuration(Number(event.target.value) || 0.8)} />
              </div>

              <div className="space-y-2">
                <label htmlFor="delay" className="text-sm font-medium">Delay (s)</label>
                <Input id="delay" type="number" min={0} max={10} step={0.1} value={delay} onChange={(event) => setDelay(Number(event.target.value) || 0)} />
              </div>

              <div className="space-y-2">
                <label htmlFor="timing" className="text-sm font-medium">Timing function</label>
                <select
                  id="timing"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={timing}
                  onChange={(event) => setTiming(event.target.value)}
                >
                  <option value="ease">ease</option>
                  <option value="linear">linear</option>
                  <option value="ease-in">ease-in</option>
                  <option value="ease-out">ease-out</option>
                  <option value="ease-in-out">ease-in-out</option>
                </select>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="count" className="text-sm font-medium">Iteration count</label>
                  <Input id="count" value={iterationCount} onChange={(event) => setIterationCount(event.target.value || "1")} placeholder="1 or infinite" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="fill" className="text-sm font-medium">Fill mode</label>
                  <select
                    id="fill"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={fillMode}
                    onChange={(event) => setFillMode(event.target.value)}
                  >
                    <option value="none">none</option>
                    <option value="forwards">forwards</option>
                    <option value="backwards">backwards</option>
                    <option value="both">both</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-medium">Preview</p>
              <div className="flex min-h-44 items-center justify-center rounded-lg border border-border bg-muted/30">
                <div style={previewStyle} className="h-20 w-20 rounded-xl bg-primary/80" />
              </div>

              <div className="flex justify-end">
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => void copyCode()}>
                  {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />} Copy CSS
                </Button>
              </div>

              <pre className="max-h-72 overflow-auto rounded-md border border-border bg-muted/20 p-3 text-xs leading-relaxed text-muted-foreground">{cssCode}</pre>
            </div>
          </div>
        </section>

        <ToolContent about={cssAnimationContent.about} faqs={cssAnimationContent.faqs} />
      </main>

      <Footer />
    </div>
  );
}
