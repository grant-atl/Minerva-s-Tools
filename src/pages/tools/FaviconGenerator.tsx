import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import JSZip from "jszip";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolContent from "@/components/ToolContent";
import ToolSchema from "@/components/ToolSchema";
import { faviconContent } from "@/lib/tool-content-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import {
  renderToCanvas,
  drawContentOnCanvas,
  encodeICO,
  canvasToArrayBuffer,
  canvasToDataURL,
  FAVICON_SIZES,
  MANIFEST_TEMPLATE,
  HTML_SNIPPET,
} from "@/lib/favicon-utils";
import {
  Image as ImageIcon,
  TextAa,
  Smiley,
  DownloadSimple,
  Copy,
  FileZip,
  Upload,
} from "@phosphor-icons/react";

type Mode = "image" | "text" | "emoji";

const POPULAR_EMOJIS = ["🚀", "⚡", "🔥", "💎", "🎯", "✨", "🌟", "💡", "🎨", "🛡️", "🏆", "📦", "🧩", "🪄", "❤️", "🌈"];

const FONT_OPTIONS = [
  { label: "Sans-serif", value: "system-ui, sans-serif" },
  { label: "Serif", value: "Georgia, serif" },
  { label: "Monospace", value: "ui-monospace, monospace" },
  { label: "Rounded", value: "system-ui, -apple-system, sans-serif" },
];

