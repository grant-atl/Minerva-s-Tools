import { useMemo, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { toast } from "sonner";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolSchema from "@/components/ToolSchema";
import ToolContent from "@/components/ToolContent";
import { textUtilitiesContent } from "@/lib/tool-content-data";
import { TOOL_TEXTAREA_OUTLINE_CLASS } from "@/lib/tool-ui";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function toTitleCase(text: string): string {
  return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

function toSentenceCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s+\w)/g, (char) => char.toUpperCase());
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toWords(text: string): string[] {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function toCamelCase(text: string): string {
  const words = toWords(text.toLowerCase());
  if (words.length === 0) return "";
  return words[0] + words.slice(1).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("");
}

function toPascalCase(text: string): string {
  return toWords(text.toLowerCase())
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

function toSnakeCase(text: string): string {
  return toWords(text.toLowerCase()).join("_");
}

function toKebabCase(text: string): string {
  return toWords(text.toLowerCase()).join("-");
}

export default function TextUtilities() {
  const [input, setInput] = useState("Design tools that feel fast, clear, and quietly premium.");
  const [copiedField, setCopiedField] = useState("");

  const outputMap = useMemo(() => {
    const words = toWords(input);
    return {
      lowercase: input.toLowerCase(),
      uppercase: input.toUpperCase(),
      titleCase: toTitleCase(input),
      sentenceCase: toSentenceCase(input),
      slug: toSlug(input),
      camelCase: toCamelCase(input),
      pascalCase: toPascalCase(input),
      snakeCase: toSnakeCase(input),
      kebabCase: toKebabCase(input),
      words: words.length,
      chars: input.length,
      charsNoSpaces: input.replace(/\s/g, "").length,
      lines: input ? input.split(/\n/).length : 0,
    };
  }, [input]);

  const copyField = async (key: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedField(key);
    toast.success(`${key} copied`);
    window.setTimeout(() => setCopiedField(""), 1200);
  };

  const rows = [
    ["lowercase", outputMap.lowercase],
    ["UPPERCASE", outputMap.uppercase],
    ["Title Case", outputMap.titleCase],
    ["Sentence case", outputMap.sentenceCase],
    ["slug", outputMap.slug],
    ["camelCase", outputMap.camelCase],
    ["PascalCase", outputMap.pascalCase],
    ["snake_case", outputMap.snakeCase],
    ["kebab-case", outputMap.kebabCase],
  ] as const;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Text Utilities — Case Converter, Slugger, Counters | Minerva"
        description="Convert text case formats, generate URL slugs, and view word/character counters instantly."
        canonical="/tools/text-utilities"
      />
      <ToolSchema
        name="Text Utilities"
        description="Case conversion, slug generation, and text counts in a single browser tool."
        url="/tools/text-utilities"
        faqs={textUtilitiesContent.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 sm:px-6 py-10 lg:py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Text Utilities</h1>
            <p className="mt-1 text-muted-foreground">Case conversion, slug generation, and quick text stats.</p>
          </div>
          <ShareToolButton toolName="Text Utilities" />
        </div>

        <section className="rounded-lg border border-border bg-card p-4 sm:p-5 space-y-4">
          <div>
            <p className="mb-1.5 text-sm font-medium">Input</p>
            <Textarea value={input} onChange={(event) => setInput(event.target.value)} className={`min-h-[180px] font-mono text-xs ${TOOL_TEXTAREA_OUTLINE_CLASS}`} />
          </div>

          <div className="grid gap-2">
            {rows.map(([label, value]) => (
              <div key={label} className="flex flex-col gap-2 rounded-md border border-border bg-muted/20 p-2 sm:flex-row sm:items-center">
                <div className="min-w-32 text-xs font-medium text-muted-foreground">{label}</div>
                <div className="flex-1 overflow-x-auto text-xs font-mono">{value || <span className="text-muted-foreground">(empty)</span>}</div>
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => void copyField(label, value)} disabled={!value}>
                  {copiedField === label ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />} Copy
                </Button>
              </div>
            ))}
          </div>

          <div className="grid gap-2 rounded-md border border-border bg-muted/20 p-3 text-sm sm:grid-cols-4">
            <p><span className="font-medium">Words:</span> {outputMap.words}</p>
            <p><span className="font-medium">Characters:</span> {outputMap.chars}</p>
            <p><span className="font-medium">No spaces:</span> {outputMap.charsNoSpaces}</p>
            <p><span className="font-medium">Lines:</span> {outputMap.lines}</p>
          </div>
        </section>

        <ToolContent about={textUtilitiesContent.about} faqs={textUtilitiesContent.faqs} />
      </main>

      <Footer />
    </div>
  );
}
