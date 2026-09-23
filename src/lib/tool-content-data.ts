import type { FAQ } from "@/components/ToolContent";

interface ToolContentData {
  about: string;
  faqs: FAQ[];
}

export const paletteContent: ToolContentData = {
  about: `
<p>Generate five-color palettes using random, analogous, complementary, triadic, split-complementary, or monochromatic modes. Lock colors while regenerating, compare WCAG contrast ratios, and copy HEX, RGB, or HSL values. Calculations run in your browser.</p>
  `,
  faqs: [
    { q: "What color harmony modes are available?", a: "The generator supports six modes: Random, Analogous, Complementary, Triadic, Split-Complementary, and Monochromatic. Each mode uses a different relationship on the color wheel." },
    { q: "Can I lock specific colors while regenerating?", a: "Yes. Click the lock icon on any swatch to keep it fixed. When you regenerate, only the unlocked colors will change." },
    { q: "Does this check color accessibility?", a: "The built-in contrast checker analyzes every foreground/background pair against WCAG 2.1 AA and AAA standards, so you can verify readability before using the palette." },
    { q: "What formats can I copy colors in?", a: "You can copy each color as HEX (#1e293b), RGB (rgb(30, 41, 59)), or HSL (hsl(215, 33%, 17%)). All values are calculated client-side." },
  ],
};

export const gradientContent: ToolContentData = {
  about: `
<p>Build linear, radial, and conic CSS gradients with up to eight color stops. Adjust the angle, position, and colors in the preview, then copy the CSS.</p>
  `,
  faqs: [
    { q: "What gradient types are supported?", a: "Linear, radial, and conic gradients are all supported. Switch between them and the CSS output updates automatically." },
    { q: "How many color stops can I add?", a: "You can add up to eight color stops per gradient. Each stop has adjustable color and position values." },
    { q: "Can I use the generated CSS directly?", a: "Yes — the output is valid CSS that works in all modern browsers. Just copy and paste it into your stylesheet." },
    { q: "Are there preset gradients I can start from?", a: "Yes. Select a preset such as Sunset, Ocean, or Aurora, then adjust its colors and positions." },
  ],
};

export const contrastContent: ToolContentData = {
  about: `
<p>Compare two HEX colors against WCAG 2.1 AA and AAA text contrast thresholds. AA requires 4.5:1 for normal text and 3:1 for large text; AAA requires 7:1 and 4.5:1. Preview the pairing in text and controls, or copy the result.</p>
  `,
  faqs: [
    { q: "What is a good contrast ratio?", a: "For body text, aim for at least 4.5:1 (WCAG AA). For large text (18px+ bold or 24px+ regular), 3:1 is the minimum. For the highest accessibility standard (AAA), target 7:1 for normal text." },
    { q: "What's the difference between AA and AAA?", a: "AA is the minimum acceptable level of contrast for most web content. AAA is a stricter standard that provides better readability, especially for users with visual impairments." },
    { q: "Does this tool support RGB or HSL input?", a: "Currently the tool accepts HEX color values (#000000 format). The color details panel shows the equivalent RGB and HSL values for reference." },
    { q: "Can I test multiple color pairs at once?", a: "This tool tests one pair at a time. For bulk analysis, try the Palette Generator which includes built-in contrast checking across all generated colors." },
  ],
};

export const qrCodeContent: ToolContentData = {
  about: `
<p>Create QR codes for URLs, text, WiFi credentials, email addresses, and phone numbers. Set colors, error correction, and an optional logo, then download PNG or SVG. QR content and uploaded logos are processed in your browser.</p>
  `,
  faqs: [
    { q: "What content types can I encode?", a: "The generator supports URLs, plain text, WiFi network credentials (SSID, password, encryption type), email addresses (with optional subject/body), and phone numbers." },
    { q: "Can I add a logo to the QR code?", a: "Yes. Upload any image (PNG, JPG, or SVG) to place it in the center of your QR code. The error correction level adjusts automatically to ensure the code remains scannable." },
    { q: "What's the difference between PNG and SVG download?", a: "PNG stores pixels at a fixed size. SVG stores vector shapes that can be scaled without changing their resolution." },
    { q: "Is my QR code content sent to a server?", a: "No. The tool generates the code in your browser and does not upload the content or logo you provide." },
  ],
};

