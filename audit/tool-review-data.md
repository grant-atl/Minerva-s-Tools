# Data, image, and converter tool audit

Scope: **23 tools** in the current catalog: 11 Data/Dev, 7 Image, and 5 Converters. This is a read-only source audit following the Impeccable audit reference. This audit introduced no application source changes. Desktop/mobile rendering and the integrity detector are covered by the parent audit; the observations below do not claim browser measurements.

## Implementation integrity verdict

**Needs correction.** The shared theme and local-processing model are coherent, and the tools generally use native browser facilities or installed parsers. However, several outputs can silently change data or disagree with their controls, and the same missing-label/upload-keyboard pattern occurs across independent tools. Resolve the shared interaction issues and six major correctness/accessibility findings before adding more UI.

## Priority findings

### D01 · P1 · Six image upload controls cannot be reached by keyboard

**Category:** Accessibility. **Standard:** WCAG 2.1.1 Keyboard; relevant to 4.1.2 Name, Role, Value.

The visible upload affordance is a plain `<label>` surrounding an `input type="file" className="hidden"`. The input is removed from keyboard navigation, and the label is not a button or keyboard target. Therefore the primary upload action has no keyboard route. This affects Image Color Picker, Compressor, Format Converter, Resizer & Cropper, Image Base64, and SVG to PNG.

