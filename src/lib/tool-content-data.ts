import type { FAQ } from "@/components/ToolContent";

interface ToolContentData {
  about: string;
  faqs: FAQ[];
}

export const paletteContent: ToolContentData = {
  about: `
<p>Minerva's Color Palette Generator helps designers and developers create harmonious color schemes in seconds. Whether you're starting a new project or refreshing an existing brand, this tool generates five-color palettes using proven color theory harmony modes.</p>
<p>Choose from six harmony algorithms — random, analogous, complementary, triadic, split-complementary, and monochromatic — each producing palettes that work together naturally. Lock any color you like and regenerate the rest until you find the perfect combination.</p>
<p>Every palette includes WCAG contrast analysis so you can verify accessibility before committing to your design. Copy colors in HEX, RGB, or HSL format, ready to paste directly into your code or design tool. Everything runs client-side with zero data sent to any server.</p>
  `,
  faqs: [
    { q: "What color harmony modes are available?", a: "The generator supports six modes: Random, Analogous, Complementary, Triadic, Split-Complementary, and Monochromatic. Each uses a different relationship on the color wheel to produce naturally harmonious results." },
    { q: "Can I lock specific colors while regenerating?", a: "Yes. Click the lock icon on any swatch to keep it fixed. When you regenerate, only the unlocked colors will change — perfect for building around a brand color." },
    { q: "Does this check color accessibility?", a: "The built-in contrast checker analyzes every foreground/background pair against WCAG 2.1 AA and AAA standards, so you can verify readability before using the palette." },
    { q: "What formats can I copy colors in?", a: "You can copy each color as HEX (#1e293b), RGB (rgb(30, 41, 59)), or HSL (hsl(215, 33%, 17%)). All values are calculated client-side." },
  ],
};

export const gradientContent: ToolContentData = {
  about: `
<p>The CSS Gradient Generator lets you visually build beautiful linear, radial, and conic gradients without writing CSS by hand. Add, remove, and reposition color stops with a live preview that updates instantly.</p>
<p>Fine-tune every aspect of your gradient — angle for linear gradients, position for radial gradients, and rotation for conic gradients. Use the built-in presets as starting points or create something entirely custom with up to eight color stops.</p>
<p>When you're happy with the result, copy the generated CSS with one click. The output is clean, standards-compliant CSS that works in all modern browsers. No sign-up, no watermarks — just fast, free gradient creation.</p>
  `,
  faqs: [
    { q: "What gradient types are supported?", a: "Linear, radial, and conic gradients are all supported. Switch between them and the CSS output updates automatically." },
    { q: "How many color stops can I add?", a: "You can add up to eight color stops per gradient. Each stop has adjustable color and position values." },
    { q: "Can I use the generated CSS directly?", a: "Yes — the output is valid CSS that works in all modern browsers. Just copy and paste it into your stylesheet." },
    { q: "Are there preset gradients I can start from?", a: "Yes, the tool includes several curated presets like Sunset, Ocean, Aurora, and more. Click any preset to load it, then customize from there." },
  ],
};

export const contrastContent: ToolContentData = {
  about: `
<p>The Color Contrast Checker verifies whether your text and background color combinations meet WCAG 2.1 accessibility standards. Enter any two HEX colors and instantly see the contrast ratio along with pass/fail results for AA and AAA compliance at both normal and large text sizes.</p>
<p>Accessible color contrast isn't just a best practice — it's essential for users with low vision, color blindness, or those viewing screens in bright sunlight. WCAG AA requires a minimum 4.5:1 ratio for normal text and 3:1 for large text. AAA raises those thresholds to 7:1 and 4.5:1 respectively.</p>
<p>The live preview shows your color pairing in real-world UI contexts — headings, body text, buttons, and cards — so you can judge readability before committing. Swap foreground and background with one click, and copy the full contrast result for documentation.</p>
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
<p>Minerva's QR Code Generator creates high-quality, customizable QR codes for URLs, plain text, WiFi credentials, email addresses, and phone numbers. QR content and uploaded logos are processed in your browser rather than uploaded by the tool.</p>
<p>Customize the appearance with foreground and background colors, adjust error correction levels, and add your own logo or image to the center. Choose from multiple pattern styles to match your brand, and preview the result in real time before downloading.</p>
<p>Download your finished QR code as a high-resolution PNG or scalable SVG. Whether you're creating codes for business cards, product packaging, or marketing materials, this tool gives you full control over the output with zero cost and zero sign-up.</p>
  `,
  faqs: [
    { q: "What content types can I encode?", a: "The generator supports URLs, plain text, WiFi network credentials (SSID, password, encryption type), email addresses (with optional subject/body), and phone numbers." },
    { q: "Can I add a logo to the QR code?", a: "Yes. Upload any image (PNG, JPG, or SVG) to place it in the center of your QR code. The error correction level adjusts automatically to ensure the code remains scannable." },
    { q: "What's the difference between PNG and SVG download?", a: "PNG is a raster format best for digital use at a specific size. SVG is a vector format that scales to any size without quality loss — ideal for print materials." },
    { q: "Is my QR code content sent to a server?", a: "No. The tool generates the code in your browser and does not upload the content or logo you provide." },
  ],
};