export const boxShadowContent: ToolContentData = {
  about: `
<p>Build CSS box shadows with up to eight layers. Set each layer’s offset, blur, spread, color, opacity, and inset mode, then copy the CSS. Presets replace the current layers.</p>
  `,
  faqs: [
    { q: "How many shadow layers can I add?", a: "You can stack up to eight independent shadow layers. Each layer has its own offset, blur, spread, color, opacity, and inset settings." },
    { q: "What are inset shadows?", a: "Inset shadows appear inside the element rather than outside. They're commonly used for pressed/recessed effects and neumorphic design patterns." },
    { q: "Can I customize the preview element?", a: "You can change the preview background color and the element's size and border radius to match your actual design context." },
    { q: "Do the presets overwrite my current shadow?", a: "Yes — selecting a preset replaces all current layers. If you want to keep your work, copy the CSS first before switching presets." },
  ],
};

export const typographyContent: ToolContentData = {
  about: `
<p>Calculate font sizes from a base size and a modular ratio. Preview heading and body sizes with built-in or Google Fonts, then export CSS custom properties or Tailwind configuration.</p>
  `,
  faqs: [
    { q: "What is a modular type scale?", a: "A modular scale starts from a base font size and multiplies each successive step by the selected ratio." },
    { q: "Which ratio should I choose?", a: "For UI and app design, smaller ratios like Major Second (1.125) or Minor Third (1.2) work well. For editorial or marketing pages where headings need more impact, try Perfect Fourth (1.333) or Golden Ratio (1.618)." },
    { q: "Can I export the scale for Tailwind CSS?", a: "Yes. The export panel generates a ready-to-paste Tailwind config object with your calculated font sizes, or CSS custom properties for use in any project." },
    { q: "How many fonts are available for preview?", a: "Over 30 Google Fonts are available across Sans Serif, Serif, Monospace, and Display categories. Fonts load on demand." },
  ],
};

export const faviconContent: ToolContentData = {
  about: `
<p>Create icons from an image, text, or emoji. Adjust the background, corners, and padding, then download PNG files, an ICO, a web manifest, and HTML tags individually or as a ZIP. Uploaded images stay in your browser.</p>
  `,
  faqs: [
    { q: "What file sizes are generated?", a: "The generator creates favicon.ico (16+32+48px combined), individual PNGs at 16, 32, 48, and 96px, an Apple Touch Icon at 180px, and Android Chrome icons at 192 and 512px." },
    { q: "Can I use an SVG as input?", a: "Yes. Upload any SVG and the tool will rasterize it at each required size. SVGs typically produce the sharpest results because they scale without quality loss." },
    { q: "What is the site.webmanifest file?", a: "It's a JSON file that tells browsers about your web app, including which icons to use. The generator creates one pre-filled with your icon file paths." },
    { q: "Is my uploaded image stored anywhere?", a: "No. All processing happens in your browser. Your image is never uploaded to a server — it stays on your device." },
  ],
};

export const fontPairingContent: ToolContentData = {
  about: `
<p>Compare heading and body fonts in text and card previews. Choose Google Fonts or upload .woff2, .ttf, or .otf files, then export CSS or Tailwind configuration. Uploaded fonts stay local; Google Fonts previews request fonts from Google.</p>
  `,
  faqs: [
    { q: "Can I upload my own fonts?", a: "Yes. Click 'Upload custom font' in either the heading or body font picker. The tool accepts .woff2, .ttf, and .otf files and loads them locally through the browser's FontFace API." },
    { q: "How many Google Fonts are available?", a: "Over 30 Google Fonts are included across four categories: Sans Serif, Serif, Monospace, and Display. Fonts load on demand." },
    { q: "What export formats are supported?", a: "You can export your font pairing as CSS custom properties (with font-family variables and selectors) or as a Tailwind CSS config object ready to paste into your project." },
    { q: "What makes a good font pairing?", a: "Compare the fonts at the sizes you plan to use. Check body-text readability, the distinction between heading and body styles, and support for the characters your content needs." },
  ],
};

