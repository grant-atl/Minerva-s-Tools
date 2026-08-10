import { useMemo, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { toast } from "sonner";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolSchema from "@/components/ToolSchema";
import ToolContent from "@/components/ToolContent";
import { jwtDecoderContent } from "@/lib/tool-content-data";
import { TOOL_TEXTAREA_OUTLINE_CLASS } from "@/lib/tool-ui";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1pbmVydmEgVXNlciIsImlhdCI6MTcxNTEwMDAwMCwiZXhwIjo0MTAyNDQ0ODAwfQ.signature";

function decodeBase64UrlToText(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const paddingLength = (4 - (normalized.length % 4 || 4)) % 4;
  const padded = normalized + "=".repeat(paddingLength);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function formatEpoch(value: unknown): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  const milliseconds = value > 9999999999 ? value : value * 1000;
  const date = new Date(milliseconds);
  if (Number.isNaN(date.getTime())) return "—";
  return `${date.toLocaleString()} (${date.toISOString()})`;
}

export default function JwtDecoderInspector() {
  const [token, setToken] = useState(SAMPLE_JWT);
  const [copiedSection, setCopiedSection] = useState<"header" | "payload" | null>(null);

  const parsed = useMemo(() => {
    const trimmed = token.trim();
    const sections = trimmed.split(".");
    if (sections.length !== 3) {
      return {
        valid: false,
        error: "JWT must have exactly 3 sections separated by periods.",
        header: null as Record<string, unknown> | null,
        payload: null as Record<string, unknown> | null,
        signature: "",
      };
    }

    try {
      const headerText = decodeBase64UrlToText(sections[0]);
      const payloadText = decodeBase64UrlToText(sections[1]);
      const header = JSON.parse(headerText) as Record<string, unknown>;
      const payload = JSON.parse(payloadText) as Record<string, unknown>;
      return {
        valid: true,
        error: null as string | null,
        header,
        payload,
        signature: sections[2],
      };
    } catch (error) {
      return {
        valid: false,
        error: (error as Error).message,
        header: null as Record<string, unknown> | null,
        payload: null as Record<string, unknown> | null,
        signature: sections[2] ?? "",
      };
    }
  }, [token]);

  const copyJson = async (section: "header" | "payload", value: Record<string, unknown> | null) => {
    if (!value) return;
    await navigator.clipboard.writeText(JSON.stringify(value, null, 2));
    setCopiedSection(section);
    toast.success(`${section[0].toUpperCase()}${section.slice(1)} copied`);
    window.setTimeout(() => setCopiedSection(null), 1400);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="JWT Decoder & Inspector — Decode Header and Claims | Minerva's Tools"
        description="Decode JWT tokens client-side, inspect header/payload claims, and review exp/iat/nbf timestamps."
        canonical="/tools/jwt-decoder"
      />
      <ToolSchema
        name="JWT Decoder & Inspector"
        description="Decode JWT header and payload claims client-side without sending token data to a server."
        url="/tools/jwt-decoder"
        faqs={jwtDecoderContent.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 py-10 sm:px-6 lg:py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">JWT Decoder & Inspector</h1>
            <p className="mt-1 text-muted-foreground">Decode token claims locally and inspect important timestamps instantly.</p>
          </div>
          <ShareToolButton toolName="JWT Decoder & Inspector" />
        </div>

        <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
          <p className="mb-1.5 text-sm font-medium">JWT Token</p>
          <Textarea
            value={token}
            onChange={(event) => setToken(event.target.value)}
            className={`min-h-[140px] font-mono text-xs ${TOOL_TEXTAREA_OUTLINE_CLASS}`}
            placeholder="Paste JWT token here"
          />

          <div className="mt-3 rounded-md border border-amber-300/50 bg-amber-50/70 p-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-200">
            Decoding does not verify signatures. Treat this tool as an inspector, not a trust validator.
          </div>

          {parsed.error && <p className="mt-3 text-sm text-destructive">Invalid token: {parsed.error}</p>}

          {parsed.valid && parsed.header && parsed.payload && (
            <>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className="rounded-md border border-border p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium">Header</p>
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => copyJson("header", parsed.header)}>
                      {copiedSection === "header" ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />} Copy
                    </Button>
                  </div>
                  <Textarea readOnly value={JSON.stringify(parsed.header, null, 2)} className={`min-h-[220px] font-mono text-xs ${TOOL_TEXTAREA_OUTLINE_CLASS}`} />
                </div>

                <div className="rounded-md border border-border p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium">Payload</p>
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => copyJson("payload", parsed.payload)}>
                      {copiedSection === "payload" ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />} Copy
                    </Button>
                  </div>
                  <Textarea readOnly value={JSON.stringify(parsed.payload, null, 2)} className={`min-h-[220px] font-mono text-xs ${TOOL_TEXTAREA_OUTLINE_CLASS}`} />
                </div>
              </div>

              <div className="mt-4 rounded-md border border-border bg-muted/20 p-3 text-sm">
                <p className="mb-2 font-medium">Claim Summary</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <p><span className="text-muted-foreground">Algorithm:</span> {String(parsed.header.alg ?? "—")}</p>
                  <p><span className="text-muted-foreground">Type:</span> {String(parsed.header.typ ?? "—")}</p>
                  <p><span className="text-muted-foreground">Issued At (iat):</span> {formatEpoch(parsed.payload.iat)}</p>
                  <p><span className="text-muted-foreground">Not Before (nbf):</span> {formatEpoch(parsed.payload.nbf)}</p>
                  <p className="sm:col-span-2"><span className="text-muted-foreground">Expires (exp):</span> {formatEpoch(parsed.payload.exp)}</p>
                  <p className="sm:col-span-2"><span className="text-muted-foreground">Signature length:</span> {parsed.signature.length} chars</p>
                </div>
              </div>
            </>
          )}
        </section>

        <ToolContent about={jwtDecoderContent.about} faqs={jwtDecoderContent.faqs} />
      </main>

      <Footer />
    </div>
  );
}
