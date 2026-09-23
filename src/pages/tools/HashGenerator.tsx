import { useEffect, useMemo, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { toast } from "sonner";
import HomeNav from "@/components/HomeNav";
import ShareToolButton from "@/components/ShareToolButton";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ToolSchema from "@/components/ToolSchema";
import ToolContent from "@/components/ToolContent";
import { hashGeneratorContent } from "@/lib/tool-content-data";
import { TOOL_TEXTAREA_OUTLINE_CLASS } from "@/lib/tool-ui";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type HashAlgorithm = "MD5" | "SHA-1" | "SHA-256" | "SHA-512";

const ALGORITHMS: HashAlgorithm[] = ["MD5", "SHA-1", "SHA-256", "SHA-512"];

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function hexToBase64(hex: string): string {
  const bytes = new Uint8Array(hex.match(/.{1,2}/g)?.map((byte) => Number.parseInt(byte, 16)) ?? []);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function add32(a: number, b: number): number {
  return (a + b) >>> 0;
}

function rotateLeft(value: number, amount: number): number {
  return ((value << amount) | (value >>> (32 - amount))) >>> 0;
}

function md5(text: string): string {
  const inputBytes = new TextEncoder().encode(text);
  const originalBitLength = inputBytes.length * 8;
  const paddedLength = (((inputBytes.length + 8) >> 6) + 1) * 64;
  const buffer = new Uint8Array(paddedLength);
  buffer.set(inputBytes);
  buffer[inputBytes.length] = 0x80;

  const bitLengthLow = originalBitLength >>> 0;
  const bitLengthHigh = Math.floor(originalBitLength / 0x100000000) >>> 0;
  const lengthOffset = paddedLength - 8;
  buffer[lengthOffset] = bitLengthLow & 0xff;
  buffer[lengthOffset + 1] = (bitLengthLow >>> 8) & 0xff;
  buffer[lengthOffset + 2] = (bitLengthLow >>> 16) & 0xff;
  buffer[lengthOffset + 3] = (bitLengthLow >>> 24) & 0xff;
  buffer[lengthOffset + 4] = bitLengthHigh & 0xff;
  buffer[lengthOffset + 5] = (bitLengthHigh >>> 8) & 0xff;
  buffer[lengthOffset + 6] = (bitLengthHigh >>> 16) & 0xff;
  buffer[lengthOffset + 7] = (bitLengthHigh >>> 24) & 0xff;

  const words = new Uint32Array(16);
  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  const s = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];

  const k = Array.from({ length: 64 }, (_, index) => Math.floor(Math.abs(Math.sin(index + 1)) * 0x100000000) >>> 0);

  for (let offset = 0; offset < buffer.length; offset += 64) {
    for (let index = 0; index < 16; index += 1) {
      const wordOffset = offset + index * 4;
      words[index] =
        (buffer[wordOffset] |
          (buffer[wordOffset + 1] << 8) |
          (buffer[wordOffset + 2] << 16) |
          (buffer[wordOffset + 3] << 24)) >>>
        0;
    }

    let aa = a;
    let bb = b;
    let cc = c;
    let dd = d;

    for (let index = 0; index < 64; index += 1) {
      let f = 0;
      let g = 0;

      if (index < 16) {
        f = (bb & cc) | (~bb & dd);
        g = index;
      } else if (index < 32) {
        f = (dd & bb) | (~dd & cc);
        g = (5 * index + 1) % 16;
      } else if (index < 48) {
        f = bb ^ cc ^ dd;
        g = (3 * index + 5) % 16;
      } else {
        f = cc ^ (bb | ~dd);
        g = (7 * index) % 16;
      }

      const temp = dd;
      dd = cc;
      cc = bb;
      const sum = add32(aa, add32(f, add32(k[index], words[g])));
      bb = add32(bb, rotateLeft(sum, s[index]));
      aa = temp;
    }

    a = add32(a, aa);
    b = add32(b, bb);
    c = add32(c, cc);
    d = add32(d, dd);
  }

  const output = new Uint8Array(16);
  [a, b, c, d].forEach((word, wordIndex) => {
    output[wordIndex * 4] = word & 0xff;
    output[wordIndex * 4 + 1] = (word >>> 8) & 0xff;
    output[wordIndex * 4 + 2] = (word >>> 16) & 0xff;
    output[wordIndex * 4 + 3] = (word >>> 24) & 0xff;
  });

  return bytesToHex(output);
}

async function getDigest(text: string, algorithm: HashAlgorithm): Promise<string> {
  if (algorithm === "MD5") {
    return md5(text);
  }
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest(algorithm, data);
  return bytesToHex(new Uint8Array(digest));
}

export default function HashGenerator() {
  const [input, setInput] = useState("Minerva's Tools hash test");
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("SHA-256");
  const [hashHex, setHashHex] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<"hex" | "base64" | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const result = await getDigest(input, algorithm);
        if (cancelled) return;
        setHashHex(result);
        setError(null);
      } catch (digestError) {
        if (cancelled) return;
        setHashHex("");
        setError((digestError as Error).message);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [algorithm, input]);

  const hashBase64 = useMemo(() => (hashHex ? hexToBase64(hashHex) : ""), [hashHex]);

  const copyValue = async (kind: "hex" | "base64", value: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(kind);
    toast.success(`${kind.toUpperCase()} hash copied`);
    window.setTimeout(() => setCopied(null), 1400);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Hash Generator — MD5, SHA-1, SHA-256, SHA-512 | Minerva's Tools"
        description="Hash text with MD5, SHA-1, SHA-256, or SHA-512 and copy hexadecimal or Base64 output."
        canonical="/tools/hash-generator"
      />
      <ToolSchema
        name="Hash Generator"
        description="Hash input text with MD5 or SHA and copy HEX or Base64 output."
        url="/tools/hash-generator"
        faqs={hashGeneratorContent.faqs}
      />

      <HomeNav />

      <main className="container mx-auto px-4 py-10 sm:px-6 lg:py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hash Generator</h1>
            <p className="mt-1 text-muted-foreground">Create deterministic MD5 and SHA hashes for payload verification and debugging.</p>
          </div>
          <ShareToolButton toolName="Hash Generator" />
        </div>

        <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap gap-2">
            {ALGORITHMS.map((candidate) => (
              <Button key={candidate} size="sm" variant={algorithm === candidate ? "default" : "outline"} onClick={() => setAlgorithm(candidate)}>
                {candidate}
              </Button>
            ))}
          </div>

          <p className="mb-1.5 text-sm font-medium">Input</p>
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className={`min-h-[180px] font-mono text-xs ${TOOL_TEXTAREA_OUTLINE_CLASS}`}
            placeholder="Enter text to hash"
          />

          {error && <p className="mt-3 text-sm text-destructive">Hash generation failed: {error}</p>}

          <div className="mt-4 space-y-3">
            <div className="rounded-md border border-border p-3">
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-sm font-medium">HEX Output</p>
                <Button size="sm" variant="outline" className="gap-1" onClick={() => copyValue("hex", hashHex)} disabled={!hashHex}>
                  {copied === "hex" ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />} Copy
                </Button>
              </div>
              <Textarea readOnly value={hashHex} className={`min-h-[90px] font-mono text-xs ${TOOL_TEXTAREA_OUTLINE_CLASS}`} />
            </div>

            <div className="rounded-md border border-border p-3">
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-sm font-medium">Base64 Output</p>
                <Button size="sm" variant="outline" className="gap-1" onClick={() => copyValue("base64", hashBase64)} disabled={!hashBase64}>
                  {copied === "base64" ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />} Copy
                </Button>
              </div>
              <Textarea readOnly value={hashBase64} className={`min-h-[90px] font-mono text-xs ${TOOL_TEXTAREA_OUTLINE_CLASS}`} />
            </div>
          </div>
        </section>

        <ToolContent about={hashGeneratorContent.about} faqs={hashGeneratorContent.faqs} />
      </main>

      <Footer />
    </div>
  );
}