export const svgToCssContent: ToolContentData = {
  about: `
<p>Convert SVG markup into a CSS background-image data URI. Paste or upload an SVG, choose compact or full URI encoding, and copy the CSS. Encoding runs in your browser.</p>
  `,
  faqs: [
    { q: "What's the difference between mini and full encoding?", a: "Mini encoding uses a specialized SVG data URI encoder to produce compact, modern-browser-safe output. Full URI encoding (encodeURIComponent) escapes more characters for maximum compatibility with older tools and email clients." },
    { q: "Why use a data URI instead of an external SVG file?", a: "Data URIs eliminate an extra HTTP request, which can improve performance for small icons and decorative elements. They're also useful when you can't host files separately, like in some CMS environments or email templates." },
    { q: "Is there a size limit for SVG data URIs?", a: "Browsers support data URIs up to at least 2 MB. However, for SVGs larger than a few KB, consider using an external file or an inline <svg> element instead for better performance." },
    { q: "Is my SVG sent to a server?", a: "No. The tool encodes and previews your SVG locally in the browser instead of uploading it." },
  ],
};

export const metaPreviewContent: ToolContentData = {
  about: `
<p>Preview a page title, description, URL, and image in Google, Twitter/X, and Slack layouts. Copy the generated Open Graph and Twitter Card meta tags. Inputs are processed locally; platform previews may differ from the examples.</p>
  `,
  faqs: [
    { q: "What are Open Graph meta tags?", a: "Open Graph (OG) tags are HTML meta tags that control how your page appears when shared on social media platforms like Facebook, LinkedIn, and Slack. They define the title, description, image, and URL shown in link previews." },
    { q: "What size should my OG image be?", a: "The recommended size is 1200×630 pixels (1.91:1 aspect ratio). This works well across all major platforms. Use PNG or JPG format for best compatibility." },
    { q: "Do I need separate Twitter Card tags?", a: "Not always. Twitter/X will fall back to Open Graph tags if no twitter: specific tags are present. However, adding twitter:card, twitter:title, and twitter:image gives you more control over the Twitter preview." },
    { q: "Are my preview inputs sent to a server?", a: "No. The tool renders the title, description, URL, and image preview locally in your browser." },
  ],
};

export const aspectRatioContent: ToolContentData = {
  about: `
<p>Simplify width-to-height ratios, calculate missing dimensions, and copy CSS <code>aspect-ratio</code> values. Use a preset such as 16:9 or enter your own dimensions. Calculations run locally.</p>
  `,
  faqs: [
    { q: "What is an aspect ratio?", a: "An aspect ratio is the proportional relationship between width and height, written like 16:9 or 4:3. It describes shape, not absolute size." },
    { q: "How does simplification work?", a: "The calculator divides width and height by their greatest common divisor (GCD), reducing values like 1920×1080 to 16:9 while preserving the same proportions." },
    { q: "How do I calculate a missing width or height?", a: "Set your target ratio first, then enter either known width or known height. The tool computes the missing side using the selected ratio." },
    { q: "How do I use the CSS output?", a: "Copy the generated snippet, for example <code>aspect-ratio: 16 / 9;</code>, and apply it to any block element in modern browsers to lock its proportions." },
  ],
};

export const spacingCalcContent: ToolContentData = {
  about: `
<p>Generate spacing values using a linear or geometric scale. Set the base unit, ratio, and number of steps, or load a Material, Tailwind, or Bootstrap preset. Export CSS custom properties or Tailwind configuration in px or rem.</p>
  `,
  faqs: [
    { q: "What's the difference between linear and geometric scales?", a: "Linear scales grow by a fixed amount (e.g. 4, 8, 12, 16). Geometric scales grow by a ratio (e.g. 4, 6.5, 10.5, 17), creating more contrast between small and large values." },
    { q: "Which preset should I use?", a: "Choose a preset that matches your project: Material uses a 4px grid, Tailwind and Bootstrap use their framework spacing values, and Golden Ratio uses a geometric progression." },
    { q: "What export formats are available?", a: "You can export as CSS custom properties (--space-1, --space-2, etc.) or as a Tailwind CSS spacing config object ready to paste into tailwind.config.js." },
    { q: "Are my scale settings uploaded?", a: "No. The tool calculates spacing values locally in your browser." },
  ],
};

export const colorBlindnessContent: ToolContentData = {
  about: `
<p>Compare colors, images, and screenshots under simulated color vision deficiencies. Select a simulation to compare it with the original, and use the Contrast Checker to measure text contrast. Image processing stays in your browser.</p>
  `,
  faqs: [
    { q: "What types of color blindness does this simulate?", a: "Eight types: Protanopia (no red), Deuteranopia (no green), Tritanopia (no blue), Achromatopsia (total color blindness), plus the partial variants Protanomaly, Deuteranomaly, and Tritanomaly." },
    { q: "How accurate are the simulations?", a: "The tool uses Brettel/Viénot color transformation matrices, which are the industry standard for CVD simulation. They provide a close approximation of how colors appear to people with each condition." },
    { q: "How do I test a website?", a: "Capture a screenshot of the page, then upload it in the Image / Screenshot tab. This works even when a site blocks iframe embedding and keeps the screenshot processing local to your browser." },
    { q: "Is my data sent to a server?", a: "No. Uploaded images, screenshots, and color values are processed locally by the tool in your browser." },
  ],
};

