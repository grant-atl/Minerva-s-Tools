import { useMemo, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { toast } from "sonner";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolSchema from "@/components/ToolSchema";
import ToolContent from "@/components/ToolContent";
import { urlEncoderContent } from "@/lib/tool-content-data";
import { TOOL_SPLIT_PANE_HEADER_CLASS, TOOL_TEXTAREA_OUTLINE_CLASS } from "@/lib/tool-ui";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function UrlEncoderDecoder() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("https://minervas.tools/tools?query=design tools&lang=en");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    try {
      return {
        output: mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input),
        error: null as string | null,
      };
    } catch (error) {
      return {
        output: "",
        error: (error as Error).message,
      };
    }
  }, [input, mode]);

  const copyOutput = async () => {
    if (!result.output) return;
    await navigator.clipboard.writeText(result.output);
    setCopied(true);
    toast.success("Output copied");
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="URL Encoder/Decoder — Encode and Decode URL Components | Minerva's Tools"
        description="Encode text for URL components or decode percent-encoded input."
        canonical="/tools/url-encode"
      />
      <ToolSchema
        name="URL Encoder/Decoder"
        description="Encode and decode URL strings and query components safely."
        url="/tools/url-encode"
        faqs={urlEncoderContent.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 sm:px-6 py-10 lg:py-12">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">URL Encoder/Decoder</h1>
            <p className="mt-1 text-muted-foreground">Convert human-readable text to URL-safe form and back.</p>
          </div>
          <ShareToolButton toolName="URL Encoder/Decoder" />
        </div>

        <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap gap-2">
            <Button size="sm" variant={mode === "encode" ? "default" : "outline"} onClick={() => setMode("encode")}>Encode</Button>
            <Button size="sm" variant={mode === "decode" ? "default" : "outline"} onClick={() => setMode("decode")}>Decode</Button>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <div className={TOOL_SPLIT_PANE_HEADER_CLASS}>
                <p className="text-sm font-medium">Input</p>
              </div>
              <Textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className={`min-h-[220px] font-mono text-xs ${TOOL_TEXTAREA_OUTLINE_CLASS}`}
              />
            </div>
            <div>
              <div className={TOOL_SPLIT_PANE_HEADER_CLASS}>
                <p className="text-sm font-medium">Output</p>
                <Button size="sm" variant="outline" className="gap-1" onClick={copyOutput} disabled={!result.output}>
                  {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />} Copy
                </Button>
              </div>
              <Textarea readOnly value={result.output} className={`min-h-[220px] font-mono text-xs ${TOOL_TEXTAREA_OUTLINE_CLASS}`} />
            </div>
          </div>

          {result.error && <p className="mt-3 text-sm text-destructive">{result.error}</p>}
        </section>

        <ToolContent about={urlEncoderContent.about} faqs={urlEncoderContent.faqs} />
      </main>

      <Footer />
    </div>
  );
}
