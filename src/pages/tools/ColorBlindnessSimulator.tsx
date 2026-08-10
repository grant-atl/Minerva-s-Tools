import { useState, useRef, useCallback, useEffect } from "react";
import { UploadSimple, Palette, Image as ImageIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolContent from "@/components/ToolContent";
import ToolSchema from "@/components/ToolSchema";
import { colorBlindnessContent } from "@/lib/tool-content-data";

/* ── CVD simulation matrices (Brettel/Viénot) ── */
const CVD_TYPES = [
  {
    id: "normal",
    label: "Normal Vision",
    short: "Normal",
    description: "Full color vision (trichromacy)",
    matrix: [1,0,0,0,0, 0,1,0,0,0, 0,0,1,0,0, 0,0,0,1,0],
  },
  {
    id: "protanopia",
    label: "Protanopia",
    short: "Protan",
    description: "No red cones — ~1% of males",
    matrix: [0.567,0.433,0,0,0, 0.558,0.442,0,0,0, 0,0.242,0.758,0,0, 0,0,0,1,0],
  },
  {
    id: "deuteranopia",
    label: "Deuteranopia",
    short: "Deutan",
    description: "No green cones — ~1% of males",
    matrix: [0.625,0.375,0,0,0, 0.7,0.3,0,0,0, 0,0.3,0.7,0,0, 0,0,0,1,0],
  },
  {
    id: "tritanopia",
    label: "Tritanopia",
    short: "Tritan",
    description: "No blue cones — very rare",
    matrix: [0.95,0.05,0,0,0, 0,0.433,0.567,0,0, 0,0.475,0.525,0,0, 0,0,0,1,0],
  },
  {
    id: "achromatopsia",
    label: "Achromatopsia",
    short: "Achroma",
    description: "Total color blindness — monochrome",
    matrix: [0.299,0.587,0.114,0,0, 0.299,0.587,0.114,0,0, 0.299,0.587,0.114,0,0, 0,0,0,1,0],
  },
  {
    id: "protanomaly",
    label: "Protanomaly",
    short: "P-anomaly",
    description: "Reduced red sensitivity — ~1% of males",
    matrix: [0.817,0.183,0,0,0, 0.333,0.667,0,0,0, 0,0.125,0.875,0,0, 0,0,0,1,0],
  },
  {
    id: "deuteranomaly",
    label: "Deuteranomaly",
    short: "D-anomaly",
    description: "Reduced green sensitivity — ~5% of males",
    matrix: [0.8,0.2,0,0,0, 0.258,0.742,0,0,0, 0,0.142,0.858,0,0, 0,0,0,1,0],
  },
  {
    id: "tritanomaly",
    label: "Tritanomaly",
    short: "T-anomaly",
    description: "Reduced blue sensitivity — very rare",
    matrix: [0.967,0.033,0,0,0, 0,0.733,0.267,0,0, 0,0.183,0.817,0,0, 0,0,0,1,0],
  },
] as const;

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.replace("#", "").match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return null;
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

function applyMatrix(r: number, g: number, b: number, m: readonly number[]): [number, number, number] {
  return [
    Math.round(Math.min(255, Math.max(0, m[0]*r + m[1]*g + m[2]*b))),
    Math.round(Math.min(255, Math.max(0, m[5]*r + m[6]*g + m[7]*b))),
    Math.round(Math.min(255, Math.max(0, m[10]*r + m[11]*g + m[12]*b))),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

/* ── Color Swatch Tab ── */
function ColorSwatchView() {
  const [colors, setColors] = useState(["#3B82F6", "#EF4444", "#22C55E", "#F59E0B", "#8B5CF6", "#EC4899"]);
  const [newColor, setNewColor] = useState("#3B82F6");
  const [selected, setSelected] = useState<string>("protanopia");

  const addColor = () => {
    if (colors.length >= 12) return;
    if (!hexToRgb(newColor)) { toast.error("Invalid hex color"); return; }
    if (!colors.includes(newColor)) {
      setColors([...colors, newColor]);
    }
  };

  const removeColor = (i: number) => setColors(colors.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-6">
      {/* Add color */}
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Add Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="w-10 h-10 rounded border border-border cursor-pointer"
            />
            <Input
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              placeholder="#3B82F6"
              className="font-mono border-2 border-border focus-visible:border-primary"
            />
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={addColor}>Add</Button>
      </div>

      {/* CVD type selector */}
      <div className="flex flex-wrap gap-1.5">
        {CVD_TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelected(t.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selected === t.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {t.short}
          </button>
        ))}
      </div>

      {/* Comparison grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Normal */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground mb-2">Normal Vision</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((c, i) => (
              <button
                key={i}
                onClick={() => removeColor(i)}
                className="group relative w-14 h-14 rounded-lg border border-border shadow-sm transition-transform hover:scale-105"
                style={{ backgroundColor: c }}
                title={`${c} — click to remove`}
              >
                <span className="absolute bottom-0 inset-x-0 text-[9px] font-mono bg-black/50 text-white rounded-b-lg text-center py-0.5">
                  {c}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Simulated */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground mb-2">
            {CVD_TYPES.find((t) => t.id === selected)?.label}
          </h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((c, i) => {
              const rgb = hexToRgb(c);
              const cvd = CVD_TYPES.find((t) => t.id === selected)!;
              const sim = rgb ? applyMatrix(rgb[0], rgb[1], rgb[2], cvd.matrix) : [0, 0, 0] as [number, number, number];
              const simHex = rgb ? rgbToHex(sim[0], sim[1], sim[2]) : c;
              return (
                <div
                  key={i}
                  className="w-14 h-14 rounded-lg border border-border shadow-sm relative"
                  style={{ backgroundColor: simHex }}
                  title={simHex}
                >
                  <span className="absolute bottom-0 inset-x-0 text-[9px] font-mono bg-black/50 text-white rounded-b-lg text-center py-0.5">
                    {simHex}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground">
        {CVD_TYPES.find((t) => t.id === selected)?.description}
      </p>
    </div>
  );
}

/* ── Image Upload Tab ── */
function ImageView() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>("protanopia");
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === "string") setImageSrc(reader.result); };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === "string") setImageSrc(reader.result); };
    reader.readAsDataURL(file);
  }, []);

  // Canvas-based pixel manipulation for CVD simulation
  useEffect(() => {
    if (!imageSrc || !canvasRef.current) return;
    const cvd = CVD_TYPES.find((t) => t.id === selected);
    if (!cvd) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      const canvas = canvasRef.current!;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      if (selected === "normal") return;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;
      for (let i = 0; i < d.length; i += 4) {
        const [r, g, b] = applyMatrix(d[i], d[i + 1], d[i + 2], cvd.matrix);
        d[i] = r; d[i + 1] = g; d[i + 2] = b;
      }
      ctx.putImageData(imageData, 0, 0);
    };
    img.src = imageSrc;
  }, [imageSrc, selected]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-muted/20 p-3 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Testing a website?</p>
        <p className="mt-1">
          Capture a screenshot, then upload it here. This works for every site and keeps the image
          inside your browser instead of relying on third-party iframe permissions.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()} className="gap-1.5">
          <UploadSimple size={14} weight="bold" />
          Upload Screenshot or Image
        </Button>
        {imageSrc && (
          <Button size="sm" variant="ghost" onClick={() => setImageSrc(null)} className="text-muted-foreground">
            Clear
          </Button>
        )}
      </div>

      {/* CVD type selector */}
      <div className="flex flex-wrap gap-1.5">
        {CVD_TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelected(t.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selected === t.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {t.short}
          </button>
        ))}
      </div>

      {imageSrc ? (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground mb-2">Normal Vision</h3>
            <img src={imageSrc} alt="Original" className="w-full rounded-lg border border-border" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground mb-2">
              {CVD_TYPES.find((t) => t.id === selected)?.label}
            </h3>
            <canvas ref={canvasRef} className="w-full rounded-lg border border-border" />
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="rounded-lg border-2 border-dashed border-border bg-muted/20 min-h-[200px] flex items-center justify-center cursor-pointer"
          onClick={() => fileRef.current?.click()}
        >
          <div className="text-center space-y-2">
            <ImageIcon size={32} className="text-muted-foreground/40 mx-auto" />
            <p className="text-sm text-muted-foreground">
              Drop a screenshot or image here, or click to upload
            </p>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {CVD_TYPES.find((t) => t.id === selected)?.description}
      </p>
    </div>
  );
}