export const tailwindColorFinderContent: ToolContentData = {
  about: `
<p>Find the nearest Tailwind CSS v3 colors for HEX or RGB input. Compare five matches, copy background, text, or border classes, or match up to 20 colors in batch mode. The palette browser includes 22 color families with 11 shades each.</p>
  `,
  faqs: [
    { q: "What color formats are supported?", a: "HEX (#3B82F6 or 3B82F6), shorthand HEX (#38f), and RGB (rgb(59, 130, 246)) are all supported." },
    { q: "How is similarity calculated?", a: "The tool uses a weighted Euclidean distance formula that accounts for how human eyes perceive color differences — red and blue channels are weighted differently based on the mean red value, which is more accurate than simple RGB distance." },
    { q: "Can I match multiple colors at once?", a: "Yes — use Batch Mode to paste up to 20 colors (one per line or comma-separated) and get all nearest Tailwind matches at once." },
    { q: "Which Tailwind version is used?", a: "The palette matches Tailwind CSS v3's default color palette, which includes 22 color families with 11 shades each (50–950)." },
  ],
};

export const pxRemContent: ToolContentData = {
  about: `
<p>Convert between px and rem using a configurable root font size. Convert individual values or up to 50 values in a batch, and copy the results. Calculations run in your browser.</p>
  `,
  faqs: [
    { q: "What is rem?", a: "rem stands for 'root em' — it's a CSS unit relative to the root element's font size (usually 16 px by default). Using rem makes your layouts scale consistently when users change their browser font size." },
    { q: "Why use rem instead of px?", a: "rem units respect user accessibility settings. If a user increases their browser's default font size, rem-based layouts scale proportionally, while px values stay fixed." },
    { q: "How do I change the base font size?", a: "Use the 'Base font size' input at the top. This represents your root element's font-size in pixels. Changing it recalculates all conversions." },
    { q: "Can I convert multiple values at once?", a: "Yes — switch to the Batch Convert tab, paste up to 50 values (comma or newline separated), and get all results in a table with a Copy All button." },
  ],
};

export const glassmorphismContent: ToolContentData = {
  about: `
<p>Create a frosted-glass effect with CSS backdrop-filter. Adjust blur, saturation, transparency, borders, and shadows, then copy the generated CSS. The preview shows the effect over a background.</p>
  `,
  faqs: [
    { q: "What is glassmorphism?", a: "Glassmorphism is a UI design trend that creates a frosted-glass appearance using semi-transparent backgrounds, backdrop blur, and subtle borders. It creates depth by letting background content show through with a soft, blurred effect." },
    { q: "Does backdrop-filter work in all browsers?", a: "backdrop-filter is supported in all modern browsers including Chrome, Firefox, Safari, and Edge. The generated CSS includes the -webkit- prefix for maximum compatibility." },
    { q: "Can I use dark colors for the glass effect?", a: "Yes — use the Dark Glass preset or set the background color to a dark value. Dark glassmorphism works especially well on light or colorful backgrounds." },
    { q: "What does the saturation slider do?", a: "The saturation value in backdrop-filter boosts or normalizes the color intensity of the content behind the glass. Values above 100% make background colors appear more vivid through the glass." },
  ],
};

export const neumorphismContent: ToolContentData = {
  about: `
<p>Create raised or inset surfaces using paired CSS shadows. Adjust light direction, distance, blur, spread, size, radius, and colors, then copy the CSS.</p>
  `,
  faqs: [
    { q: "What is neumorphism in UI design?", a: "Neumorphism is a style that uses two opposing shadows on similarly colored surfaces to create soft depth. Raised elements look lifted from the background, while pressed elements look carved in." },
    { q: "How do raised and pressed modes differ?", a: "Raised mode uses outer shadows to make the element appear elevated. Pressed mode uses inset shadows to create a recessed effect, useful for toggles and input surfaces." },
    { q: "What controls affect the look the most?", a: "Direction and distance set the virtual light source, blur controls softness, and intensity controls shadow strength. Radius, spread, and size then shape the final component silhouette." },
    { q: "Can I use custom colors for shadows?", a: "Yes. You can set separate colors for the surface, background, light shadow, and dark shadow." },
  ],
};

