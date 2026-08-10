import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import SEO from "@/components/SEO";
import ToolContent from "@/components/ToolContent";
import { loremIpsumContent } from "@/lib/tool-content-data";
import MegaNav from "@/components/MegaNav";
import Footer from "@/components/Footer";
import ShareToolButton from "@/components/ShareToolButton";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, ArrowCounterClockwise } from "@phosphor-icons/react";
import { toast } from "sonner";

type OutputUnit = "paragraphs" | "sentences" | "words";
type TextStyle = "classic" | "hipster" | "pirate" | "corporate" | "space" | "foodie";

const STYLE_META: Record<TextStyle, { label: string; emoji: string }> = {
  classic: { label: "Classic", emoji: "📜" },
  hipster: { label: "Hipster", emoji: "🧔" },
  pirate: { label: "Pirate", emoji: "🏴‍☠️" },
  corporate: { label: "Corporate", emoji: "💼" },
  space: { label: "Space", emoji: "🚀" },
  foodie: { label: "Foodie", emoji: "🍕" },
};

const WORDS: Record<TextStyle, string[]> = {
  classic: [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do",
    "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim",
    "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi",
    "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "in", "reprehenderit",
    "voluptate", "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
    "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt",
    "mollit", "anim", "id", "est", "laborum",
  ],
  hipster: [
    "artisan", "cold-pressed", "vinyl", "beard", "fixie", "kombucha", "avocado", "toast",
    "sustainable", "organic", "craft", "microdosing", "vegan", "aesthetic", "brooklyn",
    "portland", "tattooed", "synth", "retro", "slow-carb", "poutine", "chartreuse", "wayfarers",
    "tumblr", "bushwick", "hella", "letterpress", "raw", "denim", "selvage", "dreamcatcher",
    "tacos", "sriracha", "chambray", "chia", "banjo", "thundercats", "gluten-free", "quinoa",
    "cronut", "typewriter", "single-origin", "coffee", "brunch", "normcore", "freegan",
    "shoreditch", "pitchfork", "pour-over", "flannel", "gastropub",
  ],
  pirate: [
    "ahoy", "matey", "scallywag", "buccaneer", "plunder", "treasure", "doubloon", "galleon",
    "rum", "grog", "plank", "anchor", "cannon", "parrot", "jolly", "roger", "bounty", "cutlass",
    "sail", "mast", "crow's nest", "port", "starboard", "booty", "corsair", "swashbuckler",
    "maroon", "brig", "scurvy", "barnacle", "kraken", "sea", "deck", "compass", "horizon",
    "voyage", "flag", "helm", "storm", "reef", "lagoon", "island", "cove", "shipwreck", "gold",
    "captain", "quartermaster", "gunner", "lookout", "privateer",
  ],
  corporate: [
    "synergy", "leverage", "stakeholder", "pipeline", "bandwidth", "deliverable", "action-item",
    "circle-back", "deep-dive", "align", "scalable", "proactive", "paradigm", "ecosystem",
    "disrupt", "innovation", "roadmap", "milestone", "KPI", "ROI", "optimize", "streamline",
    "value-add", "best-practice", "core-competency", "game-changer", "thought-leader",
    "move-the-needle", "low-hanging-fruit", "win-win", "ideate", "pivot", "agile", "sprint",
    "retrospective", "stakeholder", "onboard", "offboard", "downsizing", "rightsizing",
    "headcount", "vertical", "horizontal", "touchpoint", "engagement", "empower", "holistic",
    "granular", "drill-down", "boil-the-ocean", "take-offline",
  ],
  space: [
    "nebula", "galaxy", "asteroid", "comet", "supernova", "quasar", "pulsar", "wormhole",
    "antimatter", "dark-matter", "photon", "orbit", "gravity", "constellation", "cosmos",
    "lightyear", "parsec", "terraform", "exoplanet", "interstellar", "hyperdrive", "warp",
    "stardust", "cosmic", "void", "singularity", "magnetar", "neutron", "solar", "lunar",
    "eclipse", "aurora", "capsule", "trajectory", "propulsion", "docking", "station", "payload",
    "mission", "launchpad", "countdown", "booster", "satellite", "telemetry", "spectral",
    "redshift", "blueshift", "fusion", "plasma", "radiation",
  ],
  foodie: [
    "umami", "saffron", "truffle", "sourdough", "fermented", "braised", "reduction", "emulsion",
    "julienne", "blanch", "sear", "deglaze", "caramelize", "fold", "infuse", "zest", "drizzle",
    "garnish", "plate", "tartare", "ceviche", "confit", "roux", "béchamel", "aioli", "chimichurri",
    "gremolata", "miso", "dashi", "ponzu", "harissa", "za'atar", "sumac", "cardamom", "turmeric",
    "szechuan", "pesto", "risotto", "gnocchi", "brioche", "crème-brûlée", "ganache", "praline",
    "compote", "coulis", "chiffonade", "microgreens", "heirloom", "artisanal", "farm-to-table",
  ],
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function generateSentence(words: string[], rand: () => number, minWords = 6, maxWords = 14): string {
  const len = Math.floor(rand() * (maxWords - minWords + 1)) + minWords;
  const picked: string[] = [];
  for (let i = 0; i < len; i++) {
    picked.push(words[Math.floor(rand() * words.length)]);
  }
  return capitalize(picked.join(" ")) + ".";
}

function generateParagraph(words: string[], rand: () => number, sentenceCount = 4): string {
  return Array.from({ length: sentenceCount }, () => generateSentence(words, rand)).join(" ");
}

function generateText(style: TextStyle, unit: OutputUnit, count: number, seed: number): string {
  const rand = seededRandom(seed);
  const w = WORDS[style];

  if (unit === "words") {
    const picked: string[] = [];
    for (let i = 0; i < count; i++) {
      picked.push(w[Math.floor(rand() * w.length)]);
    }
    return capitalize(picked.join(" ")) + ".";
  }

  if (unit === "sentences") {
    return Array.from({ length: count }, () => generateSentence(w, rand)).join(" ");
  }

  return Array.from({ length: count }, () => generateParagraph(w, rand, 3 + Math.floor(rand() * 3))).join("\n\n");
}

export default function LoremIpsumGenerator() {
  const [style, setStyle] = useState<TextStyle>("classic");
  const [unit, setUnit] = useState<OutputUnit>("paragraphs");
  const [count, setCount] = useState(3);
  const [seed, setSeed] = useState(() => Date.now());
  const [copied, setCopied] = useState(false);

  const text = useMemo(() => generateText(style, unit, count, seed), [style, unit, count, seed]);

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const charCount = text.length;

  const copyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Text copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  const regenerate = () => setSeed(Date.now());

  return (
    <>
      <SEO
        title="Lorem Ipsum Generator — Placeholder Text with Fun Styles | Minerva's Tools"
        description="Generate placeholder text in Classic, Hipster, Pirate, Corporate, Space, and Foodie styles. Choose paragraphs, sentences, or words. Free, no sign-up."
        canonical="/tools/lorem-ipsum"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Lorem Ipsum Generator",
            url: "https://minervas.tools/tools/lorem-ipsum",
            applicationCategory: "DesignApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description: "Generate placeholder text with fun alternative styles including Hipster, Pirate, Corporate, Space, and Foodie.",
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <MegaNav />
        <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Lorem Ipsum Generator</h1>
              <p className="mt-1 text-muted-foreground">
                Generate placeholder text with fun alternative styles.
              </p>
            </div>
            <ShareToolButton toolName="Lorem Ipsum Generator" />
          </div>

          {/* Style selector */}
          <div className="mb-6">
            <Label className="mb-2 block text-sm">Text Style</Label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(STYLE_META) as TextStyle[]).map((s) => (
                <Button
                  key={s}
                  variant={style === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStyle(s)}
                >
                  {STYLE_META[s].emoji} {STYLE_META[s].label}
                </Button>
              ))}
            </div>
          </div>

          {/* Unit tabs + count slider */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Tabs value={unit} onValueChange={(v) => setUnit(v as OutputUnit)}>
                <TabsList>
                  <TabsTrigger value="paragraphs">Paragraphs</TabsTrigger>
                  <TabsTrigger value="sentences">Sentences</TabsTrigger>
                  <TabsTrigger value="words">Words</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex items-center gap-3 sm:w-56">
              <Label className="text-sm whitespace-nowrap">Count</Label>
              <Slider
                min={1}
                max={unit === "words" ? 200 : unit === "sentences" ? 30 : 10}
                step={1}
                value={[count]}
                onValueChange={([v]) => setCount(v)}
              />
              <span className="w-8 text-right font-mono text-sm text-muted-foreground">{count}</span>
            </div>
          </div>

          {/* Action bar */}
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {wordCount} words · {charCount} characters
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={regenerate}>
                <ArrowCounterClockwise className="size-3.5 mr-1" /> Regenerate
              </Button>
              <Button variant="default" size="sm" onClick={copyText}>
                {copied ? <Check className="size-3.5 mr-1" /> : <Copy className="size-3.5 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>

          {/* Output */}
          <div className="rounded-lg border border-border bg-muted/20 p-5">
            <div className="prose prose-sm max-w-none text-foreground">
              {text.split("\n\n").map((para, i) => (
                <p key={i} className="mb-3 last:mb-0 leading-relaxed">{para}</p>
              ))}
            </div>
          </div>

          <ToolContent about={loremIpsumContent.about} faqs={loremIpsumContent.faqs} />
        </main>
        <Footer />
      </div>
    </>
  );
}