export const boxShadowContent: ToolContentData = {
  about: `
<p>The CSS Box Shadow Generator provides a visual editor for designing complex, multi-layer box shadows. Instead of guessing pixel values in code, adjust sliders for offset, blur, spread, color, and opacity and see the result update live.</p>
<p>Stack up to eight shadow layers to create depth effects ranging from subtle elevation to dramatic neumorphic designs. Each layer can be independently configured with inset mode for inner shadows. Eight built-in presets — Subtle, Elevated, Sharp, Dreamy, Neumorphic, Layered, Colorful, and Deep — provide professional starting points.</p>
<p>When you're satisfied, copy the generated CSS with one click. The output is clean, browser-compatible CSS ready to paste into any project. No accounts, no downloads — just fast shadow design in your browser.</p>
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
<p>The Typography Scale Generator creates harmonious type hierarchies using modular scale ratios. Choose a base font size and a mathematical ratio — from Minor Second (1.067) to Golden Ratio (1.618) — and the tool calculates a complete set of font sizes that relate to each other proportionally.</p>
<p>Preview your scale with 30+ Google Fonts across four categories: Sans Serif, Serif, Monospace, and Display. See heading and body text rendered at the exact sizes your scale produces, so you can evaluate readability and visual rhythm before implementing.</p>
<p>Export your scale as CSS custom properties or Tailwind CSS configuration. Four built-in presets — UI, Editorial, Marketing, and Compact — provide tuned starting points for common use cases. Everything runs client-side with instant updates as you adjust parameters.</p>
  `,
  faqs: [
    { q: "What is a modular type scale?", a: "A modular scale uses a consistent mathematical ratio to generate font sizes. Starting from a base size, each step multiplies by the ratio — creating sizes that feel visually harmonious because they share the same proportional relationship." },
    { q: "Which ratio should I choose?", a: "For UI and app design, smaller ratios like Major Second (1.125) or Minor Third (1.2) work well. For editorial or marketing pages where headings need more impact, try Perfect Fourth (1.333) or Golden Ratio (1.618)." },
    { q: "Can I export the scale for Tailwind CSS?", a: "Yes. The export panel generates a ready-to-paste Tailwind config object with your calculated font sizes, or CSS custom properties for use in any project." },
    { q: "How many fonts are available for preview?", a: "Over 30 Google Fonts are available across Sans Serif, Serif, Monospace, and Display categories. The fonts load on demand for fast preview." },
  ],
};

export const faviconContent: ToolContentData = {
  about: `
<p>The Favicon Generator creates all the icon files modern browsers and platforms require — from a single image upload, a text letter, or an emoji. Instead of manually resizing and converting images, this tool handles the entire process in one step.</p>
<p>Three input modes give you flexibility: upload an existing image (PNG, JPG, or SVG), type a letter with custom font and colors, or pick an emoji. Adjust the background color, border radius, and padding to fine-tune the look across all generated sizes.</p>
<p>The output includes favicon.ico (with 16, 32, and 48px layers), individual PNGs for all standard sizes, an Apple Touch Icon (180×180), Android Chrome icons (192×192 and 512×512), a ready-to-use site.webmanifest file, and the HTML head snippet to tie it all together. Download individual files or grab everything as a single ZIP.</p>
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
<p>The Font Pairing Tool helps designers and developers find beautiful heading and body font combinations that work together. Choose from 30+ popular Google Fonts across Sans Serif, Serif, Monospace, and Display categories, or upload your own custom font files.</p>
<p>Preview your chosen pair in realistic layouts — hero sections, article pages, and UI cards — so you can evaluate readability and visual rhythm before committing. Eight curated presets like "Classic Editorial" and "Modern SaaS" provide professional starting points for common design contexts.</p>
<p>Upload custom fonts in .woff2, .ttf, or .otf format and they load locally through the browser's FontFace API. Uploaded font files are not sent by the tool; selecting a Google Font makes a separate request to Google Fonts. When you've found the right pair, export the configuration as CSS custom properties or Tailwind CSS config with one click.</p>
  `,
  faqs: [
    { q: "Can I upload my own fonts?", a: "Yes. Click 'Upload custom font' in either the heading or body font picker. The tool accepts .woff2, .ttf, and .otf files and loads them locally through the browser's FontFace API." },
    { q: "How many Google Fonts are available?", a: "Over 30 popular Google Fonts are included across four categories: Sans Serif, Serif, Monospace, and Display. Fonts load on demand for fast preview." },
    { q: "What export formats are supported?", a: "You can export your font pairing as CSS custom properties (with font-family variables and selectors) or as a Tailwind CSS config object ready to paste into your project." },
    { q: "What makes a good font pairing?", a: "Contrast is key — pair a distinctive heading font (like a serif or display face) with a clean, readable body font (like a sans-serif). The presets demonstrate proven combinations that balance personality with readability." },
  ],
};