export const loremIpsumContent: ToolContentData = {
  about: `
<p>Generate placeholder paragraphs, sentences, or words. Choose Classic Latin, Hipster, Pirate, Corporate, Space, or Foodie vocabulary, set the amount, and copy the output. Text generation runs locally.</p>
  `,
  faqs: [
    { q: "What text styles are available?", a: "Six styles: Classic (traditional Lorem Ipsum vocabulary), Hipster (artisan coffee culture), Pirate (nautical adventure), Corporate (business jargon), Space (cosmic exploration), and Foodie (culinary terms)." },
    { q: "Can I control the output length?", a: "Yes — choose between paragraphs (1–10), sentences (1–30), or words (1–200) and set the exact count with a slider." },
    { q: "Is the text truly random?", a: "The generator uses a seeded pseudo-random algorithm. Each regeneration produces different results, but you'll get consistent output for the same seed — useful for reproducible mockups." },
    { q: "Can I use this text in production?", a: "This text is meant for placeholder/mockup purposes only. It's grammatically random and shouldn't be used as real content." },
  ],
};

export const flexboxContent: ToolContentData = {
  about: `
<p>Configure Flexbox direction, alignment, wrapping, and gap. Inspect the layout in the preview, then copy the CSS.</p>
  `,
  faqs: [
    { q: "When should I use Flexbox?", a: "Use Flexbox for one-dimensional layouts where content flows in a row or column, such as toolbars, navs, and list rows." },
    { q: "What does justify-content control?", a: "It controls how items are distributed along the main axis (row or column direction)." },
    { q: "What does align-items control?", a: "It controls item alignment along the cross axis, perpendicular to the main flow." },
  ],
};

export const gridContent: ToolContentData = {
  about: `
<p>Set CSS Grid columns, rows, gaps, and alignment. Preview the layout and copy the generated CSS.</p>
  `,
  faqs: [
    { q: "When should I use Grid instead of Flexbox?", a: "Use Grid for two-dimensional layouts where both rows and columns matter. Use Flexbox for one-dimensional flows." },
    { q: "Can I create responsive layouts with this output?", a: "Yes. Use the generated template as a base and add media queries or auto-fit/auto-fill as needed." },
    { q: "Does this support uneven column sizes?", a: "You can start with equal columns and then edit the copied template to custom fractions and fixed tracks." },
  ],
};

export const borderRadiusContent: ToolContentData = {
  about: `
<p>Set each corner radius separately or load a preset. Preview the shape and copy the CSS border-radius declaration.</p>
  `,
  faqs: [
    { q: "Can I set each corner separately?", a: "Yes. Top-left, top-right, bottom-right, and bottom-left are controlled independently." },
    { q: "Is the output standard CSS?", a: "Yes. The generated border-radius declaration works in modern browsers." },
    { q: "What if I need elliptical radii?", a: "Use this as a base, then extend the output with the slash syntax for elliptical corners if needed." },
  ],
};

export const clampContent: ToolContentData = {
  about: `
<p>Calculate a CSS <code>clamp()</code> expression from minimum and maximum values and a viewport range. Choose px or rem output for fluid font sizes, spacing, or dimensions.</p>
  `,
  faqs: [
    { q: "What is clamp() used for?", a: "clamp() sets a minimum, preferred fluid value, and maximum in one expression for responsive CSS." },
    { q: "Can I use rem output?", a: "Yes. Switch the unit to rem to align with accessibility-friendly sizing systems." },
    { q: "What are min and max viewport values?", a: "They define the screen-width range where fluid scaling happens." },
  ],
};

export const imageColorPickerContent: ToolContentData = {
  about: `
<p>Sample a pixel color from an uploaded image or extract a palette of frequent colors. Copy HEX values from the results. Image processing stays in your browser.</p>
  `,
  faqs: [
    { q: "Is my image uploaded to a server?", a: "No. All image processing happens in your browser." },
    { q: "How is the dominant palette generated?", a: "The tool samples image pixels, groups nearby colors, and returns the most frequent swatches." },
    { q: "How do I copy a sampled color?", a: "Yes. Click any palette swatch or picked result to copy its HEX value." },
  ],
};

