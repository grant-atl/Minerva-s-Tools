import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AccessibilityProvider from "@/components/AccessibilityProvider";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import PaletteGenerator from "./pages/tools/PaletteGenerator.tsx";
import GradientGenerator from "./pages/tools/GradientGenerator.tsx";
import ContrastChecker from "./pages/tools/ContrastChecker.tsx";
import QRCodeGenerator from "./pages/tools/QRCodeGenerator.tsx";
import BoxShadowGenerator from "./pages/tools/BoxShadowGenerator.tsx";
import TypographyScale from "./pages/tools/TypographyScale.tsx";
import FaviconGenerator from "./pages/tools/FaviconGenerator.tsx";
import FontPairing from "./pages/tools/FontPairing.tsx";
import SvgToCss from "./pages/tools/SvgToCss.tsx";
import MetaPreview from "./pages/tools/MetaPreview.tsx";
import SpacingCalculator from "./pages/tools/SpacingCalculator.tsx";
import ColorBlindnessSimulator from "./pages/tools/ColorBlindnessSimulator.tsx";
import TailwindColorFinder from "./pages/tools/TailwindColorFinder.tsx";
import PxRemConverter from "./pages/tools/PxRemConverter.tsx";
import GlassmorphismGenerator from "./pages/tools/GlassmorphismGenerator.tsx";
import NeumorphismGenerator from "./pages/tools/NeumorphismGenerator.tsx";
import AspectRatioCalculator from "./pages/tools/AspectRatioCalculator.tsx";
import LoremIpsumGenerator from "./pages/tools/LoremIpsumGenerator.tsx";
import FlexboxGenerator from "./pages/tools/FlexboxGenerator.tsx";
import GridGenerator from "./pages/tools/GridGenerator.tsx";
import BorderRadiusGenerator from "./pages/tools/BorderRadiusGenerator.tsx";
import ClampCalculator from "./pages/tools/ClampCalculator.tsx";
import ImageColorPicker from "./pages/tools/ImageColorPicker.tsx";
import ColorConverter from "./pages/tools/ColorConverter.tsx";
import SvgToPngConverter from "./pages/tools/SvgToPngConverter.tsx";
import SvgBlobPatternGenerator from "./pages/tools/SvgBlobPatternGenerator.tsx";
import JsonFormatterValidator from "./pages/tools/JsonFormatterValidator.tsx";
import Base64EncoderDecoder from "./pages/tools/Base64EncoderDecoder.tsx";
import UrlEncoderDecoder from "./pages/tools/UrlEncoderDecoder.tsx";
import UUIDGenerator from "./pages/tools/UUIDGenerator.tsx";
import RegexTesterReplacer from "./pages/tools/RegexTesterReplacer.tsx";
import JwtDecoderInspector from "./pages/tools/JwtDecoderInspector.tsx";
import HashGenerator from "./pages/tools/HashGenerator.tsx";
import UnixTimestampConverter from "./pages/tools/UnixTimestampConverter.tsx";
import CronExpressionBuilder from "./pages/tools/CronExpressionBuilder.tsx";
import ImageCompressor from "./pages/tools/ImageCompressor.tsx";
import ImageFormatConverter from "./pages/tools/ImageFormatConverter.tsx";
import ImageResizerCropper from "./pages/tools/ImageResizerCropper.tsx";
import SvgOptimizer from "./pages/tools/SvgOptimizer.tsx";
import SvgToReactConverter from "./pages/tools/SvgToReactConverter.tsx";
import ImageBase64Converter from "./pages/tools/ImageBase64Converter.tsx";
import CodeFormatterMinifier from "./pages/tools/CodeFormatterMinifier.tsx";
import CssAnimationGenerator from "./pages/tools/CssAnimationGenerator.tsx";
import ClipPathBezierEditor from "./pages/tools/ClipPathBezierEditor.tsx";
import TextUtilities from "./pages/tools/TextUtilities.tsx";
import About from "./pages/About.tsx";
import Privacy from "./pages/Privacy.tsx";
import Terms from "./pages/Terms.tsx";
import Win98Desktop from "./pages/Win98Desktop.tsx";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
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
          <ScrollToTop />
          <AccessibilityProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/tools/palette" element={<PaletteGenerator />} />
              <Route path="/tools/gradient" element={<GradientGenerator />} />
              <Route path="/tools/contrast" element={<ContrastChecker />} />
              <Route path="/tools/qr-code" element={<QRCodeGenerator />} />
              <Route path="/tools/box-shadow" element={<BoxShadowGenerator />} />
              <Route path="/tools/typography-scale" element={<TypographyScale />} />
              <Route path="/tools/favicon" element={<FaviconGenerator />} />
              <Route path="/tools/font-pairing" element={<FontPairing />} />
              <Route path="/tools/svg-to-css" element={<SvgToCss />} />
              <Route path="/tools/meta-preview" element={<MetaPreview />} />
              <Route path="/tools/spacing" element={<SpacingCalculator />} />
              <Route path="/tools/color-blindness" element={<ColorBlindnessSimulator />} />
              <Route path="/tools/tailwind-color" element={<TailwindColorFinder />} />
              <Route path="/tools/px-rem" element={<PxRemConverter />} />
              <Route path="/tools/glassmorphism" element={<GlassmorphismGenerator />} />
              <Route path="/tools/neumorphism" element={<NeumorphismGenerator />} />
              <Route path="/tools/aspect-ratio" element={<AspectRatioCalculator />} />
              <Route path="/tools/lorem-ipsum" element={<LoremIpsumGenerator />} />
              <Route path="/tools/flexbox" element={<FlexboxGenerator />} />
              <Route path="/tools/grid" element={<GridGenerator />} />
              <Route path="/tools/border-radius" element={<BorderRadiusGenerator />} />
              <Route path="/tools/clamp-calculator" element={<ClampCalculator />} />
              <Route path="/tools/image-color-picker" element={<ImageColorPicker />} />
              <Route path="/tools/color-converter" element={<ColorConverter />} />
              <Route path="/tools/svg-to-png" element={<SvgToPngConverter />} />
              <Route path="/tools/svg-blob-pattern" element={<SvgBlobPatternGenerator />} />
              <Route path="/tools/json-formatter" element={<JsonFormatterValidator />} />
              <Route path="/tools/base64" element={<Base64EncoderDecoder />} />
              <Route path="/tools/url-encode" element={<UrlEncoderDecoder />} />
              <Route path="/tools/uuid" element={<UUIDGenerator />} />
              <Route path="/tools/regex-tester" element={<RegexTesterReplacer />} />
              <Route path="/tools/jwt-decoder" element={<JwtDecoderInspector />} />
              <Route path="/tools/hash-generator" element={<HashGenerator />} />
              <Route path="/tools/unix-timestamp" element={<UnixTimestampConverter />} />
              <Route path="/tools/cron-builder" element={<CronExpressionBuilder />} />
              <Route path="/tools/image-compressor" element={<ImageCompressor />} />
              <Route path="/tools/image-format-converter" element={<ImageFormatConverter />} />
              <Route path="/tools/image-resizer-cropper" element={<ImageResizerCropper />} />
              <Route path="/tools/svg-optimizer" element={<SvgOptimizer />} />
              <Route path="/tools/svg-to-react" element={<SvgToReactConverter />} />
              <Route path="/tools/image-base64" element={<ImageBase64Converter />} />
              <Route path="/tools/code-formatter-minifier" element={<CodeFormatterMinifier />} />
              <Route path="/tools/css-animation-generator" element={<CssAnimationGenerator />} />
              <Route path="/tools/clip-path-bezier" element={<ClipPathBezierEditor />} />
              <Route path="/tools/text-utilities" element={<TextUtilities />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/98" element={<Win98Desktop />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AccessibilityProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