export const svgToCssContent: ToolContentData = {
  about: `
<p>The SVG to CSS Converter turns SVG markup into a CSS background-image data URI you can paste directly into your stylesheet. Instead of hosting a separate image file, embed the SVG inline as a data URI — reducing HTTP requests and simplifying deployment.</p>
<p>Paste SVG code or upload an .svg file, and the tool instantly encodes it into a compact data URI with a live preview. Choose between mini-encoding (shorter output optimized for modern CSS) or full URI encoding (maximum compatibility). The generated CSS includes background-repeat, background-size, and background-position properties for a ready-to-use snippet.</p>
<p>SVG input and encoding stay in your browser rather than being uploaded by the tool. Drag-and-drop upload, one-click copy, and immediate feedback make it a focused way to inline SVGs in CSS.</p>
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
<p>The Meta Tag Preview tool shows you exactly how your page will appear when shared on Google, Twitter/X, and Slack — before you publish. Enter your title, description, URL, and OG image, and see live previews that match each platform's actual rendering.</p>
<p>Getting Open Graph and Twitter Card meta tags right is critical for click-through rates. A compelling title, concise description, and properly sized image can dramatically increase engagement when your content is shared on social media or appears in search results.</p>
<p>The tool also generates the complete set of meta tags you need — just copy and paste the HTML into your page's &lt;head&gt;. Preview inputs are handled locally rather than submitted by the tool.</p>
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
<p>The Aspect Ratio Calculator helps you simplify, convert, and scale width-to-height proportions for responsive layouts, media assets, and design specs. Enter any dimensions to reduce them to the cleanest ratio form instantly.</p>
<p>Use common presets like 16:9, 4:3, 1:1, and 9:16, then calculate missing dimensions from either width or height while preserving the selected ratio. This makes it easy to size videos, images, cards, embeds, and ad units consistently.</p>
<p>The tool also generates copy-ready CSS <code>aspect-ratio</code> values and decimal equivalents, so you can move directly from design to implementation. Dimension calculations happen locally in your browser.</p>
  `,
  faqs: [
    { q: "What is an aspect ratio?", a: "An aspect ratio is the proportional relationship between width and height, written like 16:9 or 4:3. It describes shape, not absolute size." },
    { q: "How does simplification work?", a: "The calculator divides width and height by their greatest common divisor (GCD), reducing values like 1920×1080 to 16:9 while preserving the same proportions." },
    { q: "How do I calculate a missing width or height?", a: "Set your target ratio first, then enter either known width or known height. The tool computes the missing side so the final dimensions stay perfectly proportional." },
    { q: "How do I use the CSS output?", a: "Copy the generated snippet, for example <code>aspect-ratio: 16 / 9;</code>, and apply it to any block element in modern browsers to lock its proportions." },
  ],
};

export const spacingCalcContent: ToolContentData = {
  about: `
<p>The Spacing Calculator generates consistent spacing scales for your design system. Start with a base unit and choose between linear progression (base × n) or geometric progression (base × ratio^n) to create a harmonious set of spacing values that work together.</p>
<p>Use built-in presets for popular systems like Material Design (4px grid), Tailwind CSS, and Bootstrap, or build a custom scale from scratch. The visual bar and box previews let you evaluate proportions at a glance before committing.</p>
<p>Export your scale as CSS custom properties or a Tailwind config object, ready to paste into your project. Toggle between px and rem output, and everything runs entirely in your browser.</p>
  `,
  faqs: [
    { q: "What's the difference between linear and geometric scales?", a: "Linear scales grow by a fixed amount (e.g. 4, 8, 12, 16). Geometric scales grow by a ratio (e.g. 4, 6.5, 10.5, 17), creating more contrast between small and large values — useful for expressive designs." },
    { q: "Which preset should I use?", a: "Material Design (4px grid) is the most popular for web and mobile apps. Tailwind Default matches the framework's built-in spacing. Bootstrap matches its spacing utilities. Golden Ratio creates a more dramatic, organic progression." },
    { q: "What export formats are available?", a: "You can export as CSS custom properties (--space-1, --space-2, etc.) or as a Tailwind CSS spacing config object ready to paste into tailwind.config.js." },
    { q: "Are my scale settings uploaded?", a: "No. The tool calculates spacing values locally in your browser." },
  ],
};