export const colorConverterContent: ToolContentData = {
  about: `
<p>Convert colors between HEX, RGB, and HSL. Edit a value to update the other formats, preview the color, and copy each result.</p>
  `,
  faqs: [
    { q: "Which formats are supported?", a: "HEX, RGB, and HSL are supported." },
    { q: "Does the converter validate input?", a: "Yes. Invalid values show an error." },
    { q: "Can I copy each format independently?", a: "Yes. Each field includes a one-click copy action." },
  ],
};

export const svgToPngContent: ToolContentData = {
  about: `
<p>Convert pasted or uploaded SVG markup to PNG. Set the output dimensions and download the image. Rendering and export run in your browser.</p>
  `,
  faqs: [
    { q: "Can I choose the PNG size?", a: "Yes. Set output width and height before downloading." },
    { q: "Does this work with pasted SVG code?", a: "Yes. You can paste raw SVG markup directly into the editor." },
    { q: "Is conversion done client-side?", a: "Yes. SVG rendering and PNG export happen locally in your browser." },
  ],
};

export const svgBlobPatternContent: ToolContentData = {
  about: `
<p>Generate SVG blobs or repeating patterns. Adjust colors, shape, and spacing, then copy the markup or download an SVG file.</p>
  `,
  faqs: [
    { q: "What can I generate with this tool?", a: "You can generate organic blob shapes and tile-based SVG patterns." },
    { q: "Can I edit colors and density?", a: "Yes. Both modes include controls for colors and structural properties like size, points, and spacing." },
    { q: "Can I export the generated SVG?", a: "Yes. Copy raw SVG code or download the file directly." },
  ],
};

export const jsonFormatterContent: ToolContentData = {
  about: `
<p>Format JSON with two or four spaces, minify it, or check its syntax. Invalid input shows a parse error; valid output can be copied.</p>
  `,
  faqs: [
    { q: "Can I pretty-print JSON with custom spacing?", a: "Yes. The formatter supports both 2-space and 4-space formatting presets." },
    { q: "Can I minify JSON for transport?", a: "Yes. Minify removes whitespace while preserving data structure." },
    { q: "Does this validate JSON syntax?", a: "Yes. The validator highlights parse failures and confirms valid payloads." },
  ],
};

export const base64Content: ToolContentData = {
  about: `
<p>Encode UTF-8 text as Base64 or decode Base64 back to text. Invalid input shows an error. Encoding and decoding run in your browser.</p>
  `,
  faqs: [
    { q: "Does this support UTF-8 text?", a: "Yes. The encoder/decoder handles UTF-8 content, including non-ASCII text." },
    { q: "What happens with invalid Base64 input?", a: "The decoder returns an error so you can correct malformed input." },
    { q: "Is anything sent to a server?", a: "No. Encoding and decoding run entirely in your browser." },
  ],
};

export const urlEncoderContent: ToolContentData = {
  about: `
<p>Encode text for URL components or decode percent-encoded input. Invalid encoded sequences show an error.</p>
  `,
  faqs: [
    { q: "What does URL encoding do?", a: "It escapes reserved characters so text can be transmitted safely in URLs." },
    { q: "Can this decode already encoded strings?", a: "Yes. Switch to decode mode and paste the encoded value." },
    { q: "Will malformed input throw errors?", a: "Yes. Invalid encoded sequences are reported so you can fix them." },
  ],
};

export const uuidContent: ToolContentData = {
  about: `
<p>Generate one or more UUID v4 identifiers. Copy individual IDs or the full list.</p>
  `,
  faqs: [
    { q: "What UUID version does this generate?", a: "This tool generates UUID v4 values." },
    { q: "Can I generate multiple IDs at once?", a: "Yes. Set a count and generate bulk UUIDs in one action." },
    { q: "Can I copy all IDs at once?", a: "Yes. Use the Copy All action to export the full list." },
  ],
};

export const regexTesterContent: ToolContentData = {
  about: `
<p>Test JavaScript regular expressions with configurable flags. Inspect matches and groups, then preview replacement text. Processing runs in your browser.</p>
  `,
  faqs: [
    { q: "Which regex flavor does this tool use?", a: "This tool uses JavaScript regular expressions (ECMAScript), matching browser behavior." },
    { q: "Can I test replacement patterns like $1 and $&?", a: "Yes. Replacement output supports standard JavaScript replacement tokens such as $&, $1, and $2." },
    { q: "What happens if my pattern is invalid?", a: "The tool surfaces the regex compilation error immediately so you can correct the pattern or flags." },
  ],
};

