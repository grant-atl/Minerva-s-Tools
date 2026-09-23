# Design-tool source audit

Reviewed September 23, 2026. Scope: all 22 tools in Colors (6), Layout (6), and Generators (10), plus their color, Tailwind-palette, font-loading, and favicon helpers. Source-review snapshot; follow-up fixes are explicitly marked below. The root audit owns browser screenshots, viewport verification, compilation, and the Impeccable detector. Scores below assess this source-review subset and are not a WCAG conformance claim.

## Implementation integrity verdict

**Needs fixes.** The redesigned dark surfaces and shared controls form a coherent system, but several tools can export incorrect results or expose controls that cannot be used with a keyboard. These are functional issues independent of visual taste. Generated colors, shadows, gradients, and font specimens are tool output; their intentional colors must not be mistaken for theme violations.

## Source-review health score

| Dimension | Score | Evidence |
|---|---:|---|
| Accessibility | 1/4 | Favicon upload and shadow-layer selection are pointer-only; many visible labels are not associated with inputs. |
| Performance | 3/4 | Routes are lazy-loaded and most generators cap work; image simulation processes full-resolution pixels synchronously. |
| Responsive design | 2/4 | Responsive grids are common; several small controls and fixed-size previews need the root browser audit. |
| Theming | 3/4 | Most application UI uses tokens; the spacing chart retains an unrelated hard-coded blue. |
| Implementation integrity | 2/4 | Verified exported-output failures in clamp, QR, and metadata; the custom-font configuration defect was subsequently fixed. |
| **Total** | **11/20** | **Acceptable, significant work needed.** |

13 grouped findings at review: **0 P0, 6 P1, 7 P2, 0 P3**. D8 was subsequently fixed, leaving 6 P1 and 6 P2 groups outstanding. The inventory also includes clearly labeled improvement suggestions; they are not additional verified defects or counted findings.

## Verified findings

### D1 — [P1] rem clamp output does not reach the requested endpoint

- **Location:** `src/pages/tools/ClampCalculator.tsx:27`, especially lines 33–39.
- **Category:** Implementation Integrity.
- **Reproduction:** Min value 1, max value 3, viewports 320 and 1440, output rem produces `clamp(1rem, 0.4286rem + 0.1786vw, 3rem)`. At a 16px root and 1440px viewport this computes to 16px, rather than the requested 48px. The same numerical slope is used for px and rem even though `vw` remains a viewport length.
- **Impact:** The core output is wrong for an offered unit and can silently freeze fluid typography at its minimum.
- **Recommendation:** Define what unit the numeric inputs represent; convert to a common unit before calculating the slope. If values are rem, keep an explicit root-font-size control, as the existing Spacing Calculator does. Test both endpoints in px and rem.
- **Suggested command:** `$impeccable harden`.

### D2 — [P1] Transparent QR PNG exports crop on high-density screens

- **Location:** `src/pages/tools/QRCodeGenerator.tsx:155`, `src/pages/tools/QRCodeGenerator.tsx:164`; installed renderer `node_modules/qrcode.react/lib/esm/index.js:984`.
- **Category:** Implementation Integrity.
- **Evidence:** qrcode.react sizes its canvas to `size * devicePixelRatio`. The transparent branch creates a `size × size` destination and calls `drawImage(sourceCanvas, 0, 0)` without destination dimensions. On a 2× screen, a 512×512 source is copied at natural size into a 256×256 destination, retaining only its top-left quadrant. The ordinary PNG path also exports the backing-store resolution rather than the size displayed by the control.
- **Impact:** Transparent downloads can be unscannable, especially on Retina displays.
- **Recommendation:** Normalize the source into the requested destination dimensions explicitly. Prefer rendering a transparent background directly over deleting pixels by approximate color; the latter also removes logo pixels matching the background. Check PNG dimensions and decode a downloaded QR at DPR 1 and DPR 2.
- **Suggested command:** `$impeccable harden`.

### D3 — [P1] An oversized QR payload throws during rendering

