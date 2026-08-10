import { useMemo, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { toast } from "sonner";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolSchema from "@/components/ToolSchema";
import ToolContent from "@/components/ToolContent";
import { flexboxContent } from "@/lib/tool-content-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DIRECTIONS = ["row", "column", "row-reverse", "column-reverse"] as const;
const JUSTIFY = ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"] as const;
const ALIGN = ["stretch", "flex-start", "center", "flex-end", "baseline"] as const;
const WRAP = ["nowrap", "wrap", "wrap-reverse"] as const;

export default function FlexboxGenerator() {
  const [direction, setDirection] = useState<(typeof DIRECTIONS)[number]>("row");
  const [justify, setJustify] = useState<(typeof JUSTIFY)[number]>("space-between");
  const [align, setAlign] = useState<(typeof ALIGN)[number]>("center");
  const [wrap, setWrap] = useState<(typeof WRAP)[number]>("wrap");
  const [gap, setGap] = useState(16);
  const [itemCount, setItemCount] = useState(6);
  const [copied, setCopied] = useState(false);

  const css = useMemo(
    () =>
      `.container {\n  display: flex;\n  flex-direction: ${direction};\n  justify-content: ${justify};\n  align-items: ${align};\n  flex-wrap: ${wrap};\n  gap: ${gap}px;\n}`,
    [direction, justify, align, wrap, gap],
  );

  const items = Array.from({ length: Math.max(1, Math.min(12, itemCount)) }, (_, index) => index + 1);

  const copyCss = async () => {
    await navigator.clipboard.writeText(css);
    setCopied(true);
    toast.success("Flexbox CSS copied");
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Flexbox Generator — Visual CSS Flex Layout Builder | Minerva's Tools"
        description="Build and preview Flexbox layouts visually. Adjust direction, alignment, wrapping, gap, and copy production-ready CSS instantly."
        canonical="/tools/flexbox"
      />
      <ToolSchema
        name="Flexbox Generator"
        description="Visual Flexbox layout builder with live preview and copy-ready CSS."
        url="/tools/flexbox"
        faqs={flexboxContent.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 sm:px-6 py-10 lg:py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Flexbox Generator</h1>
            <p className="mt-1 text-muted-foreground">Tune layout behavior visually and copy clean CSS.</p>
          </div>
          <ShareToolButton toolName="Flexbox Generator" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
            <h2 className="mb-4 text-sm font-semibold">Controls</h2>

            <ControlRow label="Direction">
              {DIRECTIONS.map((value) => (
                <Button
                  key={value}
                  size="sm"
                  variant={direction === value ? "default" : "outline"}
                  onClick={() => setDirection(value)}
                >
                  {value}
                </Button>
              ))}
            </ControlRow>

            <ControlRow label="Justify Content">
              {JUSTIFY.map((value) => (
                <Button
                  key={value}
                  size="sm"
                  variant={justify === value ? "default" : "outline"}
                  onClick={() => setJustify(value)}
                >
                  {value}
                </Button>
              ))}
            </ControlRow>

            <ControlRow label="Align Items">
              {ALIGN.map((value) => (
                <Button
                  key={value}
                  size="sm"
                  variant={align === value ? "default" : "outline"}
                  onClick={() => setAlign(value)}
                >
                  {value}
                </Button>
              ))}
            </ControlRow>

            <ControlRow label="Wrap">
              {WRAP.map((value) => (
                <Button
                  key={value}
                  size="sm"
                  variant={wrap === value ? "default" : "outline"}
                  onClick={() => setWrap(value)}
                >
                  {value}
                </Button>
              ))}
            </ControlRow>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="mb-1.5 block text-sm">Gap (px)</Label>
                <Input type="number" min={0} max={96} value={gap} onChange={(e) => setGap(Number(e.target.value) || 0)} />
              </div>
              <div>
                <Label className="mb-1.5 block text-sm">Items</Label>
                <Input
                  type="number"
                  min={1}
                  max={12}
                  value={itemCount}
                  onChange={(e) => setItemCount(Number(e.target.value) || 1)}
                />
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

            <div
              className="min-h-[230px] rounded-md border border-border bg-muted/30 p-3"
              style={{
                display: "flex",
                flexDirection: direction,
                justifyContent: justify,
                alignItems: align,
                flexWrap: wrap,
                gap,
              }}
            >
              {items.map((item) => (
                <div
                  key={item}
                  className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/15 text-primary text-sm font-semibold"
                >
                  {item}
                </div>
              ))}
            </div>

            <pre className="mt-4 rounded-md border border-border bg-background p-3 text-xs font-mono overflow-x-auto">
              {css}
            </pre>
          </section>
        </div>

        <ToolContent about={flexboxContent.about} faqs={flexboxContent.faqs} />
      </main>

      <Footer />
    </div>
  );
}

function ControlRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <Label className="mb-1.5 block text-sm">{label}</Label>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}