export default function FaviconGenerator() {
  const [mode, setMode] = useState<Mode>("text");
  const [text, setText] = useState("M");
  const [emoji, setEmoji] = useState("🚀");
  const [bgColor, setBgColor] = useState("#4f46e5");
  const [textColor, setTextColor] = useState("#ffffff");
  const [borderRadius, setBorderRadius] = useState(20);
  const [padding, setPadding] = useState(10);
  const [fontFamily, setFontFamily] = useState(FONT_OPTIONS[0].value);
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load image element when imageData changes
  useEffect(() => {
    if (!imageData) { setImageEl(null); return; }
    const img = new window.Image();
    img.onload = () => setImageEl(img);
    img.src = imageData;
  }, [imageData]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageData(reader.result as string);
      setMode("image");
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageData(reader.result as string);
      setMode("image");
    };
    reader.readAsDataURL(file);
  }, []);

  const generateCanvas = useCallback((size: number) => {
    const canvas = renderToCanvas(size, { mode, bgColor, borderRadius, padding });
    drawContentOnCanvas(canvas, {
      mode,
      imageElement: imageEl ?? undefined,
      text: text.slice(0, 2),
      emoji,
      fontFamily,
      textColor,
      padding,
    });
    return canvas;
  }, [mode, bgColor, borderRadius, padding, imageEl, text, emoji, fontFamily, textColor]);

  // Preview canvases
  const previews = useMemo(() => {
    const sizes = [512, 192, 180, 32, 16];
    return sizes.map((s) => ({ size: s, dataUrl: canvasToDataURL(generateCanvas(s)) }));
  }, [generateCanvas]);

  const downloadSingle = useCallback(async (name: string, size: number) => {
    const canvas = generateCanvas(size);
    const link = document.createElement("a");
    link.download = name;
    link.href = canvasToDataURL(canvas);
    link.click();
  }, [generateCanvas]);

  const downloadICO = useCallback(async () => {
    const sizes = [16, 32, 48];
    const buffers = await Promise.all(sizes.map((s) => canvasToArrayBuffer(generateCanvas(s))));
    const ico = encodeICO(buffers);
    const blob = new Blob([ico], { type: "image/x-icon" });
    const link = document.createElement("a");
    link.download = "favicon.ico";
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  }, [generateCanvas]);

  const downloadZip = useCallback(async () => {
    const zip = new JSZip();
    // PNGs
    for (const entry of FAVICON_SIZES) {
      if (entry.icoOnly) continue;
      const buf = await canvasToArrayBuffer(generateCanvas(entry.size));
      zip.file(entry.name, buf);
    }
    // ICO
    const icoBuffers = await Promise.all([16, 32, 48].map((s) => canvasToArrayBuffer(generateCanvas(s))));
    zip.file("favicon.ico", encodeICO(icoBuffers));
    // Manifest
    const manifest = { ...MANIFEST_TEMPLATE, theme_color: bgColor, background_color: bgColor };
    zip.file("site.webmanifest", JSON.stringify(manifest, null, 2));
    // HTML snippet
    zip.file("head-tags.html", HTML_SNIPPET);

    const blob = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.download = "favicon-package.zip";
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
    toast({ title: "Downloaded!", description: "Favicon package saved as ZIP." });
  }, [generateCanvas, bgColor]);

  const copySnippet = useCallback(() => {
    navigator.clipboard.writeText(HTML_SNIPPET);
    toast({ title: "Copied!", description: "HTML tags copied to clipboard." });
  }, []);

  const copyManifest = useCallback(() => {
    const manifest = { ...MANIFEST_TEMPLATE, theme_color: bgColor, background_color: bgColor };
    navigator.clipboard.writeText(JSON.stringify(manifest, null, 2));
    toast({ title: "Copied!", description: "Manifest JSON copied to clipboard." });
  }, [bgColor]);

  return (
    <>
      <SEO
        title="Favicon Generator – Free Online Favicon Maker | Minerva"
        description="Generate favicons from images, text, or emoji. Download ICO, PNG, Apple Touch Icon, Android icons, and site.webmanifest in one click."
        canonical="/tools/favicon"
      />
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <HomeNav />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-10 sm:py-14">
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Favicon Generator</h1>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl">
                Create favicons from an image, letter, or emoji. Download all sizes including ICO, Apple Touch Icon, Android icons, and a ready-to-use manifest.
              </p>
            </div>
            <ShareToolButton toolName="Favicon Generator" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
            {/* Left: Input & Controls */}
            <div className="space-y-6">
              <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
                <TabsList>
                  <TabsTrigger value="image" className="gap-1.5"><ImageIcon size={16} /> Image</TabsTrigger>
                  <TabsTrigger value="text" className="gap-1.5"><TextAa size={16} /> Text</TabsTrigger>
                  <TabsTrigger value="emoji" className="gap-1.5"><Smiley size={16} /> Emoji</TabsTrigger>
                </TabsList>

                <TabsContent value="image" className="mt-4">
                  <div
                    className="border-2 border-dashed border-border rounded-2xl p-10 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    <Upload size={32} className="mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drop an image here or <span className="text-primary underline">browse</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, SVG, or JPG</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/svg+xml,image/jpeg,image/webp"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>
                  {imageData && (
                    <div className="mt-4 flex items-center gap-3">
                      <img src={imageData} alt="Uploaded" className="w-12 h-12 rounded-lg object-cover border border-border" />
                      <span className="text-sm text-muted-foreground">Image loaded</span>
                      <Button variant="ghost" size="xs" onClick={() => { setImageData(null); setImageEl(null); }}>Remove</Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="text" className="mt-4 space-y-4">
                  <div>
                    <Label className="text-sm mb-1.5 block">Letter / Text (1–2 chars)</Label>
                    <Input
                      value={text}
                      onChange={(e) => setText(e.target.value.slice(0, 2))}
                      maxLength={2}
                      className="w-24 text-center text-lg font-bold"
                    />
                  </div>
                  <div>
                    <Label className="text-sm mb-1.5 block">Font</Label>
                    <div className="flex flex-wrap gap-2">
                      {FONT_OPTIONS.map((f) => (
                        <Button
                          key={f.label}
                          variant={fontFamily === f.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFontFamily(f.value)}
                          style={{ fontFamily: f.value }}
                        >
                          {f.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm mb-1.5 block">Text Color</Label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-9 h-9 rounded-lg border border-border cursor-pointer" />
                      <Input value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-28 font-mono text-sm" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="emoji" className="mt-4 space-y-4">
                  <div>
                    <Label className="text-sm mb-1.5 block">Pick an Emoji</Label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {POPULAR_EMOJIS.map((e) => (
                        <button
                          key={e}
                          onClick={() => setEmoji(e)}
                          className={`text-2xl w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${emoji === e ? "bg-primary/20 ring-2 ring-primary" : "hover:bg-muted"}`}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                    <Input
                      value={emoji}
                      onChange={(e) => setEmoji(e.target.value)}
                      placeholder="Or type any emoji…"
                      className="w-40 text-center text-lg"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              {/* Shared Controls */}
              <div className="space-y-4 border border-border rounded-2xl p-5">
                <div>
                  <Label className="text-sm mb-1.5 block">Background Color</Label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-9 h-9 rounded-lg border border-border cursor-pointer" />
                    <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-28 font-mono text-sm" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <Label>Border Radius</Label>
                    <span className="text-muted-foreground">{borderRadius}%</span>
                  </div>
                  <Slider value={[borderRadius]} onValueChange={([v]) => setBorderRadius(v)} min={0} max={50} step={1} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <Label>Padding</Label>
                    <span className="text-muted-foreground">{padding}%</span>
                  </div>
                  <Slider value={[padding]} onValueChange={([v]) => setPadding(v)} min={0} max={30} step={1} />
                </div>
              </div>

              {/* Code Snippets */}
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label className="text-sm">HTML &lt;head&gt; Tags</Label>
                    <Button variant="ghost" size="xs" onClick={copySnippet} className="gap-1"><Copy size={14} /> Copy</Button>
                  </div>
                  <pre className="bg-muted/50 border border-border rounded-xl p-3 text-xs font-mono overflow-x-auto whitespace-pre">{HTML_SNIPPET}</pre>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label className="text-sm">site.webmanifest</Label>
                    <Button variant="ghost" size="xs" onClick={copyManifest} className="gap-1"><Copy size={14} /> Copy</Button>
                  </div>
                  <pre className="bg-muted/50 border border-border rounded-xl p-3 text-xs font-mono overflow-x-auto whitespace-pre">
                    {JSON.stringify({ ...MANIFEST_TEMPLATE, theme_color: bgColor, background_color: bgColor }, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            {/* Right: Preview & Downloads */}
            <div className="space-y-6">
              <div className="border border-border rounded-2xl p-5 space-y-4">
                <h2 className="text-sm font-semibold">Preview</h2>
                <div className="flex flex-col gap-4">
                  {/* Large preview */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-muted/30 rounded-xl p-3 flex items-center justify-center w-[120px] h-[120px]">
                      <img src={previews[0]?.dataUrl} alt="512px" width={96} height={96} />
                    </div>
                    <span className="text-xs text-muted-foreground">512×512</span>
                  </div>
                  {/* Smaller previews */}
                  <div className="grid grid-cols-4 gap-3 place-items-center">
                    {previews.slice(1).map(({ size, dataUrl }) => {
                      const display = Math.min(size, 48);
                      return (
                        <div key={size} className="flex flex-col items-center gap-1.5">
                          <div className="bg-muted/30 rounded-xl p-2 flex items-center justify-center w-14 h-14">
                            <img src={dataUrl} alt={`${size}px`} width={display} height={display} style={{ imageRendering: size <= 32 ? "pixelated" : "auto" }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{size}×{size}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="border border-border rounded-2xl p-5 space-y-3">
                <h2 className="text-sm font-semibold">Download</h2>
                <Button onClick={downloadZip} className="w-full gap-2">
                  <FileZip size={18} /> Download All (ZIP)
                </Button>
                <div className="grid grid-cols-1 gap-2">
                  <Button variant="outline" size="sm" onClick={downloadICO} className="gap-1.5 justify-start">
                    <DownloadSimple size={14} /> favicon.ico
                    <span className="text-muted-foreground ml-auto text-xs">16+32+48</span>
                  </Button>
                  {FAVICON_SIZES.filter((s) => !s.icoOnly).map((entry) => (
                    <Button
                      key={entry.name}
                      variant="outline"
                      size="sm"
                      onClick={() => downloadSingle(entry.name, entry.size)}
                      className="gap-1.5 justify-start"
                    >
                      <DownloadSimple size={14} /> {entry.name}
                      <span className="text-muted-foreground ml-auto text-xs">{entry.size}×{entry.size}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
        <ToolContent about={faviconContent.about} faqs={faviconContent.faqs} />
        <ToolSchema name="Favicon Generator" description="Create all required favicon files from an image, letter, or emoji." url="/tools/favicon" faqs={faviconContent.faqs} />
        <Footer />
      </div>
    </>
  );
}