- **Location:** `src/pages/tools/QRCodeGenerator.tsx:290`, `src/pages/tools/QRCodeGenerator.tsx:543`, `src/pages/tools/QRCodeGenerator.tsx:558`; `src/App.tsx:216`.
- **Category:** Implementation Integrity / input validation.
- **Reproduction:** Rendering the installed `QRCodeSVG` with 10,000 lowercase `a` characters throws `RangeError: Data too long`. The text field has no capacity guard; its value is passed directly to both QR components. The route has Suspense but no error boundary to catch render errors.
- **Impact:** Pasting a large value can take down the active application view instead of producing an actionable validation message.
- **Recommendation:** Detect encoder capacity errors before committing a preview, keep the previous valid code or show a clear error, and disable download while invalid. A character limit alone is insufficient because encoding capacity also varies with payload bytes and correction level.
- **Suggested command:** `$impeccable harden`.

### D4 — [P1] Metadata export does not escape HTML

- **Location:** `src/pages/tools/MetaPreview.tsx:20`.
- **Category:** Implementation Integrity / export trust boundary.
- **Reproduction:** A title of `A "quoted" title` produces an `og:title` whose parsed content is only `A `. Values are interpolated into both `<title>` text and quoted attributes. A closing title tag can also introduce markup into the generated artifact.
- **Impact:** Ordinary quotation marks corrupt copied metadata. If externally supplied text is used, the copied HTML can contain executable markup when inserted into another site's document. **The tool's current React preview escapes text; this is an exported-artifact issue, not a demonstrated in-app XSS.**
- **Recommendation:** Escape text/attribute characters or serialize elements through the DOM, then test quotes, ampersands, angle brackets, and a closing title tag. Also distinguish a local preview upload from a deployable public image URL.
- **Suggested command:** `$impeccable harden`.

### D5 — [P1] Primary operations are not reliably keyboard accessible

- **Locations:** `src/pages/tools/FaviconGenerator.tsx:200`, `src/pages/tools/BoxShadowGenerator.tsx:213`, `src/pages/tools/FontPairing.tsx:225`.
- **Category:** Accessibility, WCAG 2.1.1 Keyboard.
- **Evidence:** Favicon's upload target is a clickable div with no keyboard handler or tabindex, and its file input is `display:none`. Shadow layers are clickable divs; users cannot select an arbitrary layer by keyboard. Font Pairing's global Space listener ignores INPUT/TEXTAREA/SELECT but captures BUTTON, preventing native Space activation and randomizing the user's fonts instead.
- **Impact:** Keyboard users cannot perform the same image upload/layer-selection tasks, and normal button activation can unexpectedly change work.
- **Recommendation:** Use a real upload button, use a separate real button for layer selection beside its delete button, and restrict global Space randomization to `event.target === document.body`, matching the existing Palette Generator pattern.
- **Suggested command:** `$impeccable harden`.

### D6 — [P1] Visible labels do not provide accessible names for controls

- **Representative locations:** `src/pages/tools/ColorConverter.tsx:183`, `src/pages/tools/ContrastChecker.tsx:217`, `src/pages/tools/BorderRadiusGenerator.tsx:119`, `src/pages/tools/GridGenerator.tsx:183`, `src/pages/tools/BoxShadowGenerator.tsx:402`, `src/pages/tools/GlassmorphismGenerator.tsx:237`.
- **Category:** Accessibility, WCAG 1.3.1 and 4.1.2.
- **Evidence:** These controls render sibling labels without `htmlFor`/`id`, or place label text in spans beside sliders without `aria-label`/`aria-labelledby`. Contrast's empty color-picker button has no name. Font Pairing and Typography Scale's export icon buttons also have no labels. Color Converter's validation message is not associated with the relevant input.
- **Impact:** A screen-reader user cannot reliably identify which field, slider, or copy action they are using.
- **Recommendation:** Associate each field with its existing visible text; pass the current label through local SliderControl/ColorControl helpers to the actual control. Expose selection with `aria-pressed` or radios for button-based choices. Give icon actions distinct names such as “Copy Tailwind configuration.” Associate errors and mark invalid fields.
- **Suggested command:** `$impeccable harden`.

### D7 — [P2] Tailwind batch mode splits valid RGB values into invalid fragments

