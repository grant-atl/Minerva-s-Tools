import { useEffect, useState } from "react";
import { Check, Copy, ArrowsClockwise } from "@phosphor-icons/react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolSchema from "@/components/ToolSchema";
import ToolContent from "@/components/ToolContent";
import { uuidContent } from "@/lib/tool-content-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function makeUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return uuidv4();
}

function generateMany(count: number): string[] {
  return Array.from({ length: Math.max(1, Math.min(count, 100)) }, () => makeUuid());
}

export default function UUIDGenerator() {
  const [count, setCount] = useState(10);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedRow, setCopiedRow] = useState<string | null>(null);

  useEffect(() => {
    setUuids(generateMany(count));
  }, [count]);

  const regenerate = () => {
    setUuids(generateMany(count));
  };

  const copyRow = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedRow(value);
    toast.success("UUID copied");
    window.setTimeout(() => setCopiedRow(null), 1200);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(uuids.join("\n"));
    toast.success("All UUIDs copied");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="UUID Generator — Generate UUID v4 IDs | Minerva"
        description="Generate one or many UUID v4 identifiers instantly, then copy individual IDs or the full list."
        canonical="/tools/uuid"
      />
      <ToolSchema
        name="UUID Generator"
        description="Generate multiple UUID v4 identifiers in one click."
        url="/tools/uuid"
        faqs={uuidContent.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 sm:px-6 py-10 lg:py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">UUID Generator</h1>
            <p className="mt-1 text-muted-foreground">Generate secure UUID v4 values in bulk.</p>
          </div>
          <ShareToolButton toolName="UUID Generator" />
        </div>

        <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-end gap-3">
            <div>
              <Label className="mb-1.5 block text-sm">Count</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={count}
                onChange={(event) => setCount(Math.max(1, Math.min(100, Number(event.target.value) || 1)))}
                className="w-24"
              />
            </div>
            <Button className="gap-1" onClick={regenerate}>
              <ArrowsClockwise className="size-4" /> Generate
            </Button>
            <Button variant="outline" className="gap-1" onClick={copyAll} disabled={uuids.length === 0}>
              <Copy className="size-3.5" /> Copy All
            </Button>
          </div>

          <div className="max-h-[420px] overflow-auto rounded-md border border-border">
            <ul className="divide-y divide-border">
              {uuids.map((uuid) => (
                <li key={uuid} className="flex items-center gap-2 px-3 py-2">
                  <code className="flex-1 font-mono text-xs sm:text-sm">{uuid}</code>
                  <Button size="sm" variant="ghost" className="gap-1" onClick={() => copyRow(uuid)}>
                    {copiedRow === uuid ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />} Copy
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <ToolContent about={uuidContent.about} faqs={uuidContent.faqs} />
      </main>

      <Footer />
    </div>
  );
}
