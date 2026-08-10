import { useMemo, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { toast } from "sonner";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolSchema from "@/components/ToolSchema";
import ToolContent from "@/components/ToolContent";
import { jsonFormatterContent } from "@/lib/tool-content-data";
import { TOOL_TEXTAREA_OUTLINE_CLASS } from "@/lib/tool-ui";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const SAMPLE_JSON = `{
  "name": "Minerva's Tools",
  "version": 1,
  "features": ["format", "minify", "validate"],
  "active": true
}`;

export default function JsonFormatterValidator() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [copied, setCopied] = useState(false);

  const validation = useMemo(() => {
    try {
      const parsed = JSON.parse(input);
      return { valid: true, parsed, error: null as string | null };
    } catch (error) {
      return { valid: false, parsed: null, error: (error as Error).message };
    }
  }, [input]);

  const formatJson = (indent: number) => {
    if (!validation.valid || !validation.parsed) return;
    setInput(JSON.stringify(validation.parsed, null, indent));
  };

  const minifyJson = () => {
    if (!validation.valid || !validation.parsed) return;
    setInput(JSON.stringify(validation.parsed));
  };

  const copyInput = async () => {
    await navigator.clipboard.writeText(input);
    setCopied(true);
    toast.success("JSON copied");
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="JSON Formatter & Validator — Pretty Print JSON | Minerva's Tools"
        description="Format, minify, and validate JSON instantly with useful parse errors and one-click copy."
        canonical="/tools/json-formatter"
      />
      <ToolSchema
        name="JSON Formatter & Validator"
        description="Format, minify, and validate JSON with parse feedback."
        url="/tools/json-formatter"
        faqs={jsonFormatterContent.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 sm:px-6 py-10 lg:py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">JSON Formatter & Validator</h1>
            <p className="mt-1 text-muted-foreground">Pretty-print, minify, and validate JSON with fast feedback.</p>
          </div>
          <ShareToolButton toolName="JSON Formatter & Validator" />
        </div>

        <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={() => formatJson(2)} disabled={!validation.valid}>Format (2 spaces)</Button>
            <Button size="sm" variant="outline" onClick={() => formatJson(4)} disabled={!validation.valid}>Format (4 spaces)</Button>
            <Button size="sm" variant="outline" onClick={minifyJson} disabled={!validation.valid}>Minify</Button>
            <Button size="sm" variant="outline" className="gap-1" onClick={copyInput}>
              {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />} Copy
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setInput("")}>Clear</Button>
          </div>

          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className={`min-h-[320px] font-mono text-xs ${TOOL_TEXTAREA_OUTLINE_CLASS}`}
            placeholder="Paste JSON here"
          />

          <div className="mt-3 rounded-md border border-border bg-muted/20 p-3 text-sm">
            {validation.valid ? (
              <p className="text-green-600">Valid JSON</p>
            ) : (
              <p className="text-destructive">Invalid JSON: {validation.error}</p>
            )}
          </div>
        </section>

        <ToolContent about={jsonFormatterContent.about} faqs={jsonFormatterContent.faqs} />
      </main>

      <Footer />
    </div>
  );
}
