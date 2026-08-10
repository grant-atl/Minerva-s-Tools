import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense, useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AccessibilityProvider from "@/components/AccessibilityProvider";

const Index = lazy(() => import("./pages/Index.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const PaletteGenerator = lazy(
  () => import("./pages/tools/PaletteGenerator.tsx"),
);
const GradientGenerator = lazy(
  () => import("./pages/tools/GradientGenerator.tsx"),
);
const ContrastChecker = lazy(() => import("./pages/tools/ContrastChecker.tsx"));
const QRCodeGenerator = lazy(() => import("./pages/tools/QRCodeGenerator.tsx"));
const BoxShadowGenerator = lazy(
  () => import("./pages/tools/BoxShadowGenerator.tsx"),
);
const TypographyScale = lazy(() => import("./pages/tools/TypographyScale.tsx"));
const FaviconGenerator = lazy(
  () => import("./pages/tools/FaviconGenerator.tsx"),
);
const FontPairing = lazy(() => import("./pages/tools/FontPairing.tsx"));
const SvgToCss = lazy(() => import("./pages/tools/SvgToCss.tsx"));
const MetaPreview = lazy(() => import("./pages/tools/MetaPreview.tsx"));
const SpacingCalculator = lazy(
  () => import("./pages/tools/SpacingCalculator.tsx"),
);
const ColorBlindnessSimulator = lazy(
  () => import("./pages/tools/ColorBlindnessSimulator.tsx"),
);
const TailwindColorFinder = lazy(
  () => import("./pages/tools/TailwindColorFinder.tsx"),
);
const PxRemConverter = lazy(() => import("./pages/tools/PxRemConverter.tsx"));
const GlassmorphismGenerator = lazy(
  () => import("./pages/tools/GlassmorphismGenerator.tsx"),
);
const NeumorphismGenerator = lazy(
  () => import("./pages/tools/NeumorphismGenerator.tsx"),
);
const AspectRatioCalculator = lazy(
  () => import("./pages/tools/AspectRatioCalculator.tsx"),
);
const LoremIpsumGenerator = lazy(
  () => import("./pages/tools/LoremIpsumGenerator.tsx"),
);
const FlexboxGenerator = lazy(
  () => import("./pages/tools/FlexboxGenerator.tsx"),
);
const GridGenerator = lazy(() => import("./pages/tools/GridGenerator.tsx"));
const BorderRadiusGenerator = lazy(
  () => import("./pages/tools/BorderRadiusGenerator.tsx"),
);
const ClampCalculator = lazy(() => import("./pages/tools/ClampCalculator.tsx"));
const ImageColorPicker = lazy(
  () => import("./pages/tools/ImageColorPicker.tsx"),
);
const ColorConverter = lazy(() => import("./pages/tools/ColorConverter.tsx"));
const SvgToPngConverter = lazy(
  () => import("./pages/tools/SvgToPngConverter.tsx"),
);
const SvgBlobPatternGenerator = lazy(
  () => import("./pages/tools/SvgBlobPatternGenerator.tsx"),
);
const JsonFormatterValidator = lazy(
  () => import("./pages/tools/JsonFormatterValidator.tsx"),
);
const Base64EncoderDecoder = lazy(
  () => import("./pages/tools/Base64EncoderDecoder.tsx"),
);
const UrlEncoderDecoder = lazy(
  () => import("./pages/tools/UrlEncoderDecoder.tsx"),
);
const UUIDGenerator = lazy(() => import("./pages/tools/UUIDGenerator.tsx"));
const RegexTesterReplacer = lazy(
  () => import("./pages/tools/RegexTesterReplacer.tsx"),
);
const JwtDecoderInspector = lazy(
  () => import("./pages/tools/JwtDecoderInspector.tsx"),
);
const HashGenerator = lazy(() => import("./pages/tools/HashGenerator.tsx"));
const UnixTimestampConverter = lazy(
  () => import("./pages/tools/UnixTimestampConverter.tsx"),
);
const CronExpressionBuilder = lazy(
  () => import("./pages/tools/CronExpressionBuilder.tsx"),
);
const ImageCompressor = lazy(() => import("./pages/tools/ImageCompressor.tsx"));
const ImageFormatConverter = lazy(
  () => import("./pages/tools/ImageFormatConverter.tsx"),
);
const ImageResizerCropper = lazy(
  () => import("./pages/tools/ImageResizerCropper.tsx"),
);
const SvgOptimizer = lazy(() => import("./pages/tools/SvgOptimizer.tsx"));
const SvgToReactConverter = lazy(
  () => import("./pages/tools/SvgToReactConverter.tsx"),
);
const ImageBase64Converter = lazy(
  () => import("./pages/tools/ImageBase64Converter.tsx"),
);
const CodeFormatterMinifier = lazy(
  () => import("./pages/tools/CodeFormatterMinifier.tsx"),
);
const CssAnimationGenerator = lazy(
  () => import("./pages/tools/CssAnimationGenerator.tsx"),
);
const ClipPathBezierEditor = lazy(
  () => import("./pages/tools/ClipPathBezierEditor.tsx"),
);
const TextUtilities = lazy(() => import("./pages/tools/TextUtilities.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Privacy = lazy(() => import("./pages/Privacy.tsx"));
const Terms = lazy(() => import("./pages/Terms.tsx"));
const Win98Desktop = lazy(() => import("./pages/Win98Desktop.tsx"));

function ScrollToLocation() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    let targetId: string;
    try {
      targetId = decodeURIComponent(hash.slice(1));
    } catch {
      targetId = hash.slice(1);
    }

    const scrollToTarget = () => {
      const target = document.getElementById(targetId);
      if (!target) return false;
      target.scrollIntoView();
      return true;
    };

    if (scrollToTarget()) return;

    const root = document.getElementById("root");
    if (!root) return;

    const observer = new MutationObserver(() => {
      if (scrollToTarget()) observer.disconnect();
    });
    observer.observe(root, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [hash, pathname]);

  return null;
}

function RouteLoading() {
  return (
    <main
      aria-busy="true"
      className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground"
    >
      <div
        role="status"
        aria-live="polite"
        className="flex items-center gap-3 text-sm text-muted-foreground"
      >
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-border border-t-foreground motion-reduce:animate-none"
        />
        Loading Minerva…
      </div>
    </main>
  );
}

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <ScrollToLocation />
          <AccessibilityProvider>
            <Suspense fallback={<RouteLoading />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/tools/palette" element={<PaletteGenerator />} />
                <Route path="/tools/gradient" element={<GradientGenerator />} />
                <Route path="/tools/contrast" element={<ContrastChecker />} />
                <Route path="/tools/qr-code" element={<QRCodeGenerator />} />
                <Route
                  path="/tools/box-shadow"
                  element={<BoxShadowGenerator />}
                />
                <Route
                  path="/tools/typography-scale"
                  element={<TypographyScale />}
                />
                <Route path="/tools/favicon" element={<FaviconGenerator />} />
                <Route path="/tools/font-pairing" element={<FontPairing />} />
                <Route path="/tools/svg-to-css" element={<SvgToCss />} />
                <Route path="/tools/meta-preview" element={<MetaPreview />} />
                <Route path="/tools/spacing" element={<SpacingCalculator />} />
                <Route
                  path="/tools/color-blindness"
                  element={<ColorBlindnessSimulator />}
                />
                <Route
                  path="/tools/tailwind-color"
                  element={<TailwindColorFinder />}
                />
                <Route path="/tools/px-rem" element={<PxRemConverter />} />
                <Route
                  path="/tools/glassmorphism"
                  element={<GlassmorphismGenerator />}
                />
                <Route
                  path="/tools/neumorphism"
                  element={<NeumorphismGenerator />}
                />
                <Route
                  path="/tools/aspect-ratio"
                  element={<AspectRatioCalculator />}
                />
                <Route
                  path="/tools/lorem-ipsum"
                  element={<LoremIpsumGenerator />}
                />
                <Route path="/tools/flexbox" element={<FlexboxGenerator />} />
                <Route path="/tools/grid" element={<GridGenerator />} />
                <Route
                  path="/tools/border-radius"
                  element={<BorderRadiusGenerator />}
                />
                <Route
                  path="/tools/clamp-calculator"
                  element={<ClampCalculator />}
                />
                <Route
                  path="/tools/image-color-picker"
                  element={<ImageColorPicker />}
                />
                <Route
                  path="/tools/color-converter"
                  element={<ColorConverter />}
                />
                <Route
                  path="/tools/svg-to-png"
                  element={<SvgToPngConverter />}
                />
                <Route
                  path="/tools/svg-blob-pattern"
                  element={<SvgBlobPatternGenerator />}
                />
                <Route
                  path="/tools/json-formatter"
                  element={<JsonFormatterValidator />}
                />
                <Route
                  path="/tools/base64"
                  element={<Base64EncoderDecoder />}
                />
                <Route
                  path="/tools/url-encode"
                  element={<UrlEncoderDecoder />}
                />
                <Route path="/tools/uuid" element={<UUIDGenerator />} />
                <Route
                  path="/tools/regex-tester"
                  element={<RegexTesterReplacer />}
                />
                <Route
                  path="/tools/jwt-decoder"
                  element={<JwtDecoderInspector />}
                />
                <Route
                  path="/tools/hash-generator"
                  element={<HashGenerator />}
                />
                <Route
                  path="/tools/unix-timestamp"
                  element={<UnixTimestampConverter />}
                />
                <Route
                  path="/tools/cron-builder"
                  element={<CronExpressionBuilder />}
                />
                <Route
                  path="/tools/image-compressor"
                  element={<ImageCompressor />}
                />
                <Route
                  path="/tools/image-format-converter"
                  element={<ImageFormatConverter />}
                />
                <Route
                  path="/tools/image-resizer-cropper"
                  element={<ImageResizerCropper />}
                />
                <Route path="/tools/svg-optimizer" element={<SvgOptimizer />} />
                <Route
                  path="/tools/svg-to-react"
                  element={<SvgToReactConverter />}
                />
                <Route
                  path="/tools/image-base64"
                  element={<ImageBase64Converter />}
                />
                <Route
                  path="/tools/code-formatter-minifier"
                  element={<CodeFormatterMinifier />}
                />
                <Route
                  path="/tools/css-animation-generator"
                  element={<CssAnimationGenerator />}
                />
                <Route
                  path="/tools/clip-path-bezier"
                  element={<ClipPathBezierEditor />}
                />
                <Route
                  path="/tools/text-utilities"
                  element={<TextUtilities />}
                />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/98" element={<Win98Desktop />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AccessibilityProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