export const jwtDecoderContent: ToolContentData = {
  about: `
<p>Decode JWT headers and payloads and inspect <code>exp</code>, <code>iat</code>, and <code>nbf</code> timestamps. Tokens stay in your browser. Decoding does not verify the signature.</p>
  `,
  faqs: [
    { q: "Does this tool verify JWT signatures?", a: "No. It only decodes and inspects token content. Signature verification must be done by your backend or auth service." },
    { q: "Can it decode Base64URL tokens with Unicode payloads?", a: "Yes. The decoder handles Base64URL sections and UTF-8 content in header and payload." },
    { q: "Are tokens uploaded anywhere?", a: "No. Decoding is performed entirely in your browser." },
  ],
};

export const hashGeneratorContent: ToolContentData = {
  about: `
<p>Hash text with MD5, SHA-1, SHA-256, or SHA-512. Copy the hexadecimal or Base64 result. Computation runs in your browser.</p>
  `,
  faqs: [
    { q: "Which hash algorithms are supported?", a: "The tool supports MD5, SHA-1, SHA-256, and SHA-512." },
    { q: "Can I copy hashes in multiple formats?", a: "Yes. You can copy either HEX output or Base64 output independently." },
    { q: "Is this suitable for password storage?", a: "No. For password storage, use dedicated password hashing algorithms like Argon2, scrypt, or bcrypt on the server." },
  ],
};

export const unixTimestampContent: ToolContentData = {
  about: `
<p>Convert Unix timestamps in seconds or milliseconds to local, UTC, and ISO date-time values. Convert local date-time input back to epoch values.</p>
  `,
  faqs: [
    { q: "Does this support both seconds and milliseconds?", a: "Yes. Switch modes to interpret timestamp input as seconds or milliseconds." },
    { q: "Which timezone is used for date-time input?", a: "The date-time input uses your local browser timezone; UTC and ISO output are shown alongside local output." },
    { q: "How do I copy converted values?", a: "Yes. Epoch seconds and milliseconds from date-time input can be copied with one click." },
  ],
};

export const cronBuilderContent: ToolContentData = {
  about: `
<p>Build and validate five-field cron expressions. Review the schedule summary and upcoming run times in your local timezone, with UTC values for reference.</p>
  `,
  faqs: [
    { q: "Which cron format does this tool support?", a: "This builder supports standard 5-field cron expressions: minute, hour, day-of-month, month, day-of-week." },
    { q: "Can I use ranges, lists, and step syntax?", a: "Yes. You can use ranges (1-5), lists (1,3,5), and step patterns like */15." },
    { q: "How is validation computed?", a: "Validation and next-run previews use a parser-based cron engine running locally in your browser session." },
    { q: "Are next-run previews shown in UTC?", a: "Next-run previews are shown in your local timezone, and each row also includes ISO UTC output for reference." },
  ],
};

export const imageCompressorContent: ToolContentData = {
  about: `
<p>Compress images as JPEG or WebP with quality and maximum-width controls. Processing stays in your browser.</p>
  `,
  faqs: [
    { q: "Which formats are supported?", a: "You can upload common image formats and export compressed JPEG or WebP output." },
    { q: "Does this resize images too?", a: "Yes. Set a max width and the tool will scale down images while preserving aspect ratio." },
    { q: "Are files uploaded to a server?", a: "No. Compression runs entirely client-side in your browser." },
  ],
};

export const imageFormatConverterContent: ToolContentData = {
  about: `
<p>Convert images between PNG, JPEG, and WebP. Adjust JPEG or WebP quality, then download the result. Processing stays in your browser.</p>
  `,
  faqs: [
    { q: "Can this convert transparency to JPEG?", a: "Yes. Transparent regions are flattened against a white background when exporting JPEG." },
    { q: "Can I choose output quality?", a: "Yes. Quality controls are applied for JPEG and WebP exports." },
    { q: "Does conversion happen locally?", a: "Yes. No file data is sent to a backend service." },
  ],
};

export const imageResizerCropperContent: ToolContentData = {
  about: `
<p>Resize images to specified dimensions and apply a centered crop using an aspect-ratio preset. Keep the original proportions when changing dimensions, then download PNG output.</p>
  `,
  faqs: [
    { q: "What crop behavior is used?", a: "Aspect presets apply a centered crop before resizing to your target dimensions." },
    { q: "Can I keep the original ratio while typing dimensions?", a: "Yes. The maintain-ratio toggle updates the opposite dimension automatically." },
    { q: "What resize engine is used?", a: "Resampling uses pica in-browser for higher-quality downsizing than a basic canvas draw pass." },
    { q: "What format does it export?", a: "Current export uses PNG for predictable output quality." },
  ],
};