export const colorBlindnessContent: ToolContentData = {
  about: `
<p>The Color Blindness Simulator helps designers and developers understand how their work appears to people with color vision deficiency (CVD). Approximately 8% of males and 0.5% of females have some form of color blindness — making accessible color choices essential for inclusive design.</p>
<p>Test individual colors side-by-side or upload images and website screenshots to compare different CVD types. The tool supports protanopia, deuteranopia, tritanopia, achromatopsia, and their partial variants (anomalies).</p>
<p>Color and image simulations use established color transformation matrices (Brettel/Viénot) and run in your browser. For a reliable website test, capture a screenshot and upload it rather than depending on third-party iframe permissions. Use this alongside the Contrast Checker to evaluate accessible color choices.</p>
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
<p>The Tailwind Color Finder matches any HEX or RGB color to the nearest Tailwind CSS utility class. Paste a brand color and instantly see the closest Tailwind match with a similarity percentage — no more guessing which shade of blue-500 or indigo-600 is the best fit.</p>
<p>The tool ranks the top 5 nearest matches using a perceptually weighted color distance algorithm, so results feel accurate to the human eye. Copy class names in bg-, text-, or border- format with one click. Use batch mode to convert an entire color palette at once — perfect for migrating designs into Tailwind projects.</p>
<p>Browse the complete Tailwind v3 palette (22 hues × 11 shades = 242 colors) in the full palette view. Color matching and batch input are processed locally in your browser.</p>
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
<p>The px ↔ rem Converter is a simple, fast utility for switching between pixel and rem CSS units. Just type a value on either side and the conversion updates instantly — no buttons to click, no pages to reload.</p>
<p>Set any base font size (default 16 px) to match your project's root font size, and every conversion adjusts automatically. The quick-reference table shows common pixel values and their rem equivalents at a glance, with one-click copy for each row.</p>
<p>Need to convert a whole list? Use batch mode to paste up to 50 values at once and get all results in a table. Everything runs client-side — nothing is sent to any server.</p>
  `,
  faqs: [
    { q: "What is rem?", a: "rem stands for 'root em' — it's a CSS unit relative to the root element's font size (usually 16 px by default). Using rem makes your layouts scale consistently when users change their browser font size." },
    { q: "Why use rem instead of px?", a: "rem units respect user accessibility settings. If a user increases their browser's default font size, rem-based layouts scale proportionally, while px values stay fixed." },
    { q: "How do I change the base font size?", a: "Use the 'Base font size' input at the top. This represents your root element's font-size in pixels. All conversions recalculate instantly when you change it." },
    { q: "Can I convert multiple values at once?", a: "Yes — switch to the Batch Convert tab, paste up to 50 values (comma or newline separated), and get all results in a table with a Copy All button." },
  ],
};

export const glassmorphismContent: ToolContentData = {
  about: `
<p>The Glassmorphism Generator lets you visually build frosted-glass UI effects using CSS backdrop-filter. Adjust blur, transparency, border opacity, saturation, and shadow in real time with a live preview that shows exactly how your glass card will look.</p>
<p>Choose from six presets — Subtle, Frosted, Bold, Dark Glass, Colorful, and Minimal — as starting points, then fine-tune every parameter with sliders. The preview renders against a vibrant gradient background with decorative shapes so you can see how the glass effect interacts with content behind it.</p>
<p>When you're happy with the result, copy the generated CSS with one click. The output includes backdrop-filter, -webkit-backdrop-filter, border, border-radius, background with alpha, and box-shadow — ready to paste into any project. Everything runs client-side with zero data sent to any server.</p>
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
<p>The Neumorphism Generator helps you craft soft, tactile UI surfaces by balancing light and shadow. Use visual controls to shape raised cards or pressed controls, then copy production-ready CSS instantly.</p>
<p>Dial in the complete effect with controls for light direction, distance, blur, spread, radius, size, and intensity. Fine-tune background, surface, light-shadow, and dark-shadow colors to match your brand or design system.</p>
<p>Switch between raised and inset (pressed) modes, try built-in presets, and preview everything live. The generated CSS is clean and immediately usable in modern projects, and all processing stays client-side in your browser.</p>
  `,
  faqs: [
    { q: "What is neumorphism in UI design?", a: "Neumorphism is a style that uses two opposing shadows on similarly colored surfaces to create soft depth. Raised elements look lifted from the background, while pressed elements look carved in." },
    { q: "How do raised and pressed modes differ?", a: "Raised mode uses outer shadows to make the element appear elevated. Pressed mode uses inset shadows to create a recessed effect, useful for toggles and input surfaces." },
    { q: "What controls affect the look the most?", a: "Direction and distance set the virtual light source, blur controls softness, and intensity controls shadow strength. Radius, spread, and size then shape the final component silhouette." },
    { q: "Can I use custom colors for shadows?", a: "Yes. You can set separate colors for the surface, background, light shadow, and dark shadow. This makes it easy to create traditional neutral neumorphism or more colorful styles." },
  ],
};

