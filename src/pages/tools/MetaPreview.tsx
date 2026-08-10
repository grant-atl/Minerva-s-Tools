import { useState, useCallback, useRef } from "react";
import { Copy, Image as ImageIcon, Globe, TwitterLogo, ChatCircleDots, ArrowsClockwise } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolContent from "@/components/ToolContent";
import ToolSchema from "@/components/ToolSchema";
import { metaPreviewContent } from "@/lib/tool-content-data";

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max) + "…" : str;
}

function generateMetaTags(data: MetaData): string {
  const lines: string[] = [];
  if (data.title) {
    lines.push(`<title>${data.title}</title>`);
    lines.push(`<meta property="og:title" content="${data.title}" />`);
    lines.push(`<meta name="twitter:title" content="${data.title}" />`);
  }
  if (data.description) {
    lines.push(`<meta name="description" content="${data.description}" />`);
    lines.push(`<meta property="og:description" content="${data.description}" />`);
    lines.push(`<meta name="twitter:description" content="${data.description}" />`);
  }
  if (data.url) {
    lines.push(`<meta property="og:url" content="${data.url}" />`);
  }
  if (data.image) {
    lines.push(`<meta property="og:image" content="${data.image}" />`);
    lines.push(`<meta name="twitter:image" content="${data.image}" />`);
  }
  lines.push(`<meta property="og:type" content="website" />`);
  lines.push(`<meta name="twitter:card" content="summary_large_image" />`);
  if (data.siteName) {
    lines.push(`<meta property="og:site_name" content="${data.siteName}" />`);
  }
  return lines.join("\n");
}

interface MetaData {
  title: string;
  description: string;
  url: string;
  image: string;
  siteName: string;
}

function GooglePreview({ data }: { data: MetaData }) {
  const domain = (() => {
    try { return new URL(data.url || "https://example.com").hostname; } catch { return "example.com"; }
  })();

  return (
    <div className="space-y-1 max-w-[600px]">
      <div className="flex items-center gap-2 text-sm">
        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
          <Globe size={14} className="text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm text-foreground">{data.siteName || domain}</p>
          <p className="text-xs text-muted-foreground">{data.url || "https://example.com"}</p>
        </div>
      </div>
      <h3 className="text-xl text-primary hover:underline cursor-pointer leading-snug">
        {truncate(data.title || "Page Title", 60)}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {truncate(data.description || "Page description will appear here. Keep it under 160 characters for best results.", 160)}
      </p>
    </div>
  );
}

function TwitterPreview({ data }: { data: MetaData }) {
  const domain = (() => {
    try { return new URL(data.url || "https://example.com").hostname; } catch { return "example.com"; }
  })();

  return (
    <div className="max-w-[500px] rounded-2xl border border-border overflow-hidden bg-card">
      {data.image ? (
        <div className="aspect-[1.91/1] bg-muted relative overflow-hidden">
          <img src={data.image} alt="OG preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        </div>
      ) : (
        <div className="aspect-[1.91/1] bg-muted flex items-center justify-center">
          <ImageIcon size={48} className="text-muted-foreground/40" />
        </div>
      )}
      <div className="p-3 space-y-0.5">
        <p className="text-xs text-muted-foreground">{domain}</p>
        <h3 className="text-sm font-semibold text-foreground leading-snug">
          {truncate(data.title || "Page Title", 70)}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {truncate(data.description || "Page description appears here.", 200)}
        </p>
      </div>
    </div>
  );
}

function SlackPreview({ data }: { data: MetaData }) {
  return (
    <div className="max-w-[500px] border-l-[3px] border-primary pl-3 py-1 space-y-1">
      <p className="text-sm font-bold text-foreground">{data.siteName || "Website"}</p>
      <p className="text-sm text-primary font-semibold hover:underline cursor-pointer">
        {truncate(data.title || "Page Title", 70)}
      </p>
      <p className="text-sm text-muted-foreground line-clamp-2">
        {truncate(data.description || "Page description appears here.", 160)}
      </p>
      {data.image ? (
        <div className="mt-2 rounded-lg overflow-hidden max-w-[360px]">
          <img src={data.image} alt="OG preview" className="w-full object-cover max-h-[200px]" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        </div>
      ) : null}
    </div>
  );
}

