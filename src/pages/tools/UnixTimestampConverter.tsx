import { useMemo, useState } from "react";
import { ArrowsClockwise, ClockCounterClockwise, Copy } from "@phosphor-icons/react";
import { toast } from "sonner";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolSchema from "@/components/ToolSchema";
import ToolContent from "@/components/ToolContent";
import { unixTimestampContent } from "@/lib/tool-content-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function toDatetimeLocalValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
}

export default function UnixTimestampConverter() {
  const [timestampInput, setTimestampInput] = useState(String(Math.floor(Date.now() / 1000)));
  const [timestampUnit, setTimestampUnit] = useState<"seconds" | "milliseconds">("seconds");
  const [dateInput, setDateInput] = useState(toDatetimeLocalValue(new Date()));

  const fromTimestamp = useMemo(() => {
    const numeric = Number(timestampInput.trim());
    if (!Number.isFinite(numeric)) return { date: null as Date | null, error: "Timestamp must be a valid number." };
    const milliseconds = timestampUnit === "seconds" ? numeric * 1000 : numeric;
    const date = new Date(milliseconds);
    if (Number.isNaN(date.getTime())) return { date: null as Date | null, error: "Timestamp is out of range." };
    return { date, error: null as string | null };
  }, [timestampInput, timestampUnit]);

  const fromDate = useMemo(() => {
    if (!dateInput) return { milliseconds: null as number | null, seconds: null as number | null };
    const date = new Date(dateInput);
    if (Number.isNaN(date.getTime())) return { milliseconds: null as number | null, seconds: null as number | null };
    const milliseconds = date.getTime();
    return { milliseconds, seconds: Math.floor(milliseconds / 1000) };
  }, [dateInput]);

  const setNow = () => {
    const now = new Date();
    setTimestampInput(String(Math.floor(now.getTime() / (timestampUnit === "seconds" ? 1000 : 1))));
    setDateInput(toDatetimeLocalValue(now));
  };

  const copyValue = async (value: string, label: string) => {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copied`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Unix Timestamp Converter — Epoch to Date and Back | Minerva's Tools"
        description="Convert Unix epoch timestamps to local/UTC date-time and convert date-time values back to seconds or milliseconds."
        canonical="/tools/unix-timestamp"
      />
      <ToolSchema
        name="Unix Timestamp Converter"
        description="Convert Unix epoch timestamps to readable date-times and convert date-times back to seconds or milliseconds."
        url="/tools/unix-timestamp"
        faqs={unixTimestampContent.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 py-10 sm:px-6 lg:py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Unix Timestamp Converter</h1>
            <p className="mt-1 text-muted-foreground">Convert between epoch values and readable local/UTC date-time instantly.</p>
          </div>
          <ShareToolButton toolName="Unix Timestamp Converter" />
        </div>

        <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Button size="sm" variant={timestampUnit === "seconds" ? "default" : "outline"} onClick={() => setTimestampUnit("seconds")}>
              Seconds
            </Button>
            <Button size="sm" variant={timestampUnit === "milliseconds" ? "default" : "outline"} onClick={() => setTimestampUnit("milliseconds")}>
              Milliseconds
            </Button>
            <Button size="sm" variant="outline" className="gap-1" onClick={setNow}>
              <ClockCounterClockwise className="size-4" />
              Use Current Time
            </Button>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-md border border-border p-3">
              <p className="mb-1.5 text-sm font-medium">Timestamp Input</p>
              <Input value={timestampInput} onChange={(event) => setTimestampInput(event.target.value)} className="font-mono" />
              {fromTimestamp.error ? (
                <p className="mt-3 text-sm text-destructive">{fromTimestamp.error}</p>
              ) : (
                <div className="mt-3 space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Local:</span> {fromTimestamp.date?.toLocaleString()}</p>
                  <p><span className="text-muted-foreground">UTC:</span> {fromTimestamp.date?.toUTCString()}</p>
                  <p><span className="text-muted-foreground">ISO:</span> {fromTimestamp.date?.toISOString()}</p>
                </div>
              )}
            </div>

            <div className="rounded-md border border-border p-3">
              <p className="mb-1.5 text-sm font-medium">Date/Time Input</p>
              <Input type="datetime-local" value={dateInput} onChange={(event) => setDateInput(event.target.value)} />
              <div className="mt-3 space-y-2 text-sm">
                <p className="flex items-center justify-between gap-2 rounded-md bg-muted/20 px-2 py-1.5">
                  <span>Epoch Seconds</span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
                    onClick={() => fromDate.seconds !== null && copyValue(String(fromDate.seconds), "Epoch seconds")}
                  >
                    {fromDate.seconds ?? "—"} <Copy className="size-3.5" />
                  </button>
                </p>
                <p className="flex items-center justify-between gap-2 rounded-md bg-muted/20 px-2 py-1.5">
                  <span>Epoch Milliseconds</span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
                    onClick={() => fromDate.milliseconds !== null && copyValue(String(fromDate.milliseconds), "Epoch milliseconds")}
                  >
                    {fromDate.milliseconds ?? "—"} <Copy className="size-3.5" />
                  </button>
                </p>
                <p className="pt-1 text-xs text-muted-foreground">Date-time input uses your local timezone.</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <ArrowsClockwise className="size-3.5" />
            Tip: switch between seconds and milliseconds based on your API payload format.
          </div>
        </section>

        <ToolContent about={unixTimestampContent.about} faqs={unixTimestampContent.faqs} />
      </main>

      <Footer />
    </div>
  );
}