export const loremIpsumContent: ToolContentData = {
  about: `
<p>The Lorem Ipsum Generator creates placeholder text for your designs and mockups. Choose from six fun styles — Classic Latin, Hipster, Pirate, Corporate Jargon, Space, and Foodie — to match the tone of your project or just have a laugh while prototyping.</p>
<p>Select paragraphs, sentences, or words as your output unit and dial in the exact amount with a slider. Hit Regenerate for fresh variations with the same settings. The word and character count updates in real time so you can hit exact content targets.</p>
<p>Copy the generated text with one click. Text generation and settings are processed locally in your browser.</p>
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
<p>The Flexbox Generator helps you build responsive one-dimensional layouts visually. Adjust direction, alignment, wrapping, and spacing while seeing the result in real time.</p>
<p>Once the layout looks right, copy the generated CSS and paste it directly into your project. It's ideal for nav bars, card rows, button groups, and flexible UI stacks.</p>
  `,
  faqs: [
    { q: "When should I use Flexbox?", a: "Use Flexbox for one-dimensional layouts where content flows in a row or column, such as toolbars, navs, and list rows." },
    { q: "What does justify-content control?", a: "It controls how items are distributed along the main axis (row or column direction)." },
    { q: "What does align-items control?", a: "It controls item alignment along the cross axis, perpendicular to the main flow." },
  ],
};

export const gridContent: ToolContentData = {
  about: `
<p>The Grid Generator creates CSS Grid layouts with visual controls for columns, rows, gap, and item alignment. It's a quick way to prototype dashboard and card-based layouts.</p>
<p>Use the live preview to validate spacing and structure before copying the output. The generated CSS is clean and ready for production use.</p>
  `,
  faqs: [
    { q: "When should I use Grid instead of Flexbox?", a: "Use Grid for two-dimensional layouts where both rows and columns matter. Use Flexbox for one-dimensional flows." },
    { q: "Can I create responsive layouts with this output?", a: "Yes. Use the generated template as a base and add media queries or auto-fit/auto-fill as needed." },
    { q: "Does this support uneven column sizes?", a: "You can start with equal columns and then edit the copied template to custom fractions and fixed tracks." },
  ],
};

export const borderRadiusContent: ToolContentData = {
  about: `
<p>The Border Radius Generator lets you shape each corner independently and preview the final surface instantly. This is useful for cards, badges, buttons, and decorative UI elements.</p>
<p>Use presets for fast iteration, then fine-tune each corner to get exactly the geometry your design system needs.</p>
  `,
  faqs: [
    { q: "Can I set each corner separately?", a: "Yes. Top-left, top-right, bottom-right, and bottom-left are controlled independently." },
    { q: "Is the output standard CSS?", a: "Yes. The generated border-radius declaration works in modern browsers." },
    { q: "What if I need elliptical radii?", a: "Use this as a base, then extend the output with the slash syntax for elliptical corners if needed." },
  ],
};

export const clampContent: ToolContentData = {
  about: `
<p>The Clamp Calculator generates fluid responsive values using CSS <code>clamp()</code>. Provide min/max values and a viewport range, then copy the computed expression.</p>
<p>This is especially useful for fluid typography, spacing, and sizing systems that scale smoothly between breakpoints.</p>
  `,
  faqs: [
    { q: "What is clamp() used for?", a: "clamp() sets a minimum, preferred fluid value, and maximum in one expression for responsive CSS." },
    { q: "Can I use rem output?", a: "Yes. Switch the unit to rem to align with accessibility-friendly sizing systems." },
    { q: "What are min and max viewport values?", a: "They define the screen-width range where fluid scaling happens." },
  ],
};

export const imageColorPickerContent: ToolContentData = {
  about: `
<p>The Image Color Picker extracts colors directly from uploaded images. Click any pixel to sample exact values and generate a dominant palette automatically.</p>
<p>This helps quickly derive brand palettes, UI accents, and theme tokens from screenshots, photography, and artwork.</p>
  `,
  faqs: [
    { q: "Is my image uploaded to a server?", a: "No. All image processing happens in your browser." },
    { q: "How is the dominant palette generated?", a: "The tool samples image pixels, groups nearby colors, and returns the most frequent swatches." },
    { q: "Can I copy sampled colors quickly?", a: "Yes. Click any palette swatch or picked result to copy its HEX value." },
  ],
};

