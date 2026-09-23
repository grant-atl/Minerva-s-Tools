import { useMemo, useState } from "react";
import { Check, Copy, ArrowsClockwise } from "@phosphor-icons/react";
import { toast } from "sonner";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolSchema from "@/components/ToolSchema";
import ToolContent from "@/components/ToolContent";
import { base64Content } from "@/lib/tool-content-data";
import { TOOL_SPLIT_PANE_HEADER_CLASS, TOOL_TEXTAREA_OUTLINE_CLASS } from "@/lib/tool-ui";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function encodeUtf8(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function decodeUtf8(value: string): string {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export default function Base64EncoderDecoder() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("Minerva's Tools");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    try {
      return {
        output: mode === "encode" ? encodeUtf8(input) : decodeUtf8(input.trim()),
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
        title="Base64 Encoder/Decoder — Convert Text and Base64 | Minerva's Tools"
        description="Encode UTF-8 text as Base64 or decode Base64 back to text."
        canonical="/tools/base64"
      />
      <ToolSchema
        name="Base64 Encoder/Decoder"
        description="Encode UTF-8 text into Base64 and decode Base64 content back to text."
        url="/tools/base64"
        faqs={base64Content.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 sm:px-6 py-10 lg:py-12">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Base64 Encoder/Decoder</h1>
            <p className="mt-1 text-muted-foreground">Encode text as Base64 or decode Base64 back to text.</p>
          </div>
          <ShareToolButton toolName="Base64 Encoder/Decoder" />
        </div>

        <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap gap-2">
            <Button size="sm" variant={mode === "encode" ? "default" : "outline"} onClick={() => setMode("encode")}>Encode</Button>
            <Button size="sm" variant={mode === "decode" ? "default" : "outline"} onClick={() => setMode("decode")}>Decode</Button>
            <Button size="sm" variant="outline" className="gap-1" onClick={() => setInput("")}>
              <ArrowsClockwise className="size-3.5" /> Clear
            </Button>
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
                placeholder={mode === "encode" ? "Enter text" : "Enter Base64"}
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

        <ToolContent about={base64Content.about} faqs={base64Content.faqs} />
      </main>

      <Footer />
    </div>
  );
}
