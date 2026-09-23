import {
  Palette,
  QrCode,
  Gradient,
  Eye,
  Square,
  TextAa,
  Image,
  Code,
  Eyeglasses,
  TextT,
  Columns,
  CubeTransparent,
  Circle,
  MagnifyingGlass,
  ArrowsOutSimple,
  ArrowsLeftRight,
  Browser,
  TextAlignLeft,
} from "@phosphor-icons/react";

export interface Tool {
  name: string;
  description: string;
  icon: React.ElementType;
  category: "Colors" | "Layout" | "Image" | "Data/Dev" | "Generators" | "Converters";
  tier: 1 | 2 | 3;
  route: string;
}

export const tools: Tool[] = [
  { name: "Color Palette Generator", description: "Generate color palettes with six color harmony modes", icon: Palette, category: "Colors", tier: 1, route: "/tools/palette" },
  { name: "QR Code Generator", description: "Create QR codes for URLs, text, WiFi, email, and phone numbers", icon: QrCode, category: "Generators", tier: 1, route: "/tools/qr-code" },
  { name: "Gradient Generator", description: "Build linear, radial, and conic CSS gradients", icon: Gradient, category: "Colors", tier: 1, route: "/tools/gradient" },
  { name: "Contrast Checker", description: "Test WCAG AA & AAA color contrast compliance", icon: Eye, category: "Colors", tier: 1, route: "/tools/contrast" },
  { name: "Box Shadow Generator", description: "Design CSS box shadows with a visual editor", icon: Square, category: "Generators", tier: 1, route: "/tools/box-shadow" },
  { name: "Typography Scale", description: "Generate type scales with custom ratios and fonts", icon: TextAa, category: "Generators", tier: 1, route: "/tools/typography-scale" },
  { name: "Favicon Generator", description: "Create favicons from images, text, or emoji", icon: Image, category: "Generators", tier: 1, route: "/tools/favicon" },
  { name: "SVG to CSS Converter", description: "Convert SVG to inline CSS background images", icon: Code, category: "Converters", tier: 1, route: "/tools/svg-to-css" },
  { name: "Color Blindness Simulator", description: "Preview colors, images, and screenshots through different vision types", icon: Eyeglasses, category: "Colors", tier: 1, route: "/tools/color-blindness" },
  { name: "Font Pairing", description: "Compare Google Fonts or uploaded fonts for headings and body text", icon: TextT, category: "Generators", tier: 1, route: "/tools/font-pairing" },
  { name: "Spacing Calculator", description: "Generate consistent spacing and sizing scales", icon: Columns, category: "Generators", tier: 1, route: "/tools/spacing" },
  { name: "Glassmorphism Generator", description: "Create frosted-glass UI effects with live preview", icon: CubeTransparent, category: "Generators", tier: 1, route: "/tools/glassmorphism" },
  { name: "Neumorphism Generator", description: "Create soft raised and pressed UI surfaces", icon: Circle, category: "Generators", tier: 1, route: "/tools/neumorphism" },
  { name: "Tailwind Color Finder", description: "Find the nearest Tailwind class for any HEX color", icon: MagnifyingGlass, category: "Colors", tier: 1, route: "/tools/tailwind-color" },
  { name: "Aspect Ratio Calculator", description: "Simplify ratios and calculate missing dimensions", icon: ArrowsOutSimple, category: "Converters", tier: 1, route: "/tools/aspect-ratio" },
  { name: "px ↔ rem Converter", description: "Convert between px and rem units", icon: ArrowsLeftRight, category: "Converters", tier: 1, route: "/tools/px-rem" },
  { name: "Meta Tag Preview", description: "Preview how your page looks on Google, Twitter & Slack", icon: Browser, category: "Generators", tier: 1, route: "/tools/meta-preview" },
  { name: "Lorem Ipsum Generator", description: "Generate placeholder paragraphs, sentences, or words", icon: TextAlignLeft, category: "Generators", tier: 1, route: "/tools/lorem-ipsum" },
  { name: "Flexbox Generator", description: "Build responsive Flexbox layouts with live CSS output", icon: Columns, category: "Layout", tier: 1, route: "/tools/flexbox" },
  { name: "Grid Generator", description: "Generate CSS Grid templates with visual controls", icon: Square, category: "Layout", tier: 1, route: "/tools/grid" },
  { name: "Border Radius Generator", description: "Shape corners with per-side radius controls", icon: Circle, category: "Layout", tier: 1, route: "/tools/border-radius" },
  { name: "Clamp Calculator", description: "Create fluid responsive clamp() values for CSS", icon: ArrowsLeftRight, category: "Layout", tier: 1, route: "/tools/clamp-calculator" },
  { name: "Image Color Picker", description: "Sample exact colors and extract dominant palettes from images", icon: Image, category: "Image", tier: 1, route: "/tools/image-color-picker" },
  { name: "Image Compressor", description: "Compress image files with quality and size controls", icon: Image, category: "Image", tier: 1, route: "/tools/image-compressor" },
  { name: "Image Format Converter", description: "Convert images between PNG, JPEG, and WebP", icon: ArrowsLeftRight, category: "Image", tier: 1, route: "/tools/image-format-converter" },
  { name: "Image Resizer & Cropper", description: "Resize dimensions and center-crop with aspect presets", icon: ArrowsOutSimple, category: "Image", tier: 1, route: "/tools/image-resizer-cropper" },
  { name: "Image Base64 Converter", description: "Convert images to Base64 data URIs and decode back", icon: Code, category: "Image", tier: 1, route: "/tools/image-base64" },
  { name: "Color Converter", description: "Convert between HEX, RGB, and HSL", icon: Palette, category: "Colors", tier: 1, route: "/tools/color-converter" },
  { name: "SVG to PNG Converter", description: "Convert SVG markup into downloadable PNG files", icon: Code, category: "Image", tier: 1, route: "/tools/svg-to-png" },
  { name: "SVG Blob & Pattern Generator", description: "Generate blob and repeating SVG background assets", icon: Gradient, category: "Image", tier: 1, route: "/tools/svg-blob-pattern" },
  { name: "SVG Optimizer", description: "Minify and clean SVG markup", icon: Code, category: "Converters", tier: 1, route: "/tools/svg-optimizer" },
  { name: "SVG to React Converter", description: "Convert SVG into JSX/TSX React components", icon: Code, category: "Converters", tier: 1, route: "/tools/svg-to-react" },
  { name: "JSON Formatter & Validator", description: "Format, minify, and validate JSON", icon: Code, category: "Data/Dev", tier: 1, route: "/tools/json-formatter" },
  { name: "Code Formatter & Minifier", description: "Format or minify HTML, CSS, and JavaScript snippets", icon: Code, category: "Data/Dev", tier: 1, route: "/tools/code-formatter-minifier" },
  { name: "Base64 Encoder/Decoder", description: "Encode text to Base64 or decode it back", icon: ArrowsLeftRight, category: "Data/Dev", tier: 1, route: "/tools/base64" },
  { name: "URL Encoder/Decoder", description: "Encode and decode URL-safe strings", icon: Browser, category: "Data/Dev", tier: 1, route: "/tools/url-encode" },
  { name: "UUID Generator", description: "Generate UUID v4 identifiers in bulk", icon: QrCode, category: "Data/Dev", tier: 1, route: "/tools/uuid" },
  { name: "Regex Tester & Replacer", description: "Test JavaScript regex patterns and replacement output", icon: Code, category: "Data/Dev", tier: 1, route: "/tools/regex-tester" },
  { name: "JWT Decoder & Inspector", description: "Decode JWT header and payload claims client-side", icon: Browser, category: "Data/Dev", tier: 1, route: "/tools/jwt-decoder" },
  { name: "Hash Generator", description: "Generate MD5 and SHA hashes from text input", icon: Code, category: "Data/Dev", tier: 1, route: "/tools/hash-generator" },
  { name: "Unix Timestamp Converter", description: "Convert epoch seconds/milliseconds to date-time and back", icon: ArrowsLeftRight, category: "Data/Dev", tier: 1, route: "/tools/unix-timestamp" },
  { name: "Cron Expression Builder", description: "Build and validate 5-field cron schedules", icon: Browser, category: "Data/Dev", tier: 1, route: "/tools/cron-builder" },
  { name: "CSS Animation Generator", description: "Generate keyframes and animation CSS with live preview", icon: Gradient, category: "Layout", tier: 1, route: "/tools/css-animation-generator" },
  { name: "Clip-Path & Bezier Editor", description: "Build clip-path shapes and tune cubic-bezier easing", icon: Square, category: "Layout", tier: 1, route: "/tools/clip-path-bezier" },
  { name: "Text Utilities", description: "Case conversion, slug generation, and text counters", icon: TextAlignLeft, category: "Data/Dev", tier: 1, route: "/tools/text-utilities" },
];

export const categories = ["Colors", "Layout", "Image", "Data/Dev", "Generators", "Converters"] as const;

export const categoryDescriptions: Record<string, string> = {
  Colors: "Tools for working with color — palettes, gradients, contrast, accessibility, and simulation.",
  Layout: "Layout and CSS composition tools for Flexbox, Grid, radius, and fluid sizing.",
  Image: "Image and SVG utilities for extraction, conversion, and asset generation.",
  "Data/Dev": "Developer utilities for encoding, formatting, hashing, token inspection, and scheduling.",
  Generators: "Visual builders for CSS effects, typography, and assets.",
  Converters: "Convert formats, units, and dimensions.",
};