export const colorConverterContent: ToolContentData = {
  about: `
<p>The Color Converter synchronizes HEX, RGB, and HSL formats in real time. Update any format and the others are recalculated instantly.</p>
<p>It's useful when moving between design tools, CSS code, token systems, and accessibility workflows.</p>
  `,
  faqs: [
    { q: "Which formats are supported?", a: "HEX, RGB, and HSL are supported with instant conversion between them." },
    { q: "Does the converter validate input?", a: "Yes. Invalid values surface an error so you can correct syntax quickly." },
    { q: "Can I copy each format independently?", a: "Yes. Each field includes a one-click copy action." },
  ],
};

export const svgToPngContent: ToolContentData = {
  about: `
<p>The SVG to PNG Converter transforms SVG markup into downloadable PNG images. Paste SVG code or upload a file, set output dimensions, and export instantly.</p>
<p>This is helpful when you need raster assets for app stores, social previews, docs, or platforms that do not accept SVG.</p>
  `,
  faqs: [
    { q: "Can I choose the PNG size?", a: "Yes. Set output width and height before downloading." },
    { q: "Does this work with pasted SVG code?", a: "Yes. You can paste raw SVG markup directly into the editor." },
    { q: "Is conversion done client-side?", a: "Yes. SVG rendering and PNG export happen locally in your browser." },
  ],
};

export const svgBlobPatternContent: ToolContentData = {
  about: `
<p>The SVG Blob & Pattern Generator creates reusable visual assets for hero sections, cards, and backgrounds. Switch between blob mode and repeating pattern mode with live preview.</p>
<p>Copy the generated SVG markup or download the asset as an SVG file for use in web and design workflows.</p>
  `,
  faqs: [
    { q: "What can I generate with this tool?", a: "You can generate organic blob shapes and tile-based SVG patterns." },
    { q: "Can I edit colors and density?", a: "Yes. Both modes include controls for colors and structural properties like size, points, and spacing." },
    { q: "Can I export the generated SVG?", a: "Yes. Copy raw SVG code or download the file directly." },
  ],
};

export const jsonFormatterContent: ToolContentData = {
  about: `
<p>The JSON Formatter & Validator helps you clean, validate, and minify JSON quickly. Paste your JSON and run formatting in one click.</p>
<p>When JSON is invalid, the tool shows parse errors so you can debug payloads and config files faster.</p>
  `,
  faqs: [
    { q: "Can I pretty-print JSON with custom spacing?", a: "Yes. The formatter supports both 2-space and 4-space formatting presets." },
    { q: "Can I minify JSON for transport?", a: "Yes. Minify removes whitespace while preserving data structure." },
    { q: "Does this validate JSON syntax?", a: "Yes. The validator highlights parse failures and confirms valid payloads." },
  ],
};

export const base64Content: ToolContentData = {
  about: `
<p>The Base64 Encoder/Decoder converts UTF-8 text to Base64 and decodes Base64 strings back to readable text. It is useful for APIs, debugging payloads, and quick transformations.</p>
<p>Switch modes instantly and copy output with one click.</p>
  `,
  faqs: [
    { q: "Does this support UTF-8 text?", a: "Yes. The encoder/decoder handles UTF-8 content, including non-ASCII text." },
    { q: "What happens with invalid Base64 input?", a: "The decoder returns an error so you can correct malformed input." },
    { q: "Is anything sent to a server?", a: "No. Encoding and decoding run entirely in your browser." },
  ],
};

export const urlEncoderContent: ToolContentData = {
  about: `
<p>The URL Encoder/Decoder safely converts text for use in query strings and URL components. Use encode mode to escape reserved characters and decode mode to restore readable text.</p>
<p>This is useful for debugging links, API integrations, and parameterized navigation flows.</p>
  `,
  faqs: [
    { q: "What does URL encoding do?", a: "It escapes reserved characters so text can be transmitted safely in URLs." },
    { q: "Can this decode already encoded strings?", a: "Yes. Switch to decode mode and paste the encoded value." },
    { q: "Will malformed input throw errors?", a: "Yes. Invalid encoded sequences are reported so you can fix them." },
  ],
};

export const uuidContent: ToolContentData = {
  about: `
<p>The UUID Generator creates RFC 4122-style version 4 identifiers instantly. Generate one or many UUIDs and copy them individually or in bulk.</p>
<p>It's ideal for local development, testing, and generating unique IDs for records and payloads.</p>
  `,
  faqs: [
    { q: "What UUID version does this generate?", a: "This tool generates UUID v4 values." },
    { q: "Can I generate multiple IDs at once?", a: "Yes. Set a count and generate bulk UUIDs in one action." },
    { q: "Can I copy all IDs at once?", a: "Yes. Use the Copy All action to export the full list." },
  ],
};