- **Location:** `src/pages/tools/TailwindColorFinder.tsx:145`.
- **Category:** Implementation Integrity.
- **Reproduction:** The advertised example `rgb(34, 197, 94)` becomes `['rgb(34', '197', '94)']` because splitting occurs on every comma before color parsing.
- **Impact:** A format shown in the tool's own placeholder fails in batch mode; users must convert it to HEX first.
- **Recommendation:** Use line-delimited input, or split on commas only outside parentheses. Preserve the existing 20-color bound and add this exact regression case.
- **Suggested command:** `$impeccable harden`.

### D8 — [P2, fixed] Custom-font Tailwind configuration contains unquoted identifiers

- **Location:** `src/pages/tools/FontPairing.tsx:256`.
- **Category:** Implementation Integrity.
- **Reproduction:** The regular-font configuration object evaluates correctly. Uploading `MyFont.woff2` produces `heading: [Custom-heading-MyFont, 'sans-serif']`; evaluating the same object fragment throws `ReferenceError: Custom is not defined`.
- **Impact:** Users cannot paste a custom-font export into their configuration successfully.
- **Resolution:** Display names now use the uploaded filename; a separate unique family identifies the live FontFace. CSS and Tailwind exports quote names with `JSON.stringify`. A repeated-upload regression and a real browser font upload pass. **Remaining suggestion:** Explain the `@font-face`/asset installation step; the in-memory FontFace is not transferred with copied CSS.
- **Suggested command:** `$impeccable harden`.

### D9 — [P2] Neumorphism presets leave the HEX fields stale

- **Location:** `src/pages/tools/NeumorphismGenerator.tsx:434`, `src/pages/tools/NeumorphismGenerator.tsx:463`.
- **Category:** Implementation Integrity.
- **Evidence:** `ColorControl` initializes a local draft with `useState(value)` and never synchronizes it after parent presets/reset replace `value`. The native picker and preview use the new prop; the text field retains the old color. Blurring it commits the old color back into settings.
- **Impact:** Applying a preset produces contradictory controls and later reverts colors unexpectedly.
- **Recommendation:** Preserve editable drafts while focused, but update them when a new preset/reset changes the committed value. Check Soft Card → Slate → blur and Reset.
- **Suggested command:** `$impeccable harden`.

### D10 — [P2] Bezier preview never performs the exported transformation

- **Location:** `src/pages/tools/ClipPathBezierEditor.tsx:36`, `src/pages/tools/ClipPathBezierEditor.tsx:131`.
- **Category:** Implementation Integrity.
- **Evidence:** The export applies `scale(1.08)` on hover and a 320ms transition. The preview has a 300ms transition and timing function but no changing transform, hover class, or replay control.
- **Impact:** Adjusting easing numbers provides no visual feedback for the tool's primary easing feature.
- **Recommendation:** Add a keyboard-accessible “Preview motion” control and apply the same transform and duration used by the export. Keep the static shape available under reduced motion. Allow y-coordinate overshoot if full cubic-bezier editing is intended; x coordinates alone require the 0–1 restriction.
- **Suggested command:** `$impeccable animate`.

### D11 — [P2] Several controls export invalid values despite displayed numeric/color limits

- **Locations:** `src/pages/tools/FlexboxGenerator.tsx:128`, `src/pages/tools/GridGenerator.tsx:189`, `src/pages/tools/GlassmorphismGenerator.tsx:147`, `src/pages/tools/SpacingCalculator.tsx:200`, `src/pages/tools/CssAnimationGenerator.tsx:113`.
- **Category:** Implementation Integrity / input validation.
- **Evidence:** HTML min/max attributes do not clamp React state. Flexbox accepts negative gap; Grid accepts fractional row/column counts and emits e.g. `repeat(2.5, ...)`; deleting Glassmorphism's color creates `rgba(NaN, NaN, NaN, ...)`. Spacing accepts ratios outside its shown limit and CSS Animation accepts arbitrary iteration strings/negative duration.
- **Impact:** The tool can display a value that the CSS engine rejects or cannot faithfully preview.
- **Recommendation:** Validate finite numbers and integer-only fields at the shared local field handlers; keep text drafts separate from the last valid value for color/number editing. Provide an inline message and disable copy when invalid instead of silently exporting broken CSS. Reuse existing validation utilities where suitable; do not create an unnecessary new framework.
- **Suggested command:** `$impeccable harden`.

