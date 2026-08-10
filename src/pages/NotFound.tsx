import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  Code,
  Columns,
  House,
  Image,
  Palette,
  SquaresFour,
} from "@phosphor-icons/react";
import Footer from "@/components/Footer";
import HomeNav from "@/components/HomeNav";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";

const categoryLinks = [
  { label: "Colors", to: "/#category-colors" },
  { label: "Layout", to: "/#category-layout" },
  { label: "Image", to: "/#category-image" },
  { label: "Data / Dev", to: "/#category-data-dev" },
  { label: "Generators", to: "/#category-generators" },
  { label: "Converters", to: "/#category-converters" },
];

const recoveryLinks = [
  {
    category: "Color",
    name: "Check a color contrast ratio",
    to: "/tools/contrast",
    icon: Palette,
  },
  {
    category: "Layout",
    name: "Build a responsive CSS grid",
    to: "/tools/grid",
    icon: Columns,
  },
  {
    category: "Image",
    name: "Compress an image locally",
    to: "/tools/image-compressor",
    icon: Image,
  },
  {
    category: "Developer",
    name: "Format and validate JSON",
    to: "/tools/json-formatter",
    icon: Code,
  },
];

export default function NotFound() {
  const location = useLocation();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const attemptedPath = `${location.pathname}${location.search}${location.hash}`;

  useEffect(() => {
    headingRef.current?.focus();
  }, [attemptedPath]);

  return (
    <div className="homepage-inverted flex min-h-screen flex-col bg-[#090806] text-[#f7efe8]">
      <SEO
        title="404 — Page Not Found | Minerva"
        description="The page you're looking for doesn't exist. Head back to Minerva's free design tools."
        canonical="/404"
      />
      <HomeNav variant="dark" />

      <main className="relative isolate flex-1 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(211,143,102,0.18)_0%,rgba(9,8,6,0)_36%),radial-gradient(circle_at_86%_72%,rgba(231,195,154,0.12)_0%,rgba(9,8,6,0)_38%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-28 top-24 size-72 rounded-full border border-white/[0.06] sm:size-96"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-12 top-40 size-40 rounded-full border border-white/[0.05] sm:size-56"
        />

        <section className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1.12fr)_minmax(20rem,0.88fr)] lg:items-center lg:gap-16 lg:py-24">
          <div>
            <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#d8b99e]">
              <span aria-hidden="true" className="h-px w-8 bg-[#d8b99e]/60" />
              Route not found
            </p>

            <div
              aria-hidden="true"
              className="select-none text-[clamp(6.5rem,24vw,13rem)] font-semibold leading-[0.78] tracking-[-0.08em] text-[#f3dfcd]/[0.11]"
            >
              404
            </div>

            <h1
              ref={headingRef}
              tabIndex={-1}
              className="-mt-2 max-w-2xl text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.035em] text-[#fff5ec] outline-none sm:text-5xl lg:text-[3.7rem]"
            >
              This route wandered off the map.
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-[#dcc8b8]/75 sm:text-lg">
              The address may be mistyped, moved, or no longer available. Your
              tools are still close by.
            </p>

            <div className="mt-7 max-w-xl rounded-2xl border border-white/10 bg-white/[0.035] p-3.5 sm:flex sm:items-center sm:gap-3">
              <span className="block shrink-0 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#bda897]">
                Attempted route
              </span>
              <code className="mt-1 block min-w-0 break-all font-mono text-sm text-[#f7e4d3] sm:mt-0 sm:border-l sm:border-white/10 sm:pl-3">
                {attemptedPath}
              </code>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full px-6 shadow-[0_18px_44px_-22px_rgba(244,215,187,0.75)]"
              >
                <Link to="/">
                  <House aria-hidden="true" size={17} weight="bold" />
                  Go home
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/15 bg-white/[0.04] px-6 text-[#fff3e8] hover:bg-white/10 hover:text-white"
              >
                <Link to="/#tools">
                  <SquaresFour aria-hidden="true" size={17} weight="bold" />
                  Browse all tools
                </Link>
              </Button>
            </div>
          </div>

          <aside
            aria-labelledby="recovery-heading"
            className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_32px_90px_-50px_rgba(0,0,0,0.85)] backdrop-blur-sm sm:p-7"
          >
            <div className="flex items-start justify-between gap-6 border-b border-white/10 pb-5">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#bda897]">
                  A useful detour
                </p>
                <h2
                  id="recovery-heading"
                  className="mt-1.5 text-xl font-semibold tracking-tight text-[#fff5ec]"
                >
                  Pick up where you left off
                </h2>
              </div>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-[#e8cdb5]">
                <SquaresFour aria-hidden="true" size={19} weight="duotone" />
              </span>
            </div>

            <nav aria-label="Popular tool shortcuts" className="mt-3">
              <ul className="divide-y divide-white/[0.08]">
                {recoveryLinks.map(({ category, name, to, icon: Icon }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="group flex items-center gap-3 rounded-xl px-1 py-3.5 outline-none transition-colors hover:bg-white/[0.045] focus-visible:ring-2 focus-visible:ring-[#e8cdb5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12100d] sm:px-2"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#e8cdb5]/10 text-[#e8cdb5] transition-colors group-hover:bg-[#e8cdb5] group-hover:text-[#21150d]">
                        <Icon aria-hidden="true" size={17} weight="duotone" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-[#a99687]">
                          {category}
                        </span>
                        <span className="mt-0.5 block text-sm font-medium text-[#f7e8dc]">
                          {name}
                        </span>
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className="shrink-0 text-[#8f7c6d] transition-transform group-hover:translate-x-0.5 group-hover:text-[#e8cdb5]"
                        size={16}
                        weight="bold"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-5 border-t border-white/10 pt-5">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-[#a99687]">
                Browse by category
              </p>
              <nav
                aria-label="Tool categories"
                className="mt-3 flex flex-wrap gap-2"
              >
                {categoryLinks.map(({ label, to }) => (
                  <Link
                    key={label}
                    to={to}
                    className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-medium text-[#ddc9b8] outline-none transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white focus-visible:ring-2 focus-visible:ring-[#e8cdb5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12100d]"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}
