import { useMemo, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { toast } from "sonner";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolSchema from "@/components/ToolSchema";
import ToolContent from "@/components/ToolContent";
import { clampContent } from "@/lib/tool-content-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function format(value: number, precision = 4): string {
  return Number.parseFloat(value.toFixed(precision)).toString();
}

export default function ClampCalculator() {
  const [minValue, setMinValue] = useState(16);
  const [maxValue, setMaxValue] = useState(48);
  const [minViewport, setMinViewport] = useState(320);
  const [maxViewport, setMaxViewport] = useState(1440);
  const [unit, setUnit] = useState<"px" | "rem">("px");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const safeMinViewport = Math.max(1, minViewport);
    const safeMaxViewport = Math.max(safeMinViewport + 1, maxViewport);
    const safeMin = Math.min(minValue, maxValue);
    const safeMax = Math.max(minValue, maxValue);

    const slope = ((safeMax - safeMin) / (safeMaxViewport - safeMinViewport)) * 100;
    const intercept = safeMin - (slope * safeMinViewport) / 100;

    return {
      slope,
      intercept,
      clamp: `clamp(${format(safeMin)}${unit}, ${format(intercept)}${unit} + ${format(slope)}vw, ${format(safeMax)}${unit})`,
    };
  }, [minValue, maxValue, minViewport, maxViewport, unit]);

  const copyClamp = async () => {
    await navigator.clipboard.writeText(result.clamp);
    setCopied(true);
    toast.success("Clamp function copied");
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Clamp Calculator — Responsive CSS clamp() Generator | Minerva's Tools"
        description="Generate responsive clamp() values for typography and spacing. Configure min/max values and viewport range, then copy CSS instantly."
        canonical="/tools/clamp-calculator"
      />
      <ToolSchema
        name="Clamp Calculator"
        description="Responsive CSS clamp() calculator for fluid type and spacing systems."
        url="/tools/clamp-calculator"
        faqs={clampContent.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 sm:px-6 py-10 lg:py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clamp Calculator</h1>
            <p className="mt-1 text-muted-foreground">Build fluid responsive values with a proper clamp() formula.</p>
          </div>
          <ShareToolButton toolName="Clamp Calculator" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
            <h2 className="mb-4 text-sm font-semibold">Inputs</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Min Value" value={minValue} setValue={setMinValue} />
              <Field label="Max Value" value={maxValue} setValue={setMaxValue} />
              <Field label="Min Viewport (px)" value={minViewport} setValue={setMinViewport} />
              <Field label="Max Viewport (px)" value={maxViewport} setValue={setMaxViewport} />
            </div>

            <div className="mt-4">
              <Label className="mb-1.5 block text-sm">Output Unit</Label>
              <div className="flex gap-1.5">
                <Button size="sm" variant={unit === "px" ? "default" : "outline"} onClick={() => setUnit("px")}>px</Button>
                <Button size="sm" variant={unit === "rem" ? "default" : "outline"} onClick={() => setUnit("rem")}>rem</Button>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Output</h2>
              <Button size="sm" variant="outline" className="gap-1" onClick={copyClamp}>
                {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}
                {copied ? "Copied" : "Copy clamp()"}
              </Button>
            </div>

            <pre className="rounded-md border border-border bg-background p-3 text-xs font-mono overflow-x-auto">{result.clamp}</pre>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Stat label="Slope (vw)" value={`${format(result.slope)}vw`} />
              <Stat label="Intercept" value={`${format(result.intercept)}${unit}`} />
            </div>

            <div className="mt-4 rounded-md border border-border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">Example</p>
              <p className="mt-1 text-sm" style={{ fontSize: result.clamp }}>
                This preview scales fluidly with viewport width.
              </p>
            </div>
          </section>
        </div>

        <ToolContent about={clampContent.about} faqs={clampContent.faqs} />
      </main>

      <Footer />
    </div>
  );
}

function Field({
  label,
  value,
  setValue,
}: {
  label: string;
  value: number;
  setValue: (value: number) => void;
}) {
  return (
    <div>
      <Label className="mb-1.5 block text-sm">{label}</Label>
      <Input type="number" step="any" value={value} onChange={(event) => setValue(Number(event.target.value) || 0)} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-muted/30 p-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-sm">{value}</p>
    </div>
  );
}
