import { useState, useRef, useCallback, useMemo } from "react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import {
  DownloadSimple,
  LinkSimple,
  TextAa,
  WifiHigh,
  EnvelopeSimple,
  Phone,
  Swatches,
  UploadSimple,
  X,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolContent from "@/components/ToolContent";
import ToolSchema from "@/components/ToolSchema";
import { qrCodeContent } from "@/lib/tool-content-data";

/* ── Input mode types ─────────────────────────────── */
type InputMode = "url" | "text" | "wifi" | "email" | "phone";
type ECLevel = "L" | "M" | "Q" | "H";

interface WifiData {
  ssid: string;
  password: string;
  encryption: "WPA" | "WEP" | "nopass";
  hidden: boolean;
}

interface EmailData {
  to: string;
  subject: string;
  body: string;
}

/* ── Presets ───────────────────────────────────────── */
const presets = [
  { name: "Classic", fg: "#000000", bg: "#FFFFFF" },
  { name: "Brand Blue", fg: "#1e40af", bg: "#dbeafe" },
  { name: "Sunset", fg: "#9a3412", bg: "#fff7ed" },
  { name: "Dark Mode", fg: "#e2e8f0", bg: "#0f172a" },
  { name: "Emerald", fg: "#065f46", bg: "#ecfdf5" },
  { name: "Purple Haze", fg: "#581c87", bg: "#faf5ff" },
  { name: "Rose", fg: "#9f1239", bg: "#fff1f2" },
  { name: "Amber", fg: "#78350f", bg: "#fffbeb" },
];

/* ── Helpers ──────────────────────────────────────── */
const buildWifiString = (d: WifiData) =>
  `WIFI:T:${d.encryption};S:${d.ssid};P:${d.password};H:${d.hidden ? "true" : "false"};;`;

const buildMailto = (d: EmailData) => {
  const params: string[] = [];
  if (d.subject) params.push(`subject=${encodeURIComponent(d.subject)}`);
  if (d.body) params.push(`body=${encodeURIComponent(d.body)}`);
  return `mailto:${d.to}${params.length ? "?" + params.join("&") : ""}`;
};

const inputModeIcons: Record<InputMode, React.ElementType> = {
  url: LinkSimple,
  text: TextAa,
  wifi: WifiHigh,
  email: EnvelopeSimple,
  phone: Phone,
};