export default function MetaPreview() {
  const [data, setData] = useState<MetaData>({
    title: "",
    description: "",
    url: "",
    image: "",
    siteName: "",
  });
  const fileRef = useRef<HTMLInputElement>(null);

  const update = (field: keyof MetaData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData((d) => ({ ...d, [field]: e.target.value }));
  };

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setData((d) => ({ ...d, image: reader.result as string }));
        toast.success("Image loaded");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  const metaTags = generateMetaTags(data);

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  }, []);

  const loadSample = () => {
    setData({
      title: "Minerva Tools — Free Utilities for Designers",
      description: "A growing collection of free, focused design utilities. Color palettes, gradients, typography scales, and more — no sign-up required.",
      url: "https://minervas.tools",
      image: "",
      siteName: "Minerva",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Meta Tag Preview — See How Your Page Looks on Google, Twitter & Slack"
        description="Preview your Open Graph and Twitter Card meta tags. See how links appear on Google, Twitter/X, and Slack before publishing. Free, instant, no sign-up."
        canonical="/tools/meta-preview"
      />
      <ToolSchema
        name="Meta Tag Preview"
        description="Preview how your page looks on Google, Twitter, and Slack before publishing"
        url="/tools/meta-preview"
        faqs={metaPreviewContent.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 sm:px-6 pt-10 pb-20">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Meta Tag Preview</h1>
            <p className="text-sm text-muted-foreground">
              See how your page appears on Google, Twitter/X, and Slack
            </p>
          </div>
          <ShareToolButton toolName="Meta Tag Preview" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Page Details</h2>
              <Button size="sm" variant="outline" onClick={loadSample} className="gap-1.5">
                <ArrowsClockwise size={14} weight="bold" />
                Load Sample
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Page Title</label>
                <Input
                  value={data.title}
                  onChange={update("title")}
                  placeholder="My Awesome Page"
                  maxLength={70}
                  className="border-2 border-border focus-visible:border-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">{data.title.length}/70 characters</p>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
                <Textarea
                  value={data.description}
                  onChange={update("description")}
                  placeholder="A brief description of your page…"
                  maxLength={200}
                  className="min-h-[80px] resize-y border-2 border-border focus-visible:border-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">{data.description.length}/200 characters</p>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">URL</label>
                <Input
                  value={data.url}
                  onChange={update("url")}
                  placeholder="https://example.com"
                  className="border-2 border-border focus-visible:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Site Name</label>
                <Input
                  value={data.siteName}
                  onChange={update("siteName")}
                  placeholder="My Website"
                  className="border-2 border-border focus-visible:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">OG Image</label>
                <div className="flex gap-2">
                  <Input
                    value={data.image}
                    onChange={update("image")}
                    placeholder="https://example.com/og-image.png"
                    className="flex-1 border-2 border-border focus-visible:border-primary"
                  />
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()} className="shrink-0 gap-1.5">
                    <ImageIcon size={14} weight="bold" />
                    Upload
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Recommended: 1200×630px for best results</p>
              </div>
            </div>

            {/* Generated Meta Tags */}
            <div className="pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Generated Meta Tags</h2>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(metaTags, "Meta tags")}
                  className="gap-1.5"
                >
                  <Copy size={14} weight="bold" />
                  Copy
                </Button>
              </div>
              <pre className="rounded-lg border border-border bg-muted/30 p-4 font-mono text-xs text-foreground whitespace-pre-wrap break-all overflow-auto max-h-[200px]">
                {metaTags}
              </pre>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Tabs defaultValue="google">
              <TabsList className="w-full">
                <TabsTrigger value="google" className="flex-1 gap-1.5">
                  <Globe size={14} />
                  Google
                </TabsTrigger>
                <TabsTrigger value="twitter" className="flex-1 gap-1.5">
                  <TwitterLogo size={14} />
                  Twitter/X
                </TabsTrigger>
                <TabsTrigger value="slack" className="flex-1 gap-1.5">
                  <ChatCircleDots size={14} />
                  Slack
                </TabsTrigger>
              </TabsList>

              <TabsContent value="google" className="mt-4">
                <div className="rounded-lg border border-border bg-card p-6">
                  <GooglePreview data={data} />
                </div>
              </TabsContent>

              <TabsContent value="twitter" className="mt-4">
                <div className="rounded-lg border border-border bg-card p-6">
                  <TwitterPreview data={data} />
                </div>
              </TabsContent>

              <TabsContent value="slack" className="mt-4">
                <div className="rounded-lg border border-border bg-card p-6">
                  <SlackPreview data={data} />
                </div>
              </TabsContent>
            </Tabs>

            {/* Tips */}
            <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-2">
              <h3 className="text-sm font-semibold">Tips for Better Previews</h3>
              <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                <li>Keep titles under 60 characters for Google</li>
                <li>Descriptions should be 120–160 characters</li>
                <li>OG images should be 1200×630px (1.91:1 ratio)</li>
                <li>Use absolute URLs for images — relative paths won't work</li>
                <li>Twitter/X falls back to OG tags if twitter: tags are missing</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <ToolContent about={metaPreviewContent.about} faqs={metaPreviewContent.faqs} />
      <Footer />
    </div>
  );
}