### D12 — [P2] Lorem Ipsum count remains outside the limit after changing units

- **Location:** `src/pages/tools/LoremIpsumGenerator.tsx:204`, `src/pages/tools/LoremIpsumGenerator.tsx:214`.
- **Category:** Implementation Integrity.
- **Evidence:** Switching tabs only changes `unit`; `count` remains shared. Selecting 200 words and then Paragraphs generates 200 paragraphs even though the slider's paragraph maximum is 10.
- **Impact:** The control and generated result disagree and a small action can produce far more text than expected.
- **Recommendation:** Clamp the existing count when the unit changes, using the same per-unit bound used for the slider. Check Words 200 → Paragraphs and Sentences 30 → Paragraphs.
- **Suggested command:** `$impeccable harden`.

### D13 — [P2] Clipboard actions can claim success before the write succeeds

- **Representative locations:** `src/pages/tools/PaletteGenerator.tsx:118`, `src/pages/tools/GradientGenerator.tsx:88`, `src/pages/tools/MetaPreview.tsx:160`, `src/pages/tools/SpacingCalculator.tsx:100`.
- **Category:** Implementation Integrity.
- **Evidence:** Several handlers call `navigator.clipboard.writeText` without awaiting it and immediately show success. Other tools await but do not handle rejection. Denied clipboard permissions therefore produce a false success or an unhandled rejection.
- **Impact:** Users leave the tool believing the generated output was copied when it was not.
- **Recommendation:** Show success only after the write resolves; on rejection, show a clear message and leave the selectable output available. Reuse a current clipboard helper if one exists before adding any abstraction.
- **Suggested command:** `$impeccable harden`.

## Per-tool review and next step

“Suggestion” below indicates a usability improvement or bounded follow-up, not a separately counted verified bug. Shared findings D5/D6/D13 should be fixed through existing local/shared controls where possible.

