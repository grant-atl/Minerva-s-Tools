import { useMemo, useState } from "react";
import { Check, Copy, DownloadSimple } from "@phosphor-icons/react";
import { optimize } from "svgo/browser";
import { toast } from "sonner";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolSchema from "@/components/ToolSchema";
import ToolContent from "@/components/ToolContent";
import { svgOptimizerContent } from "@/lib/tool-content-data";
import { TOOL_TEXTAREA_OUTLINE_CLASS } from "@/lib/tool-ui";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface OptimizeOptions {
  removeComments: boolean;
  removeMetadata: boolean;
  collapseWhitespace: boolean;
}

function optimizeSvg(input: string, options: OptimizeOptions): string {
  const overrides: Record<string, false> = {};
  if (!options.removeComments) {
    overrides.removeComments = false;
  }
  if (!options.removeMetadata) {
    overrides.removeMetadata = false;
    overrides.removeTitle = false;
    overrides.removeDesc = false;
  }

  const result = optimize(input, {
    multipass: true,
    js2svg: {
      pretty: !options.collapseWhitespace,
      indent: options.collapseWhitespace ? 0 : 2,
    },
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides,
        },
      },
    ],
  });

  return result.data.trim();
}

function byteSize(text: string): number {
  return new Blob([text]).size;
}

export default function SvgOptimizer() {
  const [svgInput, setSvgInput] = useState("<svg viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n  <path d=\"M12 2L2 22H22L12 2Z\" fill=\"#111827\"/>\n</svg>");
  const [options, setOptions] = useState<OptimizeOptions>({
    removeComments: true,
    removeMetadata: true,
    collapseWhitespace: true,
  });
  const [copied, setCopied] = useState(false);

  const optimizedResult = useMemo(() => {
    try {
      return {
        output: optimizeSvg(svgInput, options),
        error: "",
      };
    } catch (error) {
      return {
        output: "",
        error: (error as Error).message || "Unable to optimize SVG.",
      };
    }
  }, [svgInput, options]);

  const optimized = optimizedResult.output;
  const inputBytes = useMemo(() => byteSize(svgInput), [svgInput]);
  const outputBytes = useMemo(() => byteSize(optimized), [optimized]);
  const savings = useMemo(() => {
    if (!inputBytes) return 0;
    return Math.max(0, (1 - outputBytes / inputBytes) * 100);
  }, [inputBytes, outputBytes]);

  const copyOutput = async () => {
    if (!optimized) return;
    await navigator.clipboard.writeText(optimized);
    setCopied(true);
    toast.success("Optimized SVG copied");
    window.setTimeout(() => setCopied(false), 1200);
  };

  const downloadOutput = () => {
    if (!optimized) return;
    const blob = new Blob([optimized], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "optimized.svg";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="SVG Optimizer — Minify and Clean SVG Markup | Minerva's Tools"
        description="Reduce SVG markup with configurable SVGO cleanup options, then copy or download the result."
        canonical="/tools/svg-optimizer"
      />
      <ToolSchema
        name="SVG Optimizer"
        description="Optimize SVG markup locally with SVGO-based processing controls."
        url="/tools/svg-optimizer"
        faqs={svgOptimizerContent.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 sm:px-6 py-10 lg:py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">SVG Optimizer</h1>
            <p className="mt-1 text-muted-foreground">Reduce SVG markup with configurable cleanup options.</p>
          </div>
          <ShareToolButton toolName="SVG Optimizer" />
        </div>

        <section className="rounded-lg border border-border bg-card p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={options.removeComments}
                onChange={(event) => setOptions((previous) => ({ ...previous, removeComments: event.target.checked }))}
              />
              Remove comments
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={options.removeMetadata}
                onChange={(event) => setOptions((previous) => ({ ...previous, removeMetadata: event.target.checked }))}
              />
              Remove metadata/title/desc
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={options.collapseWhitespace}
                onChange={(event) => setOptions((previous) => ({ ...previous, collapseWhitespace: event.target.checked }))}
              />
              Collapse whitespace
            </label>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <p className="mb-1.5 text-sm font-medium">Input SVG</p>
              <Textarea
                value={svgInput}
                onChange={(event) => setSvgInput(event.target.value)}
                className={`min-h-[320px] font-mono text-xs ${TOOL_TEXTAREA_OUTLINE_CLASS}`}
              />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-sm font-medium">Optimized Output</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={() => void copyOutput()} disabled={!optimized}>
                    {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />} Copy
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={downloadOutput} disabled={!optimized}>
                    <DownloadSimple className="size-3.5" /> Download
                  </Button>
                </div>
              </div>
              <Textarea readOnly value={optimizedResult.error || optimized} className={`min-h-[320px] font-mono text-xs ${TOOL_TEXTAREA_OUTLINE_CLASS} ${optimizedResult.error ? "text-destructive" : ""}`} />
            </div>
          </div>

          <div className="rounded-md border border-border bg-muted/20 p-3 text-sm text-muted-foreground">
            Input: {inputBytes.toLocaleString()} bytes • Output: {outputBytes.toLocaleString()} bytes • Saved: {savings.toFixed(1)}%
          </div>
        </section>

        <ToolContent about={svgOptimizerContent.about} faqs={svgOptimizerContent.faqs} />
      </main>

      <Footer />
    </div>
  );
}
