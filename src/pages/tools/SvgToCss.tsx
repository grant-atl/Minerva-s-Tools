import { useState, useRef, useCallback, useMemo } from "react";
import { Copy, UploadSimple, Trash, Code } from "@phosphor-icons/react";
import svgToMiniDataUri from "mini-svg-data-uri";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolContent from "@/components/ToolContent";
import ToolSchema from "@/components/ToolSchema";
import { svgToCssContent } from "@/lib/tool-content-data";

function encodeSvg(raw: string, encodeUri: boolean): string {
  const svg = raw.trim();

  if (encodeUri) {
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }

  return `url("${svgToMiniDataUri(svg)}")`;
}

function isValidSvgMarkup(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  const parser = new DOMParser();
  const doc = parser.parseFromString(trimmed, "image/svg+xml");
  if (doc.querySelector("parsererror")) return false;
  return doc.documentElement.tagName.toLowerCase() === "svg";
}

export default function SvgToCss() {
  const [svgInput, setSvgInput] = useState("");
  const [encodeUri, setEncodeUri] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const isValid = useMemo(() => isValidSvgMarkup(svgInput), [svgInput]);
  const cssValue = useMemo(() => (isValid ? encodeSvg(svgInput, encodeUri) : ""), [svgInput, encodeUri, isValid]);
  const fullCss = cssValue
    ? `.element {\n  background-image: ${cssValue};\n  background-repeat: no-repeat;\n  background-size: contain;\n  background-position: center;\n}`
    : "";

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".svg")) {
      toast.error("Please upload an SVG file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSvgInput(reader.result);
        toast.success("SVG loaded");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.name.endsWith(".svg")) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSvgInput(reader.result);
        toast.success("SVG loaded");
      }
    };
    reader.readAsText(file);
  }, []);

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="SVG to CSS Converter — Inline SVG as CSS Background Image | Minerva's Tools"
        description="Convert SVG code to a CSS background-image data URI. Paste or upload an SVG and get ready-to-use CSS. Free, client-side, no sign-up."
        canonical="/tools/svg-to-css"
      />
      <ToolSchema
        name="SVG to CSS Converter"
        description="Convert SVG to inline CSS background images"
        url="/tools/svg-to-css"
        faqs={svgToCssContent.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 sm:px-6 pt-10 pb-20">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">SVG to CSS Converter</h1>
            <p className="text-sm text-muted-foreground">
              Convert SVG to inline CSS background images
            </p>
          </div>
          <ShareToolButton toolName="SVG to CSS Converter" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">SVG Input</h2>
              <div className="flex items-center gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept=".svg"
                  className="hidden"
                  onChange={handleFile}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileRef.current?.click()}
                  className="gap-1.5"
                >
                  <UploadSimple size={14} weight="bold" />
                  Upload SVG
                </Button>
                {svgInput && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSvgInput("")}
                    className="gap-1.5 text-muted-foreground"
                  >
                    <Trash size={14} weight="bold" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <Textarea
                value={svgInput}
                onChange={(e) => setSvgInput(e.target.value)}
                placeholder="Paste SVG code here or drag & drop an .svg file…"
                className="font-mono text-xs min-h-[320px] resize-y border-2 border-border focus-visible:border-primary"
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={encodeUri}
                onCheckedChange={setEncodeUri}
                id="encode-mode"
              />
              <label htmlFor="encode-mode" className="text-sm text-muted-foreground cursor-pointer">
                Full URI encoding <span className="text-xs opacity-60">(safer but longer)</span>
              </label>
            </div>
          </div>

          {/* Output */}
          <div className="space-y-4">
            {/* Preview */}
            <h2 className="text-sm font-semibold">Live Preview</h2>
            <div
              className="rounded-lg border border-border bg-muted/30 min-h-[200px] flex items-center justify-center p-6"
              style={
                isValid
                  ? {
                      backgroundImage: cssValue,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "contain",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
            >
              {!isValid && (
                <p className="text-xs text-muted-foreground">
                  {svgInput ? "Input doesn't look like valid SVG" : "Preview appears here"}
                </p>
              )}
            </div>

            {/* CSS output */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">CSS Output</h2>
              {fullCss && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(fullCss, "CSS")}
                  className="gap-1.5"
                >
                  <Copy size={14} weight="bold" />
                  Copy CSS
                </Button>
              )}
            </div>

            <div className="relative rounded-lg border border-border bg-muted/30 p-4 min-h-[120px]">
              {fullCss ? (
                <pre className="font-mono text-xs text-foreground whitespace-pre-wrap break-all">
                  {fullCss}
                </pre>
              ) : (
                <p className="text-xs text-muted-foreground">
                  CSS output will appear here
                </p>
              )}
            </div>

            {/* Data URI only */}
            {cssValue && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(cssValue, "Data URI")}
                className="gap-1.5 text-muted-foreground"
              >
                <Code size={14} weight="bold" />
                Copy data URI only
              </Button>
            )}
          </div>
        </div>
      </main>

      <ToolContent about={svgToCssContent.about} faqs={svgToCssContent.faqs} />
      <Footer />
    </div>
  );
}
