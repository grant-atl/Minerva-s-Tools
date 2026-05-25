import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import SEO from "@/components/SEO";
import ToolContent from "@/components/ToolContent";
import { pxRemContent } from "@/lib/tool-content-data";
import MegaNav from "@/components/MegaNav";
import Footer from "@/components/Footer";
import ShareToolButton from "@/components/ShareToolButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowsLeftRight, Copy, Check } from "@phosphor-icons/react";
import { toast } from "sonner";

const COMMON_PX = [4, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96, 128];

function round(n: number, d = 4): number {
  return Math.round(n * 10 ** d) / 10 ** d;
}

export default function PxRemConverter() {
  const [baseFontSize, setBaseFontSize] = useState(16);
  const [pxValue, setPxValue] = useState("16");
  const [remValue, setRemValue] = useState("1");
  const [copiedCell, setCopiedCell] = useState<string | null>(null);

  const base = Math.max(1, baseFontSize || 16);

  const handlePxChange = (v: string) => {
    setPxValue(v);
    const n = parseFloat(v);
    if (!isNaN(n)) setRemValue(String(round(n / base)));
  };

  const handleRemChange = (v: string) => {
    setRemValue(v);
    const n = parseFloat(v);
    if (!isNaN(n)) setPxValue(String(round(n * base)));
  };

  const handleBaseChange = (v: number) => {
    setBaseFontSize(v);
    const b = Math.max(1, v || 16);
    const px = parseFloat(pxValue);
    if (!isNaN(px)) setRemValue(String(round(px / b)));
  };

  const referenceTable = useMemo(
    () => COMMON_PX.map((px) => ({ px, rem: round(px / base) })),
    [base]
  );

  const copyValue = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCell(label);
    toast.success(`Copied ${text}`);
    setTimeout(() => setCopiedCell(null), 1500);
  };

  return (
    <>
      <SEO
        title="px ↔ rem Converter — Free Unit Calculator | Minerva"
        description="Instantly convert between px and rem CSS units. Configurable base font size, quick-reference table, and batch conversion. Free, no sign-up."
        canonical="/tools/px-rem"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "px ↔ rem Converter",
            url: "https://www.minerva.tools/tools/px-rem",
            applicationCategory: "DesignApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description: "Instantly convert between px and rem CSS units with a configurable base font size.",
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <MegaNav />
        <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">px ↔ rem Converter</h1>
              <p className="mt-1 text-muted-foreground">
                Quickly convert between px and rem units with any base font size.
              </p>
            </div>
            <ShareToolButton toolName="px ↔ rem Converter" />
          </div>

          {/* Base font size */}
          <div className="mb-6 flex items-center gap-3">
            <Label htmlFor="base" className="whitespace-nowrap text-sm font-medium">
              Base font size
            </Label>
            <Input
              id="base"
              type="number"
              min={1}
              max={100}
              value={baseFontSize}
              onChange={(e) => handleBaseChange(Number(e.target.value))}
              className="w-20"
            />
            <span className="text-sm text-muted-foreground">px</span>
          </div>

          {/* Converter */}
          <div className="mb-10 flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex-1 w-full">
              <Label htmlFor="px" className="mb-1.5 block text-sm">Pixels (px)</Label>
              <Input
                id="px"
                type="number"
                step="any"
                value={pxValue}
                onChange={(e) => handlePxChange(e.target.value)}
                className="text-lg h-12"
              />
            </div>
            <ArrowsLeftRight className="mt-5 size-6 shrink-0 text-muted-foreground" weight="bold" />
            <div className="flex-1 w-full">
              <Label htmlFor="rem" className="mb-1.5 block text-sm">Root em (rem)</Label>
              <Input
                id="rem"
                type="number"
                step="any"
                value={remValue}
                onChange={(e) => handleRemChange(e.target.value)}
                className="text-lg h-12"
              />
            </div>
          </div>

          {/* Tabs: Reference table / Batch */}
          <Tabs defaultValue="reference" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="reference">Quick Reference</TabsTrigger>
              <TabsTrigger value="batch">Batch Convert</TabsTrigger>
            </TabsList>

            <TabsContent value="reference">
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead>px</TableHead>
                      <TableHead>rem</TableHead>
                      <TableHead className="w-24 text-right">Copy</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referenceTable.map(({ px, rem }) => (
                      <TableRow key={px}>
                        <TableCell className="font-mono">{px}px</TableCell>
                        <TableCell className="font-mono">{rem}rem</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => copyValue(`${rem}rem`, `${px}`)}
                            aria-label={`Copy ${rem}rem`}
                          >
                            {copiedCell === `${px}` ? (
                              <Check className="size-3.5 text-green-500" />
                            ) : (
                              <Copy className="size-3.5" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="batch">
              <BatchConverter base={base} />
            </TabsContent>
          </Tabs>

          <ToolContent about={pxRemContent.about} faqs={pxRemContent.faqs} />
        </main>
        <Footer />
      </div>
    </>
  );
}

function BatchConverter({ base }: { base: number }) {
  const [input, setInput] = useState("");
  const [direction, setDirection] = useState<"px-to-rem" | "rem-to-px">("px-to-rem");

  const results = useMemo(() => {
    const values = input
      .split(/[\n,]+/)
      .map((s) => s.trim().replace(/(px|rem)$/i, ""))
      .filter(Boolean)
      .map(Number)
      .filter((n) => !isNaN(n))
      .slice(0, 50);

    if (direction === "px-to-rem") {
      return values.map((v) => ({ from: `${v}px`, to: `${round(v / base)}rem` }));
    }
    return values.map((v) => ({ from: `${v}rem`, to: `${round(v * base)}px` }));
  }, [input, base, direction]);

  const copyAll = () => {
    const text = results.map((r) => r.to).join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Copied all results");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button
          variant={direction === "px-to-rem" ? "default" : "outline"}
          size="sm"
          onClick={() => setDirection("px-to-rem")}
        >
          px → rem
        </Button>
        <Button
          variant={direction === "rem-to-px" ? "default" : "outline"}
          size="sm"
          onClick={() => setDirection("rem-to-px")}
        >
          rem → px
        </Button>
      </div>
      <textarea
        className="w-full rounded-md border border-border bg-input/30 p-3 font-mono text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 outline-none"
        rows={4}
        placeholder="Enter values separated by commas or new lines (e.g. 12, 16, 24)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      {results.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{results.length} result{results.length !== 1 && "s"}</span>
            <Button variant="outline" size="sm" onClick={copyAll}>
              <Copy className="size-3.5 mr-1" /> Copy All
            </Button>
          </div>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Input</TableHead>
                  <TableHead>Output</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono">{r.from}</TableCell>
                    <TableCell className="font-mono">{r.to}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