Evidence: [ImageColorPicker.tsx:147](../src/pages/tools/ImageColorPicker.tsx#L147), [ImageCompressor.tsx:198](../src/pages/tools/ImageCompressor.tsx#L198), [ImageFormatConverter.tsx:165](../src/pages/tools/ImageFormatConverter.tsx#L165), [ImageResizerCropper.tsx:243](../src/pages/tools/ImageResizerCropper.tsx#L243), [ImageBase64Converter.tsx:111](../src/pages/tools/ImageBase64Converter.tsx#L111), [SvgToPngConverter.tsx:129](../src/pages/tools/SvgToPngConverter.tsx#L129).

**Smallest correction:** reuse the working SVG-to-CSS pattern: a native button activates a referenced hidden file input. Alternatively keep the native input visually hidden but focusable and expose focus on its label. No custom upload widget is needed. **Command:** `$impeccable harden`.

Image Color Picker also exposes its pixel-selection action only through `canvas.onClick` ([line 173](../src/pages/tools/ImageColorPicker.tsx#L173)); add a keyboard-accessible coordinate picker or keyboard cursor in the same canvas.

### D02 · P1 · Visible field titles are frequently not accessible labels

**Category:** Accessibility. **Standard:** WCAG 1.3.1 Info and Relationships / 4.1.2 Name, Role, Value.

Many forms place `<p>` or an unassociated `<Label>` before an input. The shared Input/Textarea components do not attach labels automatically. This leaves editable fields and output areas unnamed to assistive technology. Examples: Code Formatter's two selects and two textareas ([line 104](../src/pages/tools/CodeFormatterMinifier.tsx#L104)); all five Cron inputs ([line 127](../src/pages/tools/CronExpressionBuilder.tsx#L127)); Regex fields ([line 101](../src/pages/tools/RegexTesterReplacer.tsx#L101)); Aspect Ratio's shared Field ([line 270](../src/pages/tools/AspectRatioCalculator.tsx#L270)); SVG Blob's color/range controls ([line 193](../src/pages/tools/SvgBlobPatternGenerator.tsx#L193)); UUID Count ([line 80](../src/pages/tools/UUIDGenerator.tsx#L80)).

**Smallest correction:** associate existing visible labels with stable input IDs, and connect error text using `aria-describedby`. Give read-only textareas names too. Keep the existing native controls. **Command:** `$impeccable harden`.

### D03 · P1 · A normal regex stress case blocks the page

**Category:** Performance / Implementation Integrity.

Regex matching and replacement execute synchronously in a render-time `useMemo`, with no work budget: [RegexTesterReplacer.tsx:38](../src/pages/tools/RegexTesterReplacer.tsx#L38), [line 41](../src/pages/tools/RegexTesterReplacer.tsx#L41), [line 59](../src/pages/tools/RegexTesterReplacer.tsx#L59). An isolated Node process evaluating `(a+)+$` against 30 `a` characters followed by `!` exceeded a one-second timeout. A browser executes the same JavaScript regex on its UI thread, so the user cannot correct the pattern while it runs. A debounce cannot interrupt this work.

**Smallest safe correction:** run matching/replacement in one worker that can be terminated after a short budget, bound the rendered match count, and show a timed-out state. Keep native RegExp. **Command:** `$impeccable optimize`.

### D04 · P1 · Finite ratio inputs can enter an infinite loop

**Category:** Implementation Integrity / Performance.

`parsePositiveNumber` accepts finite positive numbers, but `simplifyRatio(1e308, 0.1)` multiplies the width by 10 and produces Infinity ([aspect-ratio.ts:44](../src/lib/aspect-ratio.ts#L44)). `gcd` eventually computes `Infinity % 1` as NaN, and `while (y !== 0)` never exits ([line 20](../src/lib/aspect-ratio.ts#L20)). The exact source function timed out in a separately killable process.

**Smallest correction:** reject nonfinite/unsafe scaled integers before entering the shared GCD and surface a bounded-range validation message. Also test the lower precision boundary: `simplifyRatio(0.0000001, 1)` currently yields `0:1` although both inputs are positive. One boundary test belongs in the existing aspect-ratio test file. **Command:** `$impeccable harden`.

### D05 · P1 · Formatting JSON silently changes large numeric identifiers

**Category:** Implementation Integrity.

The formatter parses with `JSON.parse` then overwrites the original text with `JSON.stringify`: [JsonFormatterValidator.tsx:28](../src/pages/tools/JsonFormatterValidator.tsx#L28), [line 37](../src/pages/tools/JsonFormatterValidator.tsx#L37). Verified input `{"id":9007199254740993}` becomes `{"id":9007199254740992}`. A formatting action should not silently change an ID.

**Smallest correction:** preserve numeric lexemes through a lossless formatting path using the existing parser stack, or reject unsafe numeric values before replacing input. Keep a regression containing an unsafe integer and exponent notation. **Command:** `$impeccable harden`.

### D06 · P1 · Choosing a crop ratio stretches the final image

**Category:** Implementation Integrity.

Uploading a 1200×800 image sets output dimensions to 1200×800. Selecting 1:1 changes only `aspectMode`. Processing crops an 800×800 source canvas and resizes that square into the unchanged 1200×800 output canvas. Evidence: [ImageResizerCropper.tsx:119](../src/pages/tools/ImageResizerCropper.tsx#L119), [line 152](../src/pages/tools/ImageResizerCropper.tsx#L152), [line 168](../src/pages/tools/ImageResizerCropper.tsx#L168), [line 182](../src/pages/tools/ImageResizerCropper.tsx#L182), [line 280](../src/pages/tools/ImageResizerCropper.tsx#L280). The resulting horizontal scale is 1.5 while vertical scale is 1.

**Smallest correction:** make selecting a crop preset update output dimensions to that ratio; subsequent ratio-locked edits should retain the selected crop ratio. Verify a square source feature remains square after export. **Command:** `$impeccable harden`.

## Other verified patterns

- **P2 — Stored image output disagrees with current controls.** Convert PNG, switch the format to JPEG, then download without reconverting: the existing PNG Blob gets a `.jpg` filename. [ImageFormatConverter.tsx:72](../src/pages/tools/ImageFormatConverter.tsx#L72) derives the extension from current selection; [line 128](../src/pages/tools/ImageFormatConverter.tsx#L128) uses it for the old Blob. [ImageCompressor.tsx:143](../src/pages/tools/ImageCompressor.tsx#L143) repeats the bug. Resizer's output caption reads current dimensions while retaining the previous Blob ([line 313](../src/pages/tools/ImageResizerCropper.tsx#L313)). Save format/dimensions with the result, or invalidate the result when settings change. Category: Implementation Integrity. Command: `$impeccable harden`.
- **P2 — Invalid image Base64 throws outside the error UI.** Input `%%%` becomes a nominal data URL, passes the structural regex, and throws `InvalidCharacterError` in unguarded `atob` at [ImageBase64Converter.tsx:70](../src/pages/tools/ImageBase64Converter.tsx#L70). Validate image MIME, decode inside `try/catch`, and show one actionable error. Map supported MIME types explicitly; `image/svg+xml` currently produces the extension `.svg+xml`. Category: Implementation Integrity. Command: `$impeccable harden`.
- **P2 — SVG metadata toggle overstates its effect.** With “Remove metadata/title/desc” selected, the installed SVGO preset removes metadata but retains `<title>` and meaningful `<desc>`. Exact `optimizeSvg` execution verified both remain. The disabled case also configures a preset override for `removeTitle` that SVGO warns is not in the preset ([SvgOptimizer.tsx:27](../src/pages/tools/SvgOptimizer.tsx#L27)). Prefer keeping accessible title/description and renaming the option “Remove metadata”; remove ineffective overrides. Category: Implementation Integrity / Accessibility. Command: `$impeccable clarify`.
- **P2 — Failed uploads have no handled error state.** Image Compressor and Resizer await file reading/image decoding outside `try/catch` ([ImageCompressor.tsx:92](../src/pages/tools/ImageCompressor.tsx#L92), [ImageResizerCropper.tsx:113](../src/pages/tools/ImageResizerCropper.tsx#L113)). A corrupt image with an image MIME rejects the event handler with no toast. Other readers also omit error handling or are awaited without catches. Catch failures at each user-triggered upload handler and preserve the previous valid result. Category: Implementation Integrity. Command: `$impeccable harden`.
- **P2 — Some Copy actions report success before clipboard success.** SVG-to-CSS and px/rem call `navigator.clipboard.writeText` without awaiting, then display a success toast ([SvgToCss.tsx:79](../src/pages/tools/SvgToCss.tsx#L79), [PxRemConverter.tsx:63](../src/pages/tools/PxRemConverter.tsx#L63)). Await the write and use the existing toast API on failure. Most other reviewed tools await but do not catch rejections. Category: Implementation Integrity. Command: `$impeccable harden`.

## Tool-by-tool recommendations

These are practical next changes, not requests to add new features. The major findings above take precedence over polish. Responsive layout comments are source observations; browser overflow measurements belong to the parent audit.

| Tool | Review and smallest useful recommendation |
|---|---|
| JSON Formatter & Validator | **P1 D05:** preserve large numeric values. Also change the two `!validation.parsed` guards to test validity only: `null`, `false`, `0`, and `""` are valid JSON values, but clicking Minify currently leaves surrounding whitespace unchanged ([lines 36/41](../src/pages/tools/JsonFormatterValidator.tsx#L36)). Associate a visible label with the editor. |
| Code Formatter & Minifier | Installed Prettier/Terser/CSSO/minify-html parsers are the right reuse, with lazy imports and cancellation of stale state commits. Follow-up browser feedback exposed a broken HTML minifier WASM initializer. It now supplies the generated imports and passes instance.exports to the binding; all six transform modes pass a real-WASM regression and browser checks. Name the language/mode selects and input/output editors; disable Copy while a new transform is pending, so it cannot copy the previous result under changed input ([line 125](../src/pages/tools/CodeFormatterMinifier.tsx#L124)). |
| Base64 Encoder/Decoder | UTF-8 encoding correctly uses TextEncoder rather than `btoa(text)`. Decoder silently replaces invalid UTF-8 (`/w==` → `�`) through default TextDecoder behavior ([line 28](../src/pages/tools/Base64EncoderDecoder.tsx#L27)). Use a fatal UTF-8 decoder so malformed text gets the existing error state; name both textareas and expose Encode/Decode selection with `aria-pressed`. |
| URL Encoder/Decoder | Native encode/decodeURIComponent and caught errors are appropriate; no encoding correctness bug found. Name the two textareas and expose Encode/Decode selection. Clarify the visible description as “URL component” encoding, consistent with the underlying operation and SEO text ([line 24](../src/pages/tools/UrlEncoderDecoder.tsx#L23)). |
| UUID Generator | Native crypto.randomUUID with the installed UUID fallback is appropriate, and generation is bounded at 100. Attach Count's label to its input ([line 80](../src/pages/tools/UUIDGenerator.tsx#L80)) and normalize it to an integer: 2.5 is displayed although Array.from creates 2 entries. Keep the current bounded generator. |
| Regex Tester & Replacer | **P1 D03:** isolate and time-bound matching. Add actual labels and `aria-describedby` for pattern errors. Avoid silently dropping unsupported flags; the currently displayed compiled regex differs from entered flags after sanitization ([line 22](../src/pages/tools/RegexTesterReplacer.tsx#L22)). |
| JWT Decoder & Inspector | The explicit “decoding does not verify signatures” notice is correct. Validate decoded header/payload as non-null objects rather than only casting JSON.parse ([line 55](../src/pages/tools/JwtDecoderInspector.tsx#L55)); JSON `null` currently produces neither the decoded section nor an error. Interpret JWT NumericDate consistently as seconds: value 10000000000 is rendered as 1970 by the heuristic but represents 2286 in seconds ([line 29](../src/pages/tools/JwtDecoderInspector.tsx#L29)). |
| Hash Generator | Eight MD5 vectors matched Node's independent crypto implementation; SHA uses native Web Crypto, and late results are ignored after input changes. No hash-algorithm defect found. Name input/HEX/Base64 editors and mark the selected algorithm programmatically ([line 208](../src/pages/tools/HashGenerator.tsx#L208)); show a pending state rather than leaving an old digest copyable. |
| Unix Timestamp Converter | Reject blank timestamp input before Number conversion. Clearing the field currently displays the Unix epoch because `Number("") === 0` ([line 30](../src/pages/tools/UnixTimestampConverter.tsx#L30)). Associate labels with both inputs. Local-vs-UTC output and explicit unit choice are useful and should remain. |
| Cron Expression Builder | Uses the installed cron parser and validates exactly five fields; no scheduling-algorithm defect verified. Associate the five field labels, show field ranges already present in FIELD_SPECS, and explain that 0/7 mean Sunday ([line 23](../src/pages/tools/CronExpressionBuilder.tsx#L23)). Correct the empty-state text “within the next year”: the code imposes no one-year search bound. |
| Text Utilities | Unicode case conversion is visibly wrong: “élan déjà vu” becomes “éLan DéJà Vu”; slug “café déjà vu” becomes “caf-dj-vu” ([line 15](../src/pages/tools/TextUtilities.tsx#L15)). Use Unicode-aware word boundaries/case handling or state the ASCII limitation. Handle existing hyphen/underscore separators for identifier conversions (`hello-world` currently stays `hello-world` under camelCase, [line 41](../src/pages/tools/TextUtilities.tsx#L41)). |
| Image Color Picker | **P1 D01** for upload and canvas keyboard access. Also, “exact” sampling reads a canvas already downscaled to at most 860×460 ([line 70](../src/pages/tools/ImageColorPicker.tsx#L70)); interpolation can change source pixel colors. Keep the display small but sample the mapped original pixel. Clear should clear `picked` and `palette` together, since it only clears imageSrc at line 158. |
| Image Compressor | **P1 D01**, plus stale-output and upload-error patterns above. Report actual savings: when 100 bytes becomes 150, the current code says “0.0% smaller” ([line 81](../src/pages/tools/ImageCompressor.tsx#L81)); show “50% larger” or retain the original when compression grows it. Revoke the stored preview URL on replacement, clear, and unmount. |
| Image Format Converter | **P1 D01**, and derive downloaded extension from completed output. Remove the “Drag/drop” claim until drop handlers exist; the current label has only an onChange file input ([line 168](../src/pages/tools/ImageFormatConverter.tsx#L168)). Disable/hide the quality slider for PNG because canvas PNG encoding does not use this quality parameter. |
| Image Resizer & Cropper | **P1 D06** crop geometry; **P1 D01** upload. Add a finite integer/pixel-area limit before allocating output canvases ([line 152](../src/pages/tools/ImageResizerCropper.tsx#L152)); currently dimensions are only lower-bounded. Reuse the existing lazy Pica worker-backed path. |
| Image Base64 Converter | **P1 D01**, and catch malformed Base64 before decode/download (pattern above). Map actual supported image MIME types to extensions rather than splitting the MIME string; preserve the existing local `<img>` preview. Name the data URI editor. |
| SVG to PNG Converter | **P1 D01**. Validate SVG XML before building the preview URL; `encodeURIComponent` succeeding is not SVG validation, so arbitrary text produces a broken-image preview ([line 35](../src/pages/tools/SvgToPngConverter.tsx#L35)). Reuse the DOMParser validation approach already used by SVG-to-CSS, enforce finite output dimensions/area, and revoke the temporary SVG object URL in `finally` on decode failure. |
| SVG Blob & Pattern Generator | The preview is an encoded image source rather than inserted HTML. Validate the free-text color fields before interpolating them into SVG attributes ([line 195](../src/pages/tools/SvgBlobPatternGenerator.tsx#L196)); invalid strings can produce unusable assets. Associate color and range labels, and expose Blob/Pattern mode selection. A separate randomization framework is unnecessary. |
| SVG to CSS Converter | Already has a keyboard-accessible Upload SVG button and real drop handlers; retain this model. Name the SVG textarea, await clipboard writes, and make “Copy data URI only” copy the data URI itself: currently it copies the surrounding `url("…")` CSS expression ([line 229](../src/pages/tools/SvgToCss.tsx#L228)). |
| Aspect Ratio Calculator | **P1 D04:** finite numeric inputs must stay safe after scaling; guard the shared helper once. Name all six inputs through the existing Field helper. Document or validate the six-decimal precision ceiling so tiny positive ratios do not silently become zero. Existing helper tests are a good place for the single boundary regression. |
| px ↔ rem Converter | Main converter fields are properly associated with labels and stack on mobile. Batch input silently discards invalid rows and truncates after 50 ([line 204](../src/pages/tools/PxRemConverter.tsx#L213)); show the accepted/rejected count and limit, and reject nonfinite numbers (`Infinity` passes the current `!isNaN` filter). Clearing a single converter input should clear its counterpart rather than leave a stale conversion. |
| SVG to React Converter | Uses installed SVGR with XML validation, normalized component names, lazy loading, and stale-result protection. No additional core conversion defect verified from source. Name input/output editors and disable Copy while conversion is pending ([line 199](../src/pages/tools/SvgToReactConverter.tsx#L199)). Let the output header wrap on narrow screens instead of forcing title, processing text, and Copy into one row. |

## Checks and limits

- Read all 23 tool components, the shared input/textarea/label implementations, and relevant conversion/aspect libraries.
- Executed the exact extracted MD5 function against Node crypto for empty input, `a`, `abc`, lengths 55/56/64, Unicode, and 10,000 characters: all eight passed.
- Executed the exact extracted SVG optimizer with installed SVGO: title/description retention and invalid preset override warning reproduced.
- Executed exact aspect-ratio helper code in an isolated process: `1e308, 0.1` timed out; `0.0000001, 1` produced `0:1`.
- Isolated native regex stress input exceeded a 1,000 ms timeout; no browser tab was deliberately frozen.
- Executed JSON precision/primitive cases, UTF-8 replacement behavior, exact text casing functions, JWT timestamp heuristic, and image output/stat calculations described above.
- Image crop distortion is verified from the exact source dimensions and call flow, not a screenshot or exported image comparison. Parent browser checks can add visual/export evidence.
- No server requests or direct HTML injection occur in the reviewed tool transforms. SVG image/CSS previews were not reported as XSS: those are different execution contexts from inline untrusted HTML.

## Suggested sequence

1. `$impeccable harden`: fix D01/D02 field access and D04–D06 data integrity; validate malformed inputs and completed image result metadata.
2. `$impeccable optimize`: isolate regex evaluation with termination and a bounded result list.
3. `$impeccable clarify`: correct SVG metadata, compression savings, crop, and upload claims to reflect actual behavior.
4. `$impeccable adapt`: use the parent runtime findings for narrow output headers, UUID rows, and long values rather than adding speculative breakpoints.
5. `$impeccable polish`: finish visible labels, mode states, and consistent feedback after functional corrections.
