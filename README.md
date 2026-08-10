# Minerva Tools

Minerva Tools is a collection of 45 focused browser utilities for designers and front-end developers. Each tool is built for a specific task—generate an asset, inspect a value, transform content, or copy production-ready output—without requiring an account.

**Live site:** [minervas.tools](https://minervas.tools)

## What is included

The collection spans six focus areas:

- **Color:** palette and gradient generators, WCAG contrast checks, color conversion, color-vision simulation, and Tailwind color matching.
- **Layout:** Flexbox, Grid, border-radius, `clamp()`, CSS animation, and clip-path/easing builders.
- **Image:** compression, resizing and cropping, format conversion, color sampling, Base64 conversion, and SVG asset tools.
- **Developer data:** JSON and code formatting, Base64 and URL encoding, UUIDs, regex, JWT inspection, hashing, timestamps, cron expressions, and text utilities.
- **Generators:** QR codes, favicons, typography scales, font pairing, spacing scales, and CSS visual effects.
- **Converters:** aspect ratios, px/rem values, SVG output, and other common design transformations.

Most tools provide live feedback and copyable or downloadable output. The full route registry lives in [`src/lib/tools-data.ts`](src/lib/tools-data.ts).

## Product principles

- **Focused:** each page solves one well-defined task with clear defaults.
- **Browser-native:** core transformations and tool inputs stay in the browser.
- **Low-friction:** all 45 utilities are available without an account or sign-in flow.
- **Practical:** results are designed to be copied, exported, or downloaded into real project work.
- **Accessible:** shared navigation, skip links, keyboard behavior, and automated accessibility coverage support a broad range of users.

## Technology

- React 18 and TypeScript
- Vite 5
- React Router
- Tailwind CSS with Radix UI primitives
- Vitest and Testing Library

## Run locally

Prerequisites: Node.js 18 or newer and npm.

```bash
git clone https://github.com/grant-atl/Minerva-s-Tools.git
cd Minerva-s-Tools
npm ci
npm run dev
```

Vite prints the local development URL after startup.

## Quality checks

```bash
npm test
npm run lint
npm run build
```

The test suite covers shared utilities, the tool registry, application routes, SEO URL resolution, and accessibility behavior.

## Architecture

- `src/pages/tools/` contains one route-level component per utility.
- `src/lib/tools-data.ts` is the canonical tool catalog used by the home page and navigation.
- `src/components/` contains shared navigation, page structure, SEO, schema, content, sharing, and accessibility components.
- `src/lib/` contains reusable conversion logic, content data, SEO helpers, and design data.
- `public/` contains crawl metadata, manifests, and static brand assets.

Tool pages use shared SEO and structured-data components while keeping task-specific state and transformations close to each route. Tests verify that the published tool catalog stays aligned with the routes expected by the application.

## Privacy

Tool inputs—including uploaded images, text, code, colors, and generated output—are processed locally and are not intentionally sent to Minerva Tools servers. The site separately loads Google Tag Manager, Google Analytics, Google AdSense, and Google Fonts; those services can receive site-usage, cookie or identifier, and standard network information. See the live [Privacy Policy](https://minervas.tools/privacy) for details and available controls.

## Contributing and source status

Bug reports, focused pull requests, and tool suggestions are welcome through [GitHub Issues](https://github.com/grant-atl/Minerva-s-Tools/issues). Please open an issue before starting a substantial change so the direction can be discussed first.

The repository is **source-available**, but it does not currently include an open-source license. Viewing the code does not grant permission to copy, redistribute, or create derivative works. A license may be added later by the project owner.