| Category / tool | Verified behavior or specific issue | Practical next step |
|---|---|---|
| Colors — Color Palette Generator | Locked colors are retained during regeneration; contrast is calculated on actual color pairs. `PaletteGenerator.tsx:66` | **Suggestion:** Rename “Only accessible” to clarify that it filters/generates qualifying pairs, not a universally accessible palette; its tooltip promises 6–12 pairs although five colors produce only ten total (`:331`, `:336`). Add an accessible name to each editable color (`D6`). |
| Colors — Gradient Generator | Stops are sorted and capped at eight; numeric position controls provide an alternative to drag. `GradientGenerator.tsx:76` | **D6:** Label the angle and each stop's position/color with its stop number; expose selected gradient type and radial position. Give draggable handles slider semantics if retaining direct manipulation (`:208`, `:421`). |
| Colors — Contrast Checker | Invalid HEX prevents a misleading ratio; pass/fail uses unrounded values. `ContrastChecker.tsx:21` | **D6:** Name the two native/text color controls and picker buttons. **Suggestion:** Explain what “large text” means alongside AA/AAA thresholds, and announce updated results without forcing focus. |
| Colors — Color Blindness Simulator | Local screenshots avoid cross-origin iframe problems. Pixel simulation runs on full image dimensions with no size limit or error handler (`ColorBlindnessSimulator.tsx:235`). | **Suggestion:** Add decode-error feedback, cancel obsolete image loads, and cap preview pixel dimensions before a large-image performance pass. Treat simulation as an approximation; the model attribution/accuracy was not scientifically validated by this source audit. Label Add Color and expose selected vision type (`D6`). |
| Colors — Tailwind Color Finder | RGB batching fails (`D7`); `parseColor` also accepts RGB numbers above 255 and trailing text (`src/lib/tailwind-colors.ts:82`). | Fix batch tokenization and require a complete, bounded color parse. **Suggestion:** Identify the bundled palette as Tailwind v3 so users know what the nearest match represents. |
| Colors — Color Converter | Converts validated 3-/6-digit HEX and comma RGB/HSL; bad input keeps old companion values. `ColorConverter.tsx:32` | **D6:** Label each input and attach its error. **Suggestion:** Keep the color swatch based on the last valid color and mark stale companion outputs while editing invalid text; distinguish rejection from silent RGB/HSL clamping. |
| Layout — Flexbox Generator | Native layout preview and CSS share the same selected values. `FlexboxGenerator.tsx:29` | **D11/D6:** Enforce the shown gap bounds and label inputs. Expose direction/alignment selection semantically. **Suggestion:** Add one differently sized item or remove fixed item dimensions when testing stretch; identical 48px boxes hide alignment differences. |
| Layout — Grid Generator | Numeric bounds are clamped, but fractional track counts remain possible (`D11`); cell rendering stops at 24 even when rows×columns is larger (`GridGenerator.tsx:26`). | Round track counts to integers, disclose the preview's 24-cell cap, and use an intrinsic-size preview item to demonstrate align/justify instead of forcing every item to `h-full w-full` (`:150`). |
| Layout — Border Radius Generator | CSS corner order and preview values agree. `BorderRadiusGenerator.tsx:20` | **D6:** Associate each native range with its corner label. **Suggestion:** Add a numeric value control for precise keyboard/touch entry; keep the simple four-corner scope rather than adding an unnecessary path editor. Root owns the observed narrow-screen overflow. |
| Layout — Clamp Calculator | rem formula is wrong (`D1`); source silently reorders values/adjusts viewports. | Fix unit math first. **Suggestion:** Show invalid/reversed viewport ranges instead of silently changing them; display both endpoint sizes for an immediate sanity check. Root owns narrow-screen overflow. |
| Layout — CSS Animation Generator | Label/id associations are good; fixed preset keyframes do not interpolate user text into the live stylesheet. `CssAnimationGenerator.tsx:96` | **D11:** Validate duration and iteration syntax. **Suggestion:** Add Replay/Pause; the default single-run fade has already ended when later controls change. Offer reduced-motion export guidance and preserve a deliberate static preview. Root owns narrow-screen overflow. |
| Layout — Clip-Path & Bezier Editor | Fields have real labels; easing preview is static (`D10`). | Make motion preview match exported CSS. **Suggestion:** Distinguish shape presets from free point editing in the wording, and let y coordinates overshoot if that is the intended scope. |
| Generators — QR Code Generator | DPR export crop and capacity error (`D2/D3`). WiFi data is inserted without delimiter escaping (`QRCodeGenerator.tsx:67`). | Fix downloads/capacity first. **Suggestion:** Escape reserved WiFi delimiters; an SSID containing `;P:` currently creates an extra field. Include a scanner quiet margin in the exported code, and avoid silently exporting sample payloads from empty fields. |
| Generators — Box Shadow Generator | Eight-layer cap and the same generated shadow values are used in the preview/export. | **D5/D6:** Make layer selection keyboard accessible; label every slider and delete action. **Suggestion:** Select the first layer initially to expose controls immediately (`BoxShadowGenerator.tsx:69`). |
| Generators — Typography Scale | Scale computation is bounded and rem conversion explicitly uses 16. `TypographyScale.tsx:119` | **D6:** Label sliders and export buttons. **Suggestion:** Reuse an accessible searchable picker instead of maintaining a second custom dropdown; disclose the 16px rem basis and include font-loading instructions with exported font-family rules. Ensure the selected Figtree built-in remains loaded after the redesign (`:49`, `:76`). |
| Generators — Favicon Generator | ICO header/dimensions and ZIP filenames align with generated PNGs in `src/lib/favicon-utils.ts:90`. | **D5:** Provide a real upload button. **Suggestion:** Validate decode success and disable image export while no image is loaded; currently a corrupt/empty image mode can yield only the background. Preserve bounded output sizes. |
| Generators — Font Pairing | Space intercept remains (`D5`); the custom Tailwind export failure (`D8`) is fixed. Custom file load failures are already caught (`FontPairing.tsx:189`). | Fix keyboard handling. **Suggestion:** Reuse the same accessible picker as Typography Scale; remove obsolete FontFace objects after repeated uploads and document how custom assets are installed in the exported project. |
| Generators — Spacing Calculator | Bounded step count and an explicit root size are useful; base/ratio/root limits are not all enforced (`D11`). | Validate numerical inputs. **Suggestion:** Use the primary token for the chart instead of hard-coded blue (`SpacingCalculator.tsx:249`), and make it clear when a framework preset has become a custom scale. |
| Generators — Glassmorphism Generator | Preview/export use the same settings, including prefixed backdrop-filter; typed colors are unvalidated (`D11`). | Preserve a last valid color and show a field error before exporting. **D6:** Associate each slider label. **Suggestion:** Move Copy CSS out of the code text's top-right area so it cannot cover long output. |
| Generators — Neumorphism Generator | Preview/export share shadow calculation and color commit validates six-digit HEX; preset updates leave local text drafts stale (`D9`). | Synchronize committed colors with drafts on preset/reset. **Suggestion:** Explain that Width/Height affect only the preview, because the export currently contains background, radius, and shadows only (`NeumorphismGenerator.tsx:183`). |
| Generators — Meta Tag Preview | Export does not escape markup (`D4`); image onError hides the element permanently until remounted (`MetaPreview.tsx:91`). | Escape output first. **Suggestion:** Reset image error state when the URL changes, validate a public absolute image URL for production export, and label uploaded images as local preview assets. |
| Generators — Lorem Ipsum Generator | A bounded generator uses a seed, but unit changes retain an incompatible count (`D12`). | Clamp count on unit change. **Suggestion:** For exact word counts, treat multiword entries such as “crow's nest” as separate tokens or clearly define a “word” as a generated dictionary entry (`LoremIpsumGenerator.tsx:50`, `:113`). |

