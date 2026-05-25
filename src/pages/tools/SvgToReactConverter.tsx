import { useEffect, useMemo, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import type { Config, Plugin, State } from "@svgr/core";
import { toast } from "sonner";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolSchema from "@/components/ToolSchema";
import ToolContent from "@/components/ToolContent";
import { svgToReactContent } from "@/lib/tool-content-data";
import { TOOL_TEXTAREA_OUTLINE_CLASS } from "@/lib/tool-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

let svgrCache:
  | Promise<{
      transform: (code: string, config?: Config, state?: Partial<State>) => Promise<string>;
      svgoPlugin: Plugin;
      jsxPlugin: Plugin;
    }>
  | null = null;

function resolveDefault<T>(mod: T | { default?: T }): T {
  return (mod as { default?: T }).default ?? (mod as T);
}

async function loadSvgr() {
  if (!svgrCache) {
    svgrCache = Promise.all([
      import("@svgr/core"),
      import("@svgr/plugin-svgo"),
      import("@svgr/plugin-jsx"),
    ]).then(([core, svgoPlugin, jsxPlugin]) => ({
      transform: core.transform,
      svgoPlugin: resolveDefault<Plugin>(svgoPlugin),
      jsxPlugin: resolveDefault<Plugin>(jsxPlugin),
    }));
  }

  return svgrCache;
}

function toComponentName(raw: string): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9]+/g, " ").trim();
  if (!cleaned) return "SvgIcon";
  const parts = cleaned.split(/\s+/).map((part) => part.charAt(0).toUpperCase() + part.slice(1));
  const name = parts.join("");
  if (/^[0-9]/.test(name)) return `Svg${name}`;
  return name;
}

function sanitizeSvg(svg: string): string {
  return svg
    .replace(/<\?xml[\s\S]*?\?>/gi, "")
    .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
    .trim();
}

function validateSvgMarkup(svg: string): void {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, "image/svg+xml");
  if (doc.querySelector("parsererror")) {
    throw new Error("Invalid SVG markup. Please provide valid SVG XML.");
  }

  if (doc.documentElement.tagName.toLowerCase() !== "svg") {
    throw new Error("Input must contain a root <svg> element.");
  }
}

async function convertSvgToReact(svg: string, componentName: string, useTsx: boolean): Promise<string> {
  const cleanedSvg = sanitizeSvg(svg);
  validateSvgMarkup(cleanedSvg);

  const { transform, svgoPlugin, jsxPlugin } = await loadSvgr();

  return transform(
    cleanedSvg,
    {
      plugins: [svgoPlugin, jsxPlugin],
      typescript: useTsx,
      expandProps: "end",
      svgo: true,
      prettier: false,
      runtimeConfig: false,
      jsxRuntime: "classic",
      svgoConfig: {
        plugins: [{ name: "preset-default" }],
      },
    },
    { componentName },
  );
}

export default function SvgToReactConverter() {
  const [componentNameInput, setComponentNameInput] = useState("BrandIcon");
  const [useTsx, setUseTsx] = useState(true);
  const [svgInput, setSvgInput] = useState("<svg viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n  <path d=\"M12 2L2 22H22L12 2Z\" fill=\"currentColor\"/>\n</svg>");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const componentName = useMemo(() => toComponentName(componentNameInput), [componentNameInput]);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          setIsProcessing(true);
          setError("");
          const nextCode = await convertSvgToReact(svgInput, componentName, useTsx);
          if (!cancelled) {
            setCode(nextCode);
          }
        } catch (transformError) {
          if (!cancelled) {
            setCode("");
            setError((transformError as Error).message || "Unable to convert SVG.");
          }
        } finally {
          if (!cancelled) {
            setIsProcessing(false);
          }
        }
      })();
    }, 120);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [svgInput, componentName, useTsx]);

  const handleCopy = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Component code copied");
    window.setTimeout(() => setCopied(false), 1300);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="SVG to React Converter — JSX/TSX Component Generator | Minerva"
        description="Convert raw SVG markup into reusable React component code instantly."
        canonical="/tools/svg-to-react"
      />
      <ToolSchema
        name="SVG to React Converter"
        description="Transform SVG markup into React component code with JSX-friendly attributes."
        url="/tools/svg-to-react"
        faqs={svgToReactContent.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 sm:px-6 py-10 lg:py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">SVG to React Converter</h1>
            <p className="mt-1 text-muted-foreground">Generate JSX/TSX component code from SVG markup using SVGR.</p>
          </div>
          <ShareToolButton toolName="SVG to React Converter" />
        </div>

        <section className="rounded-lg border border-border bg-card p-4 sm:p-5 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="component-name" className="text-sm font-medium">Component name</label>
              <Input
                id="component-name"
                value={componentNameInput}
                onChange={(event) => setComponentNameInput(event.target.value)}
                placeholder="BrandIcon"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="output-type" className="text-sm font-medium">Output type</label>
              <select
                id="output-type"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={useTsx ? "tsx" : "jsx"}
                onChange={(event) => setUseTsx(event.target.value === "tsx")}
              >
                <option value="tsx">TypeScript (TSX)</option>
                <option value="jsx">JavaScript (JSX)</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <p className="mb-1.5 text-sm font-medium">SVG Input</p>
              <Textarea
                value={svgInput}
                onChange={(event) => setSvgInput(event.target.value)}
                className={`min-h-[340px] font-mono text-xs ${TOOL_TEXTAREA_OUTLINE_CLASS}`}
              />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <p className="text-sm font-medium">React Output ({componentName})</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{isProcessing ? "Processing…" : "Local-only processing"}</span>
                  <Button size="sm" variant="outline" className="gap-1.5" disabled={!code} onClick={() => void handleCopy()}>
                    {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />} Copy
                  </Button>
                </div>
              </div>
              <Textarea
                readOnly
                value={error || code}
                className={`min-h-[340px] font-mono text-xs ${TOOL_TEXTAREA_OUTLINE_CLASS} ${error ? "text-destructive" : ""}`}
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </section>

        <ToolContent about={svgToReactContent.about} faqs={svgToReactContent.faqs} />
      </main>

      <Footer />
    </div>
  );
}
