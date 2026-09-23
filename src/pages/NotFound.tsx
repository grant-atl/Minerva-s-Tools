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
  { label: "Data & code", to: "/#category-data-dev" },
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
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SEO
        title="404 — Page Not Found | Minerva's Tools"
        description="The page you're looking for doesn't exist. Head back to Minerva's Tools and choose another utility."
        canonical="/404"
        noIndex
      />
      <HomeNav />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16 sm:px-8 sm:py-20">
        <section aria-labelledby="not-found-heading" className="text-center">
          <p aria-hidden="true" className="font-mono text-[clamp(6rem,16vw,10rem)] leading-none tracking-[-0.08em] text-primary">
            404
          </p>
          <h1
            id="not-found-heading"
            ref={headingRef}
            tabIndex={-1}
            className="mx-auto mt-6 max-w-2xl text-balance text-3xl font-medium leading-tight tracking-[-0.035em] outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-4xl"
          >
            Page not found
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground">
            This address does not match a page. Check the URL or choose a tool below.
          </p>
          <div className="mx-auto mt-6 w-fit max-w-full rounded-md border border-border bg-card px-4 py-3 text-left">
            <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Address
            </span>
            <code className="mt-1 block break-all font-mono text-xs">{attemptedPath}</code>
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/">
                <House aria-hidden="true" size={17} />
                Go home
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/#tools">
                <SquaresFour aria-hidden="true" size={17} />
                Browse all tools
              </Link>
            </Button>
          </div>
        </section>

        <aside aria-labelledby="recovery-heading" className="mt-16 border-t border-border pt-9">
          <h2 id="recovery-heading" className="text-xl font-medium tracking-tight">
            Tools
          </h2>
          <nav aria-label="Popular tool shortcuts" className="mt-5">
            <ul className="grid gap-3 sm:grid-cols-2">
              {recoveryLinks.map(({ name, to, icon: Icon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group flex h-full items-center gap-4 rounded-md border border-border bg-card p-4 outline-none transition-colors hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Icon aria-hidden="true" size={23} className="shrink-0 text-primary" />
                    <span className="min-w-0 flex-1">
                      <span className="mt-1 block text-sm font-medium">{name}</span>
                    </span>
                    <ArrowRight aria-hidden="true" size={16} className="shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Tool categories" className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-xs text-muted-foreground">
            {categoryLinks.map(({ label, to }) => (
              <Link key={label} to={to} className="rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {label}
              </Link>
            ))}
          </nav>
        </aside>
      </main>
      <Footer />
    </div>
  );
}
