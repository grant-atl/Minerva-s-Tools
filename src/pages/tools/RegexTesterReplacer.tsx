import { useMemo, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { toast } from "sonner";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolSchema from "@/components/ToolSchema";
import ToolContent from "@/components/ToolContent";
import { regexTesterContent } from "@/lib/tool-content-data";
import { TOOL_TEXTAREA_OUTLINE_CLASS } from "@/lib/tool-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface RegexMatchResult {
  value: string;
  index: number;
  groups: string[];
}

function sanitizeFlags(rawFlags: string): string {
  const valid = rawFlags.replace(/[^dgimsuvy]/g, "");
  return [...new Set(valid)].join("");
}

export default function RegexTesterReplacer() {
  const [pattern, setPattern] = useState("\\b[A-Z][a-z]+\\b");
  const [flagsInput, setFlagsInput] = useState("g");
  const [testText, setTestText] = useState("Minerva's Tools helps designers and developers ship faster.");
  const [replaceWith, setReplaceWith] = useState("[$&]");
  const [copiedReplacement, setCopiedReplacement] = useState(false);

  const flags = useMemo(() => sanitizeFlags(flagsInput), [flagsInput]);

  const analysis = useMemo(() => {
    try {
      const regex = new RegExp(pattern, flags);
      const matches: RegexMatchResult[] = [];
      if (flags.includes("g")) {
        for (const matched of testText.matchAll(regex)) {
          matches.push({
            value: matched[0],
            index: matched.index ?? 0,
            groups: matched.slice(1).map((group) => group ?? ""),
          });
        }
      } else {
        const matched = regex.exec(testText);
        if (matched) {
          matches.push({
            value: matched[0],
            index: matched.index ?? 0,
            groups: matched.slice(1).map((group) => group ?? ""),
          });
        }
      }

      const replacement = testText.replace(regex, replaceWith);
      return { matches, replacement, error: null as string | null };
    } catch (error) {
      return { matches: [] as RegexMatchResult[], replacement: "", error: (error as Error).message };
    }
  }, [pattern, flags, replaceWith, testText]);

  const copyReplacement = async () => {
    await navigator.clipboard.writeText(analysis.replacement);
    setCopiedReplacement(true);
    toast.success("Replacement output copied");
    window.setTimeout(() => setCopiedReplacement(false), 1400);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Regex Tester & Replacer — Test Patterns and Substitutions | Minerva's Tools"
        description="Test JavaScript regular expressions, inspect match groups, and preview replacement output instantly."
        canonical="/tools/regex-tester"
      />
      <ToolSchema
        name="Regex Tester & Replacer"
        description="Test JavaScript regular expressions with live match inspection and replacement previews."
        url="/tools/regex-tester"
        faqs={regexTesterContent.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 py-10 sm:px-6 lg:py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Regex Tester & Replacer</h1>
            <p className="mt-1 text-muted-foreground">Validate patterns, inspect matches, and test replacements in real time.</p>
          </div>
          <ShareToolButton toolName="Regex Tester & Replacer" />
        </div>

        <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
          <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_120px]">
            <div>
              <p className="mb-1.5 text-sm font-medium">Pattern</p>
              <Input value={pattern} onChange={(event) => setPattern(event.target.value)} placeholder="Enter regex pattern without slashes" className="font-mono" />
            </div>
            <div>
              <p className="mb-1.5 text-sm font-medium">Flags</p>
              <Input value={flagsInput} onChange={(event) => setFlagsInput(event.target.value)} placeholder="gim" className="font-mono" />
            </div>
          </div>

          <div className="mb-4">
            <p className="mb-1.5 text-sm font-medium">Test Text</p>
            <Textarea
              value={testText}
              onChange={(event) => setTestText(event.target.value)}
              className={`min-h-[180px] font-mono text-xs ${TOOL_TEXTAREA_OUTLINE_CLASS}`}
            />
          </div>

          <div className="mb-4">
            <p className="mb-1.5 text-sm font-medium">Replacement Pattern</p>
            <Input value={replaceWith} onChange={(event) => setReplaceWith(event.target.value)} className="font-mono" />
            <p className="mt-1 text-xs text-muted-foreground">Supports JavaScript replacement tokens like <code>$&</code>, <code>$1</code>, and <code>$2</code>.</p>
          </div>

          <div className="mb-4 rounded-md border border-border bg-muted/20 p-3 text-sm">
            <p className="font-medium">Compiled Regex</p>
            <p className="mt-1 font-mono text-xs">/{pattern}/{flags}</p>
            {analysis.error ? <p className="mt-2 text-destructive">Invalid regex: {analysis.error}</p> : <p className="mt-2 text-green-600">Pattern is valid.</p>}
          </div>

          {!analysis.error && (
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-md border border-border p-3">
                <p className="mb-2 text-sm font-medium">Matches ({analysis.matches.length})</p>
                {analysis.matches.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No matches found.</p>
                ) : (
                  <div className="max-h-[260px] space-y-2 overflow-auto pr-1">
                    {analysis.matches.map((match, index) => (
                      <div key={`${match.value}-${match.index}-${index}`} className="rounded-md border border-border bg-muted/20 p-2">
                        <p className="font-mono text-xs">{match.value}</p>
                        <p className="mt-1 text-xs text-muted-foreground">index: {match.index}</p>
                        {match.groups.length > 0 && <p className="mt-1 text-xs text-muted-foreground">groups: {match.groups.join(" | ") || "none"}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-md border border-border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium">Replacement Output</p>
                  <Button size="sm" variant="outline" className="gap-1" onClick={copyReplacement} disabled={!analysis.replacement}>
                    {copiedReplacement ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />} Copy
                  </Button>
                </div>
                <Textarea readOnly value={analysis.replacement} className={`min-h-[220px] font-mono text-xs ${TOOL_TEXTAREA_OUTLINE_CLASS}`} />
              </div>
            </div>
          )}
        </section>

        <ToolContent about={regexTesterContent.about} faqs={regexTesterContent.faqs} />
      </main>

      <Footer />
    </div>
  );
}
