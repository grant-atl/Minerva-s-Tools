import { useState } from "react";
import { Check, Copy, DownloadSimple, UploadSimple } from "@phosphor-icons/react";
import { toast } from "sonner";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolSchema from "@/components/ToolSchema";
import ToolContent from "@/components/ToolContent";
import { imageBase64Content } from "@/lib/tool-content-data";
import { TOOL_TEXTAREA_OUTLINE_CLASS } from "@/lib/tool-ui";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function normalizeDataUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("data:")) return trimmed;
  return `data:image/png;base64,${trimmed}`;
}

export default function ImageBase64Converter() {
  const [dataUrl, setDataUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const handleUpload = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    const result = await readFileAsDataUrl(file);
    setDataUrl(result);
    toast.success("Image converted to Base64");
  };

  const handleCopy = async () => {
    if (!dataUrl) return;
    await navigator.clipboard.writeText(dataUrl);
    setCopied(true);
    toast.success("Base64 copied");
    window.setTimeout(() => setCopied(false), 1200);
  };

  const handleDownload = () => {
    const normalized = normalizeDataUrl(dataUrl);
    if (!normalized) {
      toast.error("Paste a Base64 data URI first");
      return;
    }

    const match = normalized.match(/^data:(.*?);base64,(.*)$/);
    if (!match) {
      toast.error("Invalid Base64 data URI");
      return;
    }

    const mime = match[1] || "image/png";
    const base64 = match[2];
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const blob = new Blob([bytes], { type: mime });
    const extension = mime.split("/")[1] || "png";
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `decoded-image.${extension}`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const previewSrc = normalizeDataUrl(dataUrl);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Image Base64 Converter — Image ↔ Data URI | Minerva's Tools"
        description="Convert uploaded images to Base64 data URIs and decode Base64 back to downloadable image files."
        canonical="/tools/image-base64"
      />
      <ToolSchema
        name="Image Base64 Converter"
        description="Convert images to Base64 data URIs and decode Base64 back into files."
        url="/tools/image-base64"
        faqs={imageBase64Content.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 sm:px-6 py-10 lg:py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Image Base64 Converter</h1>
            <p className="mt-1 text-muted-foreground">Encode image files to data URIs or decode Base64 back to files.</p>
          </div>
          <ShareToolButton toolName="Image Base64 Converter" />
        </div>

        <section className="rounded-lg border border-border bg-card p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm">
              <UploadSimple className="size-4" /> Upload image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  void handleUpload(event.target.files?.[0] ?? null);
                  event.currentTarget.value = "";
                }}
              />
            </label>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => void handleCopy()} disabled={!dataUrl}>
              {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />} Copy Base64
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={handleDownload} disabled={!dataUrl}>
              <DownloadSimple className="size-3.5" /> Decode & Download
            </Button>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <p className="mb-1.5 text-sm font-medium">Base64/Data URI</p>
              <Textarea
                value={dataUrl}
                onChange={(event) => setDataUrl(event.target.value)}
                placeholder="Paste data:image/...;base64,... or plain Base64"
                className={`min-h-[320px] font-mono text-xs ${TOOL_TEXTAREA_OUTLINE_CLASS}`}
              />
            </div>
            <div>
              <p className="mb-1.5 text-sm font-medium">Preview</p>
              <div className="flex min-h-[320px] items-center justify-center rounded-lg border border-border bg-muted/30 p-3">
                {previewSrc ? <img src={previewSrc} alt="Base64 preview" className="max-h-72 w-auto rounded" /> : <p className="text-sm text-muted-foreground">Upload or paste Base64 to preview</p>}
              </div>
            </div>
          </div>
        </section>

        <ToolContent about={imageBase64Content.about} faqs={imageBase64Content.faqs} />
      </main>

      <Footer />
    </div>
  );
}
