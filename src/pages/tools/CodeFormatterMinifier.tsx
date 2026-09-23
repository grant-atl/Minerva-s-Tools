import { useEffect, useState } from "react";
import { Check, Copy, ArrowsClockwise } from "@phosphor-icons/react";
import { toast } from "sonner";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolSchema from "@/components/ToolSchema";
import ToolContent from "@/components/ToolContent";
import { codeFormatterMinifierContent } from "@/lib/tool-content-data";
import { TOOL_TEXTAREA_OUTLINE_CLASS } from "@/lib/tool-ui";
import { transformCode, type CodeLanguage, type CodeMode } from "@/lib/code-transformers";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function CodeFormatterMinifier() {
  const [language, setLanguage] = useState<CodeLanguage>("html");
  const [mode, setMode] = useState<CodeMode>("format");
  const [input, setInput] = useState("<div class=\"card\"><h1>Hello</h1><p>Minerva's Tools</p></div>");
  const [output, setOutput] = useState("");
  const [transformError, setTransformError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          setIsProcessing(true);
          setTransformError("");
          const nextOutput = await transformCode(input, language, mode);
          if (!cancelled) {
            setOutput(nextOutput);
          }
        } catch (error) {
          if (!cancelled) {
            setOutput("");
            setTransformError((error as Error).message || "Unable to transform input.");
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
  }, [input, language, mode]);

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Output copied");
    window.setTimeout(() => setCopied(false), 1100);
  };

  const loadSample = () => {
    if (language === "html") {
      setInput("<main><h1>Heading</h1><p>Paragraph text</p></main>");
      return;
    }

    if (language === "css") {
      setInput(".card { display: flex; gap: 12px; color: #111827; }");
      return;
    }

    setInput("function greet(name) { console.log('hello ' + name); return true; }");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Code Formatter & Minifier — HTML, CSS, JS | Minerva's Tools"
        description="Format or minify HTML, CSS, and JavaScript in your browser."
        canonical="/tools/code-formatter-minifier"
      />
      <ToolSchema
        name="Code Formatter & Minifier"
        description="Format and minify HTML, CSS, and JavaScript code locally."
        url="/tools/code-formatter-minifier"
        faqs={codeFormatterMinifierContent.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 sm:px-6 py-10 lg:py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Code Formatter & Minifier</h1>
            <p className="mt-1 text-muted-foreground">Parser-based transforms for HTML, CSS, and JavaScript that run entirely in your browser.</p>
          </div>
          <ShareToolButton toolName="Code Formatter & Minifier" />
        </div>

        <section className="rounded-lg border border-border bg-card p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            <select
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              value={language}
              onChange={(event) => setLanguage(event.target.value as "html" | "css" | "js")}
            >
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="js">JavaScript</option>
            </select>
            <select
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              value={mode}
              onChange={(event) => setMode(event.target.value as "format" | "minify")}
            >
              <option value="format">Format</option>
              <option value="minify">Minify</option>
            </select>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={loadSample}>
              <ArrowsClockwise className="size-3.5" /> Sample
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => void copyOutput()} disabled={!output}>
              {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />} Copy output
            </Button>
            <div className="ml-auto text-xs text-muted-foreground">
              {isProcessing ? "Processing…" : "Local-only processing"}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <p className="mb-1.5 text-sm font-medium">Input</p>
              <Textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className={`min-h-[320px] font-mono text-xs ${TOOL_TEXTAREA_OUTLINE_CLASS}`}
              />
            </div>
            <div>
              <p className="mb-1.5 text-sm font-medium">Output</p>
              <Textarea
                readOnly
                value={transformError || output}
                className={`min-h-[320px] font-mono text-xs ${TOOL_TEXTAREA_OUTLINE_CLASS} ${transformError ? "text-destructive" : ""}`}
              />
            </div>
          </div>
        </section>

        <ToolContent about={codeFormatterMinifierContent.about} faqs={codeFormatterMinifierContent.faqs} />
      </main>

      <Footer />
    </div>
  );
}