function ColorOverview() {
  const colors = ["#3B82F6", "#EF4444", "#22C55E", "#F59E0B", "#8B5CF6", "#EC4899"];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">All CVD Types at a Glance</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CVD_TYPES.map((cvd) => (
          <div key={cvd.id} className="rounded-lg border border-border p-3 space-y-2">
            <h4 className="text-xs font-semibold">{cvd.label}</h4>
            <div className="flex gap-1.5">
              {colors.map((c, i) => {
                const rgb = hexToRgb(c)!;
                const sim = applyMatrix(rgb[0], rgb[1], rgb[2], cvd.matrix);
                return (
                  <div
                    key={i}
                    className="w-8 h-8 rounded border border-border"
                    style={{ backgroundColor: rgbToHex(sim[0], sim[1], sim[2]) }}
                    title={rgbToHex(sim[0], sim[1], sim[2])}
                  />
                );
              })}
            </div>
            <p className="text-[10px] text-muted-foreground">{cvd.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function ColorBlindnessSimulator() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      
      <SEO
        title="Color Blindness Simulator — Test Accessibility for All Vision Types | Minerva's Tools"
        description="Simulate how colors, images, and website screenshots appear to people with color vision deficiency. Test protanopia, deuteranopia, tritanopia, and more."
        canonical="/tools/color-blindness"
      />
      <ToolSchema
        name="Color Blindness Simulator"
        description="Preview colors, images, and screenshots through different color vision deficiency types"
        url="/tools/color-blindness"
        faqs={colorBlindnessContent.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 sm:px-6 pt-10 pb-20">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Color Blindness Simulator</h1>
            <p className="text-sm text-muted-foreground">
              Preview colors, images, and website screenshots across common vision types
            </p>
          </div>
          <ShareToolButton toolName="Color Blindness Simulator" />
        </div>

        <Tabs defaultValue="colors" className="space-y-6">
          <TabsList>
            <TabsTrigger value="colors" className="gap-1.5">
              <Palette size={14} />
              Colors
            </TabsTrigger>
            <TabsTrigger value="image" className="gap-1.5">
              <ImageIcon size={14} />
              Image / Screenshot
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colors">
            <ColorSwatchView />
          </TabsContent>
          <TabsContent value="image">
            <ImageView />
          </TabsContent>
        </Tabs>

        {/* Overview grid */}
        <div className="mt-12">
          <ColorOverview />
        </div>
      </main>

      <ToolContent about={colorBlindnessContent.about} faqs={colorBlindnessContent.faqs} />
      <Footer />
    </div>
  );
}