export const regexTesterContent: ToolContentData = {
  about: `
<p>The Regex Tester & Replacer helps you build and debug JavaScript regular expressions with immediate feedback. Enter a pattern and flags, inspect every match, and preview replacement output before updating code or data.</p>
<p>It's useful for log parsing, form validation, and text cleanup workflows where regex mistakes can be costly. Everything runs in your browser.</p>
  `,
  faqs: [
    { q: "Which regex flavor does this tool use?", a: "This tool uses JavaScript regular expressions (ECMAScript), matching browser behavior." },
    { q: "Can I test replacement patterns like $1 and $&?", a: "Yes. Replacement output supports standard JavaScript replacement tokens such as $&, $1, and $2." },
    { q: "What happens if my pattern is invalid?", a: "The tool surfaces the regex compilation error immediately so you can correct the pattern or flags." },
  ],
};

export const jwtDecoderContent: ToolContentData = {
  about: `
<p>The JWT Decoder & Inspector decodes token header and payload claims client-side, so you can inspect JWT content safely without sending tokens to a server.</p>
<p>Review common claims like <code>exp</code>, <code>iat</code>, and <code>nbf</code> with readable timestamps, and copy decoded JSON quickly during API debugging and auth integration work.</p>
  `,
  faqs: [
    { q: "Does this tool verify JWT signatures?", a: "No. It only decodes and inspects token content. Signature verification must be done by your backend or auth service." },
    { q: "Can it decode Base64URL tokens with Unicode payloads?", a: "Yes. The decoder handles Base64URL sections and UTF-8 content in header and payload." },
    { q: "Are tokens uploaded anywhere?", a: "No. Decoding is performed entirely in your browser." },
  ],
};

export const hashGeneratorContent: ToolContentData = {
  about: `
<p>The Hash Generator creates deterministic digests for input text using MD5, SHA-1, SHA-256, and SHA-512. It outputs both hexadecimal and Base64 forms for easy use in APIs, signatures, and testing.</p>
<p>Use it when comparing payload integrity, reproducing known hash vectors, or generating quick fingerprints while debugging. All computation runs client-side.</p>
  `,
  faqs: [
    { q: "Which hash algorithms are supported?", a: "The tool supports MD5, SHA-1, SHA-256, and SHA-512." },
    { q: "Can I copy hashes in multiple formats?", a: "Yes. You can copy either HEX output or Base64 output independently." },
    { q: "Is this suitable for password storage?", a: "No. For password storage, use dedicated password hashing algorithms like Argon2, scrypt, or bcrypt on the server." },
  ],
};

export const unixTimestampContent: ToolContentData = {
  about: `
<p>The Unix Timestamp Converter converts epoch timestamps into human-readable local and UTC date-time values, and converts date-time inputs back into seconds or milliseconds.</p>
<p>It is designed for API debugging, database audits, and log analysis where timestamp formats differ across systems.</p>
  `,
  faqs: [
    { q: "Does this support both seconds and milliseconds?", a: "Yes. Switch modes to interpret timestamp input as seconds or milliseconds." },
    { q: "Which timezone is used for date-time input?", a: "The date-time input uses your local browser timezone; UTC and ISO output are shown alongside local output." },
    { q: "Can I copy converted values quickly?", a: "Yes. Epoch seconds and milliseconds from date-time input can be copied with one click." },
  ],
};

export const cronBuilderContent: ToolContentData = {
  about: `
<p>The Cron Expression Builder helps you create and validate 5-field cron schedules for recurring tasks. Enter each field separately, review the combined expression, and confirm syntax instantly.</p>
<p>To reduce scheduling mistakes, the tool provides a plain-language summary and previews upcoming run times in your local timezone.</p>
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
<p>The Image Compressor reduces image file size directly in your browser. Control output quality, set a max width, and export optimized files without uploading anything.</p>
<p>This is useful for faster page loads, smaller social assets, and preparing screenshots or product images for the web.</p>
  `,
  faqs: [
    { q: "Which formats are supported?", a: "You can upload common image formats and export compressed JPEG or WebP output." },
    { q: "Does this resize images too?", a: "Yes. Set a max width and the tool will scale down images while preserving aspect ratio." },
    { q: "Are files uploaded to a server?", a: "No. Compression runs entirely client-side in your browser." },
  ],
};

export const imageFormatConverterContent: ToolContentData = {
  about: `
<p>The Image Format Converter switches images between PNG, JPEG, and WebP using browser-native rendering. It keeps workflow friction low for day-to-day asset prep.</p>
<p>Use quality controls for lossy formats and instantly download the converted file.</p>
  `,
  faqs: [
    { q: "Can this convert transparency to JPEG?", a: "Yes. Transparent regions are flattened against a white background when exporting JPEG." },
    { q: "Can I choose output quality?", a: "Yes. Quality controls are applied for JPEG and WebP exports." },
    { q: "Does conversion happen locally?", a: "Yes. No file data is sent to a backend service." },
  ],
};