/* ── Component ────────────────────────────────────── */
export default function QRCodeGenerator() {
  /* Input state */
  const [mode, setMode] = useState<InputMode>("url");
  const [urlValue, setUrlValue] = useState("https://minervas.tools");
  const [textValue, setTextValue] = useState("");
  const [wifiData, setWifiData] = useState<WifiData>({
    ssid: "",
    password: "",
    encryption: "WPA",
    hidden: false,
  });
  const [emailData, setEmailData] = useState<EmailData>({
    to: "",
    subject: "",
    body: "",
  });
  const [phoneValue, setPhoneValue] = useState("");

  /* Customization state */
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [size, setSize] = useState(256);
  const [ecLevel, setEcLevel] = useState<ECLevel>("M");
  const [logoFile, setLogoFile] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(20); // % of QR
  const [transparentBg, setTransparentBg] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  /* Derived encoded value */
  const encodedValue = useMemo(() => {
    switch (mode) {
      case "url":
        return urlValue || "https://minervas.tools";
      case "text":
        return textValue || "Hello World";
      case "wifi":
        return wifiData.ssid ? buildWifiString(wifiData) : "WIFI:T:WPA;S:MyNetwork;P:password123;;";
      case "email":
        return emailData.to ? buildMailto(emailData) : "mailto:hello@example.com";
      case "phone":
        return phoneValue ? `tel:${phoneValue}` : "tel:+1234567890";
    }
  }, [mode, urlValue, textValue, wifiData, emailData, phoneValue]);

  /* Logo upload */
  const handleLogoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => setLogoFile(reader.result as string);
      reader.readAsDataURL(file);
    },
    []
  );

  const removeLogo = () => {
    setLogoFile(null);
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  /* Downloads */
  const downloadPNG = useCallback(() => {
    if (transparentBg) {
      // Re-render to a temp canvas with transparent bg
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = size;
      tempCanvas.height = size;
      const sourceCanvas = canvasRef.current;
      if (!sourceCanvas) return;
      // Use the hidden canvas but we need a version with no bg
      // Easiest: draw QRCodeCanvas with bgColor="transparent" won't work in canvas,
      // so we draw and then remove bg pixels
      const ctx = tempCanvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(sourceCanvas, 0, 0);
      // Replace bg color pixels with transparent
      const imageData = ctx.getImageData(0, 0, size, size);
      const bgR = parseInt(bgColor.slice(1, 3), 16);
      const bgG = parseInt(bgColor.slice(3, 5), 16);
      const bgB = parseInt(bgColor.slice(5, 7), 16);
      for (let i = 0; i < imageData.data.length; i += 4) {
        if (
          Math.abs(imageData.data[i] - bgR) < 10 &&
          Math.abs(imageData.data[i + 1] - bgG) < 10 &&
          Math.abs(imageData.data[i + 2] - bgB) < 10
        ) {
          imageData.data[i + 3] = 0; // set alpha to 0
        }
      }
      ctx.putImageData(imageData, 0, 0);
      const url = tempCanvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "qr-code.png";
      a.click();
    } else {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "qr-code.png";
      a.click();
    }
    toast.success("PNG downloaded");
  }, [transparentBg, size, bgColor]);

  const downloadSVG = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const cloned = svg.cloneNode(true) as SVGSVGElement;
    if (transparentBg) {
      // Remove the background rect (first rect in SVG)
      const rects = cloned.querySelectorAll("rect");
      if (rects.length > 0) {
        rects[0].setAttribute("fill", "none");
      }
    }
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(cloned);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-code.svg";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("SVG downloaded");
  }, [transparentBg]);

  /* Preset apply */
  const applyPreset = (p: (typeof presets)[number]) => {
    setFgColor(p.fg);
    setBgColor(p.bg);
  };

  /* Image settings for logo overlay */
  const imageSettings = logoFile
    ? {
        src: logoFile,
        height: Math.round(size * (logoSize / 100)),
        width: Math.round(size * (logoSize / 100)),
        excavate: true,
      }
    : undefined;

  return (
    <>
      <SEO
        title="QR Code Generator — Minerva's Tools"
        description="Create QR codes for URLs, text, WiFi, email, and phone numbers. Set colors, add a logo, and export PNG or SVG."
        canonical="/tools/qr-code"
      />
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <HomeNav />
        <main className="flex-1 container mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">QR Code Generator</h1>
              <p className="text-muted-foreground">
                Generate QR codes for URLs, text, WiFi credentials, email, and phone numbers.
              </p>
            </div>
            <ShareToolButton toolName="QR Code Generator" />
          </div>

          <div className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            {/* ── Left: Controls ──────────────────── */}
            <div className="min-w-0 space-y-8">
              {/* Input mode tabs */}
              <section>
                <Label className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                  Input
                </Label>
                <Tabs
                  value={mode}
                  onValueChange={(v) => setMode(v as InputMode)}
                  className="min-w-0 max-w-full"
                >
                  <TabsList className="mb-4 max-w-full w-full overflow-x-auto justify-start sm:w-auto sm:justify-center">
                    {(Object.keys(inputModeIcons) as InputMode[]).map((m) => {
                      const Icon = inputModeIcons[m];
                      return (
                        <TabsTrigger key={m} value={m} className="gap-1.5 capitalize">
                          <Icon size={14} weight="bold" />
                          {m === "wifi" ? "WiFi" : m}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>

                  <TabsContent value="url">
                    <Input
                      placeholder="https://example.com"
                      value={urlValue}
                      onChange={(e) => setUrlValue(e.target.value)}
                    />
                  </TabsContent>

                  <TabsContent value="text">
                    <Textarea
                      placeholder="Enter any text…"
                      value={textValue}
                      onChange={(e) => setTextValue(e.target.value)}
                      rows={3}
                    />
                  </TabsContent>

                  <TabsContent value="wifi">
                    <div className="space-y-3">
                      <Input
                        placeholder="Network name (SSID)"
                        value={wifiData.ssid}
                        onChange={(e) =>
                          setWifiData((d) => ({ ...d, ssid: e.target.value }))
                        }
                      />
                      <Input
                        placeholder="Password"
                        type="password"
                        value={wifiData.password}
                        onChange={(e) =>
                          setWifiData((d) => ({ ...d, password: e.target.value }))
                        }
                      />
                      <Select
                        value={wifiData.encryption}
                        onValueChange={(v) =>
                          setWifiData((d) => ({
                            ...d,
                            encryption: v as WifiData["encryption"],
                          }))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WPA">WPA/WPA2</SelectItem>
                          <SelectItem value="WEP">WEP</SelectItem>
                          <SelectItem value="nopass">None</SelectItem>
                        </SelectContent>
                      </Select>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={wifiData.hidden}
                          onChange={(e) =>
                            setWifiData((d) => ({
                              ...d,
                              hidden: e.target.checked,
                            }))
                          }
                          className="rounded"
                        />
                        Hidden network
                      </label>
                    </div>
                  </TabsContent>

                  <TabsContent value="email">
                    <div className="space-y-3">
                      <Input
                        placeholder="to@example.com"
                        value={emailData.to}
                        onChange={(e) =>
                          setEmailData((d) => ({ ...d, to: e.target.value }))
                        }
                      />
                      <Input
                        placeholder="Subject"
                        value={emailData.subject}
                        onChange={(e) =>
                          setEmailData((d) => ({ ...d, subject: e.target.value }))
                        }
                      />
                      <Textarea
                        placeholder="Body"
                        value={emailData.body}
                        onChange={(e) =>
                          setEmailData((d) => ({ ...d, body: e.target.value }))
                        }
                        rows={2}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="phone">
                    <Input
                      placeholder="+1 234 567 8900"
                      value={phoneValue}
                      onChange={(e) => setPhoneValue(e.target.value)}
                    />
                  </TabsContent>
                </Tabs>
              </section>

              {/* Colors */}
              <section>
                <Label className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                  Colors
                </Label>
                <div className={`grid gap-4 ${transparentBg ? "grid-cols-1" : "grid-cols-2"}`}>
                  <div>
                    <Label className="text-xs mb-1.5">Foreground</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border border-border bg-transparent p-0.5"
                      />
                      <Input
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="font-mono text-xs"
                      />
                    </div>
                  </div>
                  {!transparentBg && (
                    <div>
                      <Label className="text-xs mb-1.5">Background</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border border-border bg-transparent p-0.5"
                        />
                        <Input
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="font-mono text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <label className="flex items-center justify-between mt-4 cursor-pointer">
                  <span className="text-xs font-medium">Transparent background</span>
                  <Switch
                    checked={transparentBg}
                    onCheckedChange={setTransparentBg}
                  />
                </label>
              </section>

              {/* Size */}
              <section>
                <Label className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                  Size — {size}px
                </Label>
                <Slider
                  min={128}
                  max={512}
                  step={8}
                  value={[size]}
                  onValueChange={([v]) => setSize(v)}
                />
              </section>

              {/* Error Correction */}
              <section>
                <Label className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                  Error Correction
                </Label>
                <div className="flex gap-2">
                  {(["L", "M", "Q", "H"] as ECLevel[]).map((lvl) => (
                    <Button
                      key={lvl}
                      size="sm"
                      variant={ecLevel === lvl ? "default" : "outline"}
                      onClick={() => setEcLevel(lvl)}
                    >
                      {lvl}
                    </Button>
                  ))}
                </div>
                {logoFile && ecLevel !== "H" && (
                  <p className="text-xs text-amber-500 mt-2">
                    Tip: Use "H" error correction when using a logo overlay for best scan reliability.
                  </p>
                )}
              </section>

              {/* Logo overlay */}
              <section>
                <Label className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                  Logo Overlay
                </Label>
                {logoFile ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={logoFile}
                        alt="Logo preview"
                        className="h-10 w-10 rounded-md object-contain border border-border"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={removeLogo}
                      >
                        <X size={14} weight="bold" />
                        Remove
                      </Button>
                    </div>
                    <div>
                      <Label className="text-xs mb-1.5">
                        Logo size — {logoSize}%
                      </Label>
                      <Slider
                        min={10}
                        max={35}
                        step={1}
                        value={[logoSize]}
                        onValueChange={([v]) => setLogoSize(v)}
                      />
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => logoInputRef.current?.click()}
                  >
                    <UploadSimple size={14} weight="bold" />
                    Upload logo
                  </Button>
                )}
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </section>
            </div>

            {/* ── Right: Preview ──────────────────── */}
            <div className="min-w-0 flex flex-col items-center gap-6">
              <div
                className="rounded-2xl border border-border p-4 sm:p-8 flex items-center justify-center max-w-full overflow-hidden"
                style={{
                  backgroundColor: transparentBg ? undefined : bgColor,
                  backgroundImage: transparentBg
                    ? "repeating-conic-gradient(hsl(var(--muted)) 0% 25%, transparent 0% 50%)"
                    : undefined,
                  backgroundSize: transparentBg ? "16px 16px" : undefined,
                }}
              >
                {/* Visible SVG preview */}
                <QRCodeSVG
                  ref={svgRef}
                  value={encodedValue}
                  size={size}
                  fgColor={fgColor}
                  bgColor={transparentBg ? "transparent" : bgColor}
                  level={ecLevel}
                  imageSettings={imageSettings}
                />
              </div>

              {/* Hidden canvas for PNG download */}
              <div className="hidden">
                <QRCodeCanvas
                  ref={canvasRef}
                  value={encodedValue}
                  size={size}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level={ecLevel}
                  imageSettings={imageSettings}
                />
              </div>

              {/* Encoded string */}
              <p className="text-xs text-muted-foreground font-mono max-w-full truncate px-4">
                {encodedValue}
              </p>

              {/* Download buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button onClick={downloadPNG} className="w-full sm:w-auto">
                  <DownloadSimple size={16} weight="bold" />
                  Download PNG
                </Button>
                <Button variant="outline" onClick={downloadSVG} className="w-full sm:w-auto">
                  <DownloadSimple size={16} weight="bold" />
                  Download SVG
                </Button>
              </div>
            </div>
          </div>

          {/* ── Preset Gallery ─────────────────────── */}
          <section className="mt-12">
            <div className="flex items-center gap-2 mb-4">
              <Swatches size={18} weight="duotone" className="text-primary" />
              <h2 className="text-lg font-semibold">Style Presets</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {presets.map((p) => (
                <button
                  key={p.name}
                  onClick={() => applyPreset(p)}
                  className="shrink-0 group flex flex-col items-center gap-2 rounded-xl border border-border p-3 transition-colors hover:bg-muted"
                >
                  <div className="relative h-14 w-14 rounded-lg overflow-hidden border border-border">
                    <div
                      className="absolute inset-0"
                      style={{ backgroundColor: p.bg }}
                    />
                    <div
                      className="absolute inset-2 rounded-sm"
                      style={{ backgroundColor: p.fg }}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {p.name}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </main>
        <ToolContent about={qrCodeContent.about} faqs={qrCodeContent.faqs} />
        <ToolSchema name="QR Code Generator" description="Create customizable QR codes for URLs, WiFi, email, and more." url="/tools/qr-code" faqs={qrCodeContent.faqs} />
        <Footer />
      </div>
    </>
  );
}
