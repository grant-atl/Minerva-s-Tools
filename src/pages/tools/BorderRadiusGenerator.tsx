import { useMemo, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { toast } from "sonner";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolSchema from "@/components/ToolSchema";
import ToolContent from "@/components/ToolContent";
import { borderRadiusContent } from "@/lib/tool-content-data";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function BorderRadiusGenerator() {
  const [tl, setTl] = useState(24);
  const [tr, setTr] = useState(24);
  const [br, setBr] = useState(24);
  const [bl, setBl] = useState(24);
  const [copied, setCopied] = useState(false);

  const css = useMemo(
    () =>
      `.card {\n  border-radius: ${tl}px ${tr}px ${br}px ${bl}px;\n}`,
    [tl, tr, br, bl],
  );

  const copyCss = async () => {
    await navigator.clipboard.writeText(css);
    setCopied(true);
    toast.success("Border radius CSS copied");
    window.setTimeout(() => setCopied(false), 1400);
  };

  const applyPreset = (value: [number, number, number, number]) => {
    setTl(value[0]);
    setTr(value[1]);
    setBr(value[2]);
    setBl(value[3]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Border Radius Generator — CSS Corner Builder | Minerva"
        description="Generate advanced CSS border-radius values with live preview and per-corner controls."
        canonical="/tools/border-radius"
      />
      <ToolSchema
        name="Border Radius Generator"
        description="Visual border-radius generator with independent corner controls and CSS export."
        url="/tools/border-radius"
        faqs={borderRadiusContent.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 sm:px-6 py-10 lg:py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Border Radius Generator</h1>
            <p className="mt-1 text-muted-foreground">Shape each corner independently and copy clean CSS.</p>
          </div>
          <ShareToolButton toolName="Border Radius Generator" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
            <h2 className="mb-4 text-sm font-semibold">Corner Controls</h2>
            <Slider label="Top Left" value={tl} onChange={setTl} />
            <Slider label="Top Right" value={tr} onChange={setTr} />
            <Slider label="Bottom Right" value={br} onChange={setBr} />
            <Slider label="Bottom Left" value={bl} onChange={setBl} />

            <div className="mt-5">
              <Label className="mb-1.5 block text-sm">Presets</Label>
              <div className="flex flex-wrap gap-1.5">
                <Button size="sm" variant="outline" onClick={() => applyPreset([8, 8, 8, 8])}>Subtle</Button>
                <Button size="sm" variant="outline" onClick={() => applyPreset([24, 24, 24, 24])}>Rounded</Button>
                <Button size="sm" variant="outline" onClick={() => applyPreset([48, 0, 48, 0])}>Ribbon</Button>
                <Button size="sm" variant="outline" onClick={() => applyPreset([56, 16, 40, 8])}>Organic</Button>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Live Preview</h2>
              <Button size="sm" variant="outline" className="gap-1" onClick={copyCss}>
                {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />} 
                {copied ? "Copied" : "Copy CSS"}
              </Button>
            </div>

            <div className="flex min-h-[260px] items-center justify-center rounded-md border border-border bg-muted/30 p-6">
              <div
                className="h-40 w-56 border border-primary/30 bg-primary/15"
                style={{ borderRadius: `${tl}px ${tr}px ${br}px ${bl}px` }}
              />
            </div>

            <pre className="mt-4 rounded-md border border-border bg-background p-3 text-xs font-mono overflow-x-auto">
              {css}
            </pre>
          </section>
        </div>

        <ToolContent about={borderRadiusContent.about} faqs={borderRadiusContent.faqs} />
      </main>

      <Footer />
    </div>
  );
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <div className="mb-4">
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <Label>{label}</Label>
        <span className="font-mono text-muted-foreground">{value}px</span>
      </div>
      <input
        type="range"
        min={0}
        max={120}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
      />
    </div>
  );
}
