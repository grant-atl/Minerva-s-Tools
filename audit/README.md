# Minerva’s Tools audit

September 23, 2026 · 45 tools reviewed

The redesign, Windows 98 removal, copy cleanup, Motion transitions, favicon, and social image are implemented. Default mobile layout problems in Border Radius, Clamp Calculator, and CSS Animation were also corrected. Shared About/FAQ gutters were restored across all tools. Uploaded fonts now display their filename without an internal prefix, and CSS/Tailwind exports quote that readable name. A browser upload and repeated-upload regression verify the change. The reported HTML minifier WebAssembly initialization failure was fixed; all six HTML/CSS/JavaScript formatting and minifying modes were exercised successfully in the browser and a regression uses the installed WASM binary. The tool review found several incorrect exports, input-handling failures, and inaccessible controls that remain recommendations; this audit did not apply wholesale tool changes.

The most useful next step is to correct output and keyboard behavior before adding features. Both detailed reports include a recommendation for every tool: [22 color, layout, and generator tools](<tool-review-design.md>) and [23 data, image, and converter tools](<tool-review-data.md>).

## Priorities

| Priority | Verified problem | Recommended change |
|---|---|---|
| P1 | JSON formatting changes `9007199254740993` to `9007199254740992`; rem clamp output misses its requested endpoint; a square crop is stretched into the previous output dimensions. | Preserve JSON number text or reject unsafe values before replacing input. Calculate clamp values in consistent units. Keep output dimensions aligned with the selected crop ratio. Add one regression for each reproduced case. |
| P1 | Transparent QR PNG exports crop on high-density displays; oversized QR input throws during rendering; quotation marks break exported metadata. | Normalize QR canvas dimensions, handle encoder capacity errors before preview/download, and escape generated HTML text and attributes. The metadata issue affects exported HTML; the React preview itself escapes text. |
| P1 | Image uploads, favicon upload, and shadow-layer selection have pointer-only paths. Many fields/sliders lack associated labels. Font Pairing captures Space on buttons. | Reuse native upload buttons, connect existing labels to controls, name icon actions, and limit page-wide shortcuts to the page background. Preserve normal keyboard activation. |
| P1 | A regex stress case exceeds a one-second isolated-process timeout; finite aspect-ratio inputs can produce an infinite GCD loop after numeric overflow. | Run regex work in a terminable worker with bounded results. Validate scaled values before the shared GCD loop, including very small ratios. |
| P1 | The dependency scan reports 35 affected entries: 1 critical, 20 high, 10 moderate, and 4 low. | Review and update affected dependencies, then repeat tests/build. The critical entry is the development dependency Vitest; its advisory concerns the listening UI server. These counts do not establish that 35 production exploits are reachable. [Scan](<dependencies.json>) |
| P2 | RGB batch input splits at internal commas; presets leave stale color drafts; image downloads can use a new extension for an old Blob. | Fix parsing and serialization at their current boundaries. Store format/dimensions with completed image results or invalidate stale results when controls change. |
| P2 | Numeric controls can export invalid CSS, Lorem Ipsum retains an out-of-range count after changing units, and some Copy actions announce success before the write completes. | Validate committed values, clamp counts on unit changes, and report clipboard success only after completion. Keep output selectable when copying fails. |
| P2 | Bezier controls do not trigger the exported motion; enlarged text causes overflow on 13 routes plus a one-pixel excess on Image Compressor. | Make the motion preview use the exported transform/duration, and allow affected controls, headers, and previews to wrap. See the reflow results below. |

Reproductions, affected callers, and smaller per-tool improvements are recorded in the two tool reports. Source line references reflect the review snapshot and may move after the copy and spacing edits.

## Browser and project checks

| Check | Result and scope |
|---|---|
| Default-width reflow | **135/135 passed:** every tool at 320, 768, and 1440 CSS pixels, after the three grid fixes. This checked page-level horizontal overflow; it does not establish keyboard access or correctness of generated output. |
| Enlarged-text reflow | At 320 pixels with the site’s 130% text setting, **31/45 fit exactly; 13 have substantive overflow and Image Compressor exceeds the viewport by one pixel**, listed below. |
| Automated tests | **45 passed across 10 files.** The new audit reproductions are not all covered by the existing suite. |
| Typecheck/build | Passed. Build warnings remain for large chunks and Node modules externalized through SVGR. |
| Lint | **0 errors, 8 warnings.** |
| Impeccable detector | Returned `[]`. This is a heuristic result, not evidence that accessibility, responsive behavior, or output correctness passed. [Result](<impeccable-detector.json>) |

At a 320-pixel viewport with 130% text, the observed page widths were:

| Route under `/tools/` | Page width |
|---|---:|
| `contrast` | 343 px |
| `favicon` | 372 px |
| `color-blindness` | 342 px |
| `glassmorphism` | 397 px |
| `neumorphism` | 357 px |
| `meta-preview` | 376 px |
| `lorem-ipsum` | 365 px |
| `flexbox` | 406 px |
| `image-compressor` | 321 px |
| `svg-optimizer` | 372 px |
| `svg-to-react` | 345 px |
| `base64` | 345 px |
| `url-encode` | 345 px |
| `unix-timestamp` | 383 px |

After the shared About/FAQ gutter correction, all 45 tools were checked again at 320 pixels: each has 16-pixel left and right content gutters and no page overflow at default text size. The enlarged-text measurements above were also repeated after that change. The Gradient page has 24-pixel gutters at the reported 852-pixel width. Desktop spot checks covered both standalone and already-contained sections without double padding. See the [per-tool measurements](responsiveness.csv).

Desktop menu Escape closes the menu and returns focus to its trigger. Mobile category navigation opens the selected tool and closes the drawer. The home library renders one card per row at 320 pixels. Reduced-motion settings suppress route transforms.

## Scores

Scale: 0 = unusable; 1 = major gaps; 2 = functional with significant gaps; 3 = good with limited gaps; 4 = thoroughly verified within scope.

| Dimension | Score | Evidence |
|---|---:|---|
| Accessibility | 1/4 | Primary actions lack keyboard paths, and controls repeatedly lack accessible names despite the shared skip link and accessibility menu. |
| Performance | 2/4 | Routes and heavy transforms use lazy loading, but regex work can block interaction and image processing has unbounded cases. Build-size warnings remain. |
| Responsive design | 2/4 | All default-width checks pass; 13 routes have substantive enlarged-text overflow and one has a one-pixel excess at the smallest tested width. |
| Theming | 3/4 | The shared dark theme is consistent; a few application colors remain hard-coded. Intentional colors in tool previews are output, not theme defects. |
| Implementation integrity | 1/4 | Multiple ordinary tool operations can alter data, generate incorrect assets, or produce output inconsistent with the controls. |
| **Total** | **9/20** | **Targeted corrections needed.** |

## Complexity cleanup

The [Ponytail report](<ponytail-audit.md>) identifies approximately **4,960 source lines and 42 direct dependency declarations** that could be removed without dropping active tools. The largest cut is 32 unreachable UI modules and two unused hook copies. Other verified opportunities include the orphan headline animation, unused React Query provider, and duplicate toast implementations.

These are proposed cuts, not completed deletions. Migrate the four real legacy-toast callers before removing that implementation. Removing redundant direct Radix declarations does not imply that their transitive packages or equivalent bundle bytes disappear. Keep the existing native controls, installed parsers, bounded generators, and working accessibility behavior while making these changes.
