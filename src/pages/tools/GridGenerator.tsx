import { useMemo, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { toast } from "sonner";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolSchema from "@/components/ToolSchema";
import ToolContent from "@/components/ToolContent";
import { gridContent } from "@/lib/tool-content-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ALIGN = ["stretch", "start", "center", "end"] as const;
type AlignValue = (typeof ALIGN)[number];

export default function GridGenerator() {
  const [columns, setColumns] = useState(4);
  const [rows, setRows] = useState(3);
  const [gap, setGap] = useState(16);
  const [alignItems, setAlignItems] = useState<AlignValue>("center");
  const [justifyItems, setJustifyItems] = useState<AlignValue>("center");
  const [copied, setCopied] = useState(false);

  const cellCount = Math.max(1, Math.min(24, columns * rows));
  const cells = Array.from({ length: cellCount }, (_, index) => index + 1);

  const css = useMemo(
    () =>
      `.container {\n  display: grid;\n  grid-template-columns: repeat(${columns}, minmax(0, 1fr));\n  grid-template-rows: repeat(${rows}, minmax(56px, auto));\n  gap: ${gap}px;\n  align-items: ${alignItems};\n  justify-items: ${justifyItems};\n}`,
    [columns, rows, gap, alignItems, justifyItems],
  );

  const copyCss = async () => {
    await navigator.clipboard.writeText(css);
    setCopied(true);
    toast.success("Grid CSS copied");
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Grid Generator — CSS Grid Layout Builder | Minerva"
        description="Build responsive CSS Grid layouts with live preview and copy-ready CSS. Control columns, rows, gaps, and alignment instantly."
        canonical="/tools/grid"
      />
      <ToolSchema
        name="Grid Generator"
        description="Visual CSS Grid layout builder with alignment controls and CSS output."
        url="/tools/grid"
        faqs={gridContent.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 sm:px-6 py-10 lg:py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Grid Generator
            </h1>
            <p className="mt-1 text-muted-foreground">
              Create CSS Grid layouts visually and export production CSS.
            </p>
          </div>
          <ShareToolButton toolName="Grid Generator" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
            <h2 className="mb-4 text-sm font-semibold">Grid Controls</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Columns"
                value={columns}
                min={1}
                max={8}
                setValue={setColumns}
              />
              <Field
                label="Rows"
                value={rows}
                min={1}
                max={8}
                setValue={setRows}
              />
              <Field
                label="Gap (px)"
                value={gap}
                min={0}
                max={64}
                setValue={setGap}
              />
            </div>

            <div className="mt-4 space-y-4">
              <OptionRow
                label="Align Items"
                value={alignItems}
                onChange={setAlignItems}
                options={ALIGN}
              />
              <OptionRow
                label="Justify Items"
                value={justifyItems}
                onChange={setJustifyItems}
                options={ALIGN}
              />
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Live Preview</h2>
              <Button
                size="sm"
                variant="outline"
                className="gap-1"
                onClick={copyCss}
              >
                {copied ? (
                  <Check className="size-3.5 text-green-500" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                {copied ? "Copied" : "Copy CSS"}
              </Button>
            </div>

            <div
              className="rounded-md border border-border bg-muted/30 p-3"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${rows}, minmax(56px, auto))`,
                gap,
                alignItems,
                justifyItems,
                minHeight: "260px",
              }}
            >
              {cells.map((cell) => (
                <div
                  key={cell}
                  className="flex h-full w-full min-h-10 items-center justify-center rounded-md bg-primary/15 text-primary text-xs font-semibold"
                >
                  {cell}
                </div>
              ))}
            </div>

            <pre className="mt-4 rounded-md border border-border bg-background p-3 text-xs font-mono overflow-x-auto">
              {css}
            </pre>
          </section>
        </div>

        <ToolContent about={gridContent.about} faqs={gridContent.faqs} />
      </main>

      <Footer />
    </div>
  );
}

function Field({
  label,
  value,
  min,
  max,
  setValue,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  setValue: (value: number) => void;
}) {
  return (
    <div>
      <Label className="mb-1.5 block text-sm">{label}</Label>
      <Input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) =>
          setValue(
            Math.max(min, Math.min(max, Number(event.target.value) || min)),
          )
        }
      />
    </div>
  );
}

function OptionRow({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: AlignValue;
  onChange: (value: AlignValue) => void;
  options: readonly AlignValue[];
}) {
  return (
    <div>
      <Label className="mb-1.5 block text-sm">{label}</Label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <Button
            key={option}
            size="sm"
            variant={value === option ? "default" : "outline"}
            onClick={() => onChange(option)}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}
