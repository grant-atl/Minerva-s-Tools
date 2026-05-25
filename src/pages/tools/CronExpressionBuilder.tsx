import { useMemo, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { CronExpressionParser } from "cron-parser";
import { toast } from "sonner";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolSchema from "@/components/ToolSchema";
import ToolContent from "@/components/ToolContent";
import { cronBuilderContent } from "@/lib/tool-content-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FieldSpec {
  key: "minute" | "hour" | "dayOfMonth" | "month" | "dayOfWeek";
  label: string;
  min: number;
  max: number;
}

const FIELD_SPECS: FieldSpec[] = [
  { key: "minute", label: "Minute", min: 0, max: 59 },
  { key: "hour", label: "Hour", min: 0, max: 23 },
  { key: "dayOfMonth", label: "Day of Month", min: 1, max: 31 },
  { key: "month", label: "Month", min: 1, max: 12 },
  { key: "dayOfWeek", label: "Day of Week", min: 0, max: 7 },
];

function ensureFiveFields(expression: string): void {
  const fields = expression.trim().split(/\s+/);
  if (fields.length !== 5) {
    throw new Error("Cron expression must contain exactly 5 fields.");
  }
}

function getNextRuns(expression: string, count = 5): Date[] {
  ensureFiveFields(expression);
  const interval = CronExpressionParser.parse(expression, { currentDate: new Date() });
  const result: Date[] = [];
  for (let index = 0; index < count; index += 1) {
    result.push(interval.next().toDate());
  }
  return result;
}

function describeField(raw: string, spec: FieldSpec): string {
  const trimmed = raw.trim();
  if (trimmed === "*") return `every ${spec.label.toLowerCase()}`;
  if (trimmed.startsWith("*/")) return `every ${trimmed.slice(2)} ${spec.label.toLowerCase()}(s)`;
  return `${spec.label.toLowerCase()}: ${trimmed}`;
}

export default function CronExpressionBuilder() {
  const [fields, setFields] = useState({
    minute: "0",
    hour: "9",
    dayOfMonth: "*",
    month: "*",
    dayOfWeek: "1-5",
  });
  const [copied, setCopied] = useState(false);

  const expression = `${fields.minute} ${fields.hour} ${fields.dayOfMonth} ${fields.month} ${fields.dayOfWeek}`;

  const parsed = useMemo(() => {
    try {
      return {
        valid: true,
        error: null as string | null,
        nextRuns: getNextRuns(expression),
      };
    } catch (error) {
      return {
        valid: false,
        error: (error as Error).message,
        nextRuns: [] as Date[],
      };
    }
  }, [expression]);

  const summary = useMemo(
    () =>
      FIELD_SPECS.map((spec) => {
        const value = fields[spec.key];
        return describeField(value, spec);
      }).join(", "),
    [fields],
  );

  const copyExpression = async () => {
    await navigator.clipboard.writeText(expression);
    setCopied(true);
    toast.success("Cron expression copied");
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Cron Expression Builder — Validate and Explain Schedules | Minerva"
        description="Build 5-field cron expressions, validate syntax, and preview upcoming run times."
        canonical="/tools/cron-builder"
      />
      <ToolSchema
        name="Cron Expression Builder"
        description="Build and validate 5-field cron schedules with plain-language summaries and upcoming run previews."
        url="/tools/cron-builder"
        faqs={cronBuilderContent.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 py-10 sm:px-6 lg:py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cron Expression Builder</h1>
            <p className="mt-1 text-muted-foreground">Create 5-field cron schedules with instant validation and upcoming run previews.</p>
          </div>
          <ShareToolButton toolName="Cron Expression Builder" />
        </div>

        <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {FIELD_SPECS.map((spec) => (
              <div key={spec.key}>
                <p className="mb-1.5 text-sm font-medium">{spec.label}</p>
                <Input
                  value={fields[spec.key]}
                  onChange={(event) =>
                    setFields((previous) => ({
                      ...previous,
                      [spec.key]: event.target.value,
                    }))
                  }
                  className="font-mono"
                />
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-md border border-border bg-muted/20 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Cron Expression</p>
              <Button size="sm" variant="outline" className="gap-1" onClick={copyExpression}>
                {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />} Copy
              </Button>
            </div>
            <p className="mt-1 font-mono text-sm">{expression}</p>
            {parsed.error ? <p className="mt-2 text-sm text-destructive">Invalid expression: {parsed.error}</p> : <p className="mt-2 text-sm text-green-600">Valid expression.</p>}
            <p className="mt-2 text-sm text-muted-foreground">{summary}</p>
          </div>

          <div className="mt-4 rounded-md border border-border p-3">
            <p className="mb-2 text-sm font-medium">Next Runs (Local Time)</p>
            {parsed.nextRuns.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming runs found within the next year.</p>
            ) : (
              <ul className="space-y-1 text-sm">
                {parsed.nextRuns.map((run) => (
                  <li key={run.toISOString()} className="font-mono text-xs">
                    {run.toLocaleString()} ({run.toISOString()})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <ToolContent about={cronBuilderContent.about} faqs={cronBuilderContent.faqs} />
      </main>

      <Footer />
    </div>
  );
}