## Checks performed

Executed isolated checks against the actual TypeScript source via the installed TypeScript transpiler (no source modifications):

- Extracted Clamp Calculator's current formula; confirmed `1–3rem / 320–1440px` evaluates to 16px rather than 48px at its upper endpoint with a 16px root.
- Applied the existing batch split expression; confirmed RGB splits into three fragments.
- Extracted metadata generator and parsed the output with the installed jsdom; confirmed quoted title truncation.
- Extracted the font-pairing configuration generator and evaluated its object fragment: ordinary Google-font output succeeds, custom-font output throws `ReferenceError: Custom is not defined`.
- Rendered installed qrcode.react's QRCodeSVG with a 10,000-character payload; confirmed `RangeError: Data too long`.
- Traced installed qrcode.react's DPR-dependent canvas dimensions against the PNG export's draw call.

No independent browser or viewport was controlled by this reviewer. Detector results and actual responsive measurements belong in the root audit; do not treat these source scores as replacements for them.

## Patterns and positives

- Existing native controls, React text rendering, guarded color conversion in Contrast Checker, locally generated files, bounded layer/stop counts, and route-level lazy loading are worth preserving.
- Labels, selection states, clipboard failure handling, and numeric validation recur across tools. Fix the actual shared/local control helpers before duplicating patches at every call site.
- Hard-coded specimen colors are intentional output in palettes, QR codes, gradients, and effects. They are not evidence that application theming failed.
- No persistent storage, server upload, or active in-app markup injection was found in this scoped group. Font previews intentionally load Google Fonts; remote metadata images intentionally issue image requests. This is not a claim that every external library or the entire application is vulnerability-free.

## Recommended action order

1. **[P1] `$impeccable harden`:** Correct exported clamp/QR/metadata output, reject oversized QR data, and restore keyboard/name coverage for primary controls.
2. **[P2] `$impeccable harden`:** Repair batch parsing, custom-font quoting, stale draft state, input bounds, count transitions, and clipboard feedback.
3. **[P2] `$impeccable animate`:** Make easing and animation previews replayable and equivalent to exported behavior, with an intentional reduced-motion state.
4. **[P2] `$impeccable adapt`:** Apply the root audit's verified narrow-screen findings and enlarge the smallest contextual controls where needed.
5. **`$impeccable polish`:** Recheck output readability, field errors, control names, and consistency after functional fixes.