export const svgOptimizerContent: ToolContentData = {
  about: `
<p>Reduce SVG markup with SVGO. Select cleanup options, compare file sizes, and copy or download the result.</p>
  `,
  faqs: [
    { q: "Does this change visual output?", a: "It targets non-visual markup and whitespace only, so appearance should stay the same in standard cases." },
    { q: "Can I copy or download optimized SVG?", a: "Yes. Both copy and .svg download actions are included." },
    { q: "Is this equivalent to full SVGO pipelines?", a: "It uses SVGO locally with configurable cleanup toggles, but not every advanced CI pipeline option is exposed in the UI." },
  ],
};

export const svgToReactContent: ToolContentData = {
  about: `
<p>Convert SVG markup to a React component with SVGR. Set the component name, choose JSX or TSX, and copy the output.</p>
  `,
  faqs: [
    { q: "Are SVG attributes converted for JSX?", a: "Yes. SVGR handles JSX-safe attribute conversion during transform." },
    { q: "Can I output TypeScript components?", a: "Yes. Toggle between TSX and JSX output modes." },
    { q: "Does this validate SVG input?", a: "Yes. Invalid XML/SVG input returns an error message before conversion." },
  ],
};

export const imageBase64Content: ToolContentData = {
  about: `
<p>Encode images as Base64 data URIs or decode Base64 into an image file. Preview the result before copying or downloading. Processing stays in your browser.</p>
  `,
  faqs: [
    { q: "Can I paste plain Base64 without the data: prefix?", a: "Yes. Plain Base64 is normalized to a PNG data URI for preview and decoding." },
    { q: "Can I preview decoded output?", a: "Yes. The tool renders a live preview from the current Base64 value." },
    { q: "Is conversion private?", a: "Yes. All encoding/decoding is performed in-browser." },
  ],
};

export const codeFormatterMinifierContent: ToolContentData = {
  about: `
<p>Format or minify HTML, CSS, and JavaScript. Code is processed locally and the output can be copied.</p>
  `,
  faqs: [
    { q: "Which languages are supported?", a: "HTML, CSS, and JavaScript are supported in both format and minify modes." },
    { q: "What engines are used?", a: "Formatting uses Prettier parsers. Minification uses Terser for JavaScript, CSSO for CSS, and minify-html/wasm for HTML." },
    { q: "How do I copy the output?", a: "Yes. Output can be copied with a single click." },
  ],
};

export const cssAnimationContent: ToolContentData = {
  about: `
<p>Generate CSS keyframes from animation presets. Adjust duration, delay, easing, fill mode, and iteration count, then preview and copy the CSS.</p>
  `,
  faqs: [
    { q: "Can I copy full keyframes and class CSS?", a: "Yes. The output includes keyframes and an example animated class." },
    { q: "Does it support infinite loops?", a: "Yes. Set iteration count to infinite." },
    { q: "Can I change easing curves?", a: "Yes. Choose common timing functions like ease-in-out and linear." },
  ],
};

export const clipPathBezierContent: ToolContentData = {
  about: `
<p>Choose a polygon clip-path preset and adjust cubic-bezier control points. Preview the shape and transition, then copy the CSS.</p>
  `,
  faqs: [
    { q: "What shapes are available?", a: "The editor includes multiple polygon presets such as diamond, hexagon, triangle, and arrow." },
    { q: "What does cubic-bezier control here?", a: "It controls transition acceleration and deceleration for hover/motion effects." },
    { q: "How do I use the CSS output?", a: "Copy the generated CSS into your stylesheet and apply it to the element you want to style." },
  ],
};

export const textUtilitiesContent: ToolContentData = {
  about: `
<p>Convert text case, generate a URL slug, and count words, characters, and lines. Copy each result separately.</p>
  `,
  faqs: [
    { q: "Which case conversions are included?", a: "Lowercase, uppercase, title case, sentence case, camelCase, PascalCase, snake_case, and kebab-case." },
    { q: "Does it include slug generation?", a: "Yes. It outputs a normalized, URL-safe slug from your input." },
    { q: "What counters are available?", a: "Word count, character count, non-space character count, and line count are shown." },
  ],
};