export const imageResizerCropperContent: ToolContentData = {
  about: `
<p>The Image Resizer & Cropper lets you set exact output dimensions and optionally center-crop to common aspect ratios.</p>
<p>It's designed for generating consistent thumbnails, social card images, and responsive layout assets with high-quality browser-side resampling.</p>
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
<p>The SVG Optimizer uses SVGO in-browser to remove unnecessary markup and reduce payload size.</p>
<p>Use it before shipping icons and illustrations to improve transfer size and keep source cleaner.</p>
  `,
  faqs: [
    { q: "Does this change visual output?", a: "It targets non-visual markup and whitespace only, so appearance should stay the same in standard cases." },
    { q: "Can I copy or download optimized SVG?", a: "Yes. Both copy and .svg download actions are included." },
    { q: "Is this equivalent to full SVGO pipelines?", a: "It uses SVGO locally with configurable cleanup toggles, but not every advanced CI pipeline option is exposed in the UI." },
  ],
};

export const svgToReactContent: ToolContentData = {
  about: `
<p>The SVG to React Converter uses SVGR to turn raw SVG markup into reusable component code with JSX-friendly attribute handling.</p>
<p>Generate TSX or JSX output, rename the component, and paste directly into your React codebase.</p>
  `,
  faqs: [
    { q: "Are SVG attributes converted for JSX?", a: "Yes. SVGR handles JSX-safe attribute conversion during transform." },
    { q: "Can I output TypeScript components?", a: "Yes. Toggle between TSX and JSX output modes." },
    { q: "Does this validate SVG input?", a: "Yes. Invalid XML/SVG input returns an error message before conversion." },
  ],
};

export const imageBase64Content: ToolContentData = {
  about: `
<p>The Image Base64 Converter encodes uploaded images as data URIs and decodes Base64 strings back into downloadable image files.</p>
<p>It is useful for embedding assets in CSS/HTML prototypes or debugging data-URI payloads.</p>
  `,
  faqs: [
    { q: "Can I paste plain Base64 without the data: prefix?", a: "Yes. Plain Base64 is normalized to a PNG data URI for preview and decoding." },
    { q: "Can I preview decoded output?", a: "Yes. The tool renders a live preview from the current Base64 value." },
    { q: "Is conversion private?", a: "Yes. All encoding/decoding is performed in-browser." },
  ],
};

export const codeFormatterMinifierContent: ToolContentData = {
  about: `
<p>The Code Formatter & Minifier uses parser-based engines to format and minify HTML, CSS, and JavaScript directly in your browser.</p>
<p>It is designed for reliable transformation quality while keeping all code local to your device.</p>
  `,
  faqs: [
    { q: "Which languages are supported?", a: "HTML, CSS, and JavaScript are supported in both format and minify modes." },
    { q: "What engines are used?", a: "Formatting uses Prettier parsers. Minification uses Terser for JavaScript, CSSO for CSS, and minify-html/wasm for HTML." },
    { q: "Can I copy transformed output quickly?", a: "Yes. Output can be copied with a single click." },
  ],
};

export const cssAnimationContent: ToolContentData = {
  about: `
<p>The CSS Animation Generator creates keyframes and matching animation declarations from common motion presets.</p>
<p>Tune duration, delay, timing, fill mode, and iteration count while watching a live preview update.</p>
  `,
  faqs: [
    { q: "Can I copy full keyframes and class CSS?", a: "Yes. The output includes keyframes and an example animated class." },
    { q: "Does it support infinite loops?", a: "Yes. Set iteration count to infinite." },
    { q: "Can I change easing curves?", a: "Yes. Choose common timing functions like ease-in-out and linear." },
  ],
};

export const clipPathBezierContent: ToolContentData = {
  about: `
<p>The Clip-Path & Bezier Editor combines shape masking and easing controls in one utility.</p>
<p>Pick a polygon clip-path preset, tune cubic-bezier control points, and copy ready-to-use transition CSS.</p>
  `,
  faqs: [
    { q: "What shapes are available?", a: "The editor includes multiple polygon presets such as diamond, hexagon, triangle, and arrow." },
    { q: "What does cubic-bezier control here?", a: "It controls transition acceleration and deceleration for hover/motion effects." },
    { q: "Is the output production-ready?", a: "Yes. The generated CSS can be pasted directly and adjusted further as needed." },
  ],
};

export const textUtilitiesContent: ToolContentData = {
  about: `
<p>The Text Utilities tool bundles case conversion, slug generation, and text counters into a single workflow.</p>
<p>Convert between common naming conventions, generate URL-safe slugs, and track words/characters in real time.</p>
  `,
  faqs: [
    { q: "Which case conversions are included?", a: "Lowercase, uppercase, title case, sentence case, camelCase, PascalCase, snake_case, and kebab-case." },
    { q: "Does it include slug generation?", a: "Yes. It outputs a normalized, URL-safe slug from your input." },
    { q: "What counters are available?", a: "Word count, character count, non-space character count, and line count are shown." },
  ],
};
