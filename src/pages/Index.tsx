import { useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Lightning, Sparkle, SquaresFour, TrendUp } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import HomeNav from "@/components/HomeNav";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { tools, categories, categoryDescriptions, type Tool } from "@/lib/tools-data";

const totalToolCount = tools.filter((tool) => tool.tier === 1).length;

const spotlightStats = [
  {
    label: "Live Utilities",
    value: `${totalToolCount}+`,
    Icon: SquaresFour,
  },
  {
    label: "Avg. Launch Time",
    value: "< 1s",
    Icon: Lightning,
  },
  {
    label: "All Client Side",
    value: "No Sign-up",
    Icon: Sparkle,
  },
  {
    label: "Updated Weekly",
    value: "Fresh Drops",
    Icon: TrendUp,
  },
];

function toCategoryAnchor(category: string): string {
  return `category-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

const categoryStats = categories.map((category) => ({
  category,
  count: tools.filter((tool) => tool.category === category && tool.tier === 1).length,
  anchor: toCategoryAnchor(category),
}));

export default function Index() {
  const scrollToTools = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-[#090806] text-[#f7efe8]">
      <SEO
        title="Minerva Tools — Free Utilities for Designers & Developers"
        description="A growing collection of free, focused design utilities. Color palettes, QR codes, gradients, contrast checkers, and more. No sign-up required."
        canonical="/"
      />

      <div className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_12%_12%,rgba(234,202,160,0.14)_0%,rgba(9,8,6,0)_38%),radial-gradient(circle_at_82%_18%,rgba(168,106,76,0.2)_0%,rgba(9,8,6,0)_44%),linear-gradient(180deg,#0f0b08_0%,#090806_74%)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-12%] top-[-18%] h-[340px] w-[340px] rounded-full bg-[#d38f66]/18 blur-[86px]" />
          <div className="absolute right-[-9%] top-[8%] h-[300px] w-[300px] rounded-full bg-[#e7c39a]/14 blur-[86px]" />
          <div className="absolute bottom-[-22%] left-[24%] h-[280px] w-[280px] rounded-full bg-[#c79a74]/12 blur-[92px]" />
        </div>

        <HomeNav variant="dark" />

        <section className="relative z-10 container mx-auto px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:pb-24 lg:pt-20">
          <div className="mx-auto flex max-w-4xl justify-center">
            <div className="max-w-2xl text-center">
              <h1 className="home-reveal home-reveal-delay-1 mt-5 text-balance text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.03em] text-[#fcf3ec] sm:text-[3.1rem] lg:text-[4rem]">
                Design tools that feel fast, clear, and quietly premium.
              </h1>

              <p className="home-reveal home-reveal-delay-2 mt-6 text-[1.03rem] leading-relaxed text-[#ecd7c5]/80">
                Every utility is focused, browser-native, and tuned for momentum. Jump in, solve the task, and get back to creating.
              </p>

              <div className="home-reveal home-reveal-delay-3 mt-9 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="#tools"
                  onClick={scrollToTools}
                  className="home-press inline-flex items-center gap-2 rounded-full border border-[#f9e6d8]/90 bg-[#f9e6d8] px-6 py-3 text-sm font-semibold text-[#1f140c] shadow-[0_18px_44px_-22px_rgba(244,215,187,0.75)]"
                >
                  Explore Tools
                  <ArrowRight size={15} weight="bold" />
                </a>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {spotlightStats.map(({ label, value, Icon }, index) => (
                  <div
                    key={label}
                    className={`home-reveal rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3.5 ${index % 2 === 0 ? "home-reveal-delay-2" : "home-reveal-delay-3"}`}
                  >
                    <div className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[#f7e4d3]">
                      <Icon size={14} weight="duotone" />
                    </div>
                    <p className="text-[0.64rem] uppercase tracking-[0.15em] text-[#d4beab]/80">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-[#fff3e8]">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div id="tools" className="bg-background text-foreground">
        <section className="border-b border-border/70 bg-gradient-to-b from-muted/35 via-background to-background">
          <div className="container mx-auto px-4 py-10 sm:px-6">
            <div className="mb-7">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Browse by category</p>
              <h2 className="mt-2 text-pretty text-2xl font-semibold tracking-tight text-foreground sm:text-[2rem]">
                Start where your current task lives
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {categoryStats.map((stat) => (
                <a
                  key={stat.category}
                  href={`#${stat.anchor}`}
                  className="home-category-chip home-press group rounded-2xl border border-border/80 bg-card px-4 py-4"
                >
                  <p className="text-sm font-semibold text-card-foreground">{stat.category}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.count} ready-to-use tools</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <main className="container mx-auto px-4 pb-24 pt-16 sm:px-6 sm:pb-28 sm:pt-20">
          <div className="mb-14 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-[2rem]">All tools</h2>
            <p className="mt-2 text-sm text-muted-foreground">Everything organized by focus area.</p>
          </div>
          {categories.map((category) => {
            const categoryTools = tools.filter((t) => t.category === category);
            const anchor = toCategoryAnchor(category);

            return (
              <section key={category} id={anchor} className="mb-14 scroll-mt-24">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-foreground">{category}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{categoryDescriptions[category]}</p>
                  </div>
                  <Badge variant="outline" className="rounded-full px-2.5 py-1 text-[11px] font-medium">
                    {categoryTools.length} tools
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryTools.map((tool) => (
                    <ToolCard key={tool.route} tool={tool} />
                  ))}
                </div>
              </section>
            );
          })}
        </main>

        <Footer />
      </div>
    </div>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  const isAvailable = tool.tier === 1;

  const content = (
    <>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-primary/10 bg-primary/10 text-primary">
        <Icon size={22} weight="duotone" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-sm text-card-foreground group-hover:text-primary transition-colors">
            {tool.name}
          </h3>
          {!isAvailable && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Soon</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{tool.description}</p>
      </div>
    </>
  );

  if (!isAvailable) {
    return (
      <div className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 opacity-60 cursor-not-allowed">
        {content}
      </div>
    );
  }

  return (
    <Link
      to={tool.route}
      className="home-tool-card home-lift home-press group flex items-start gap-4 rounded-2xl border border-border bg-card p-5"
    >
      {content}
    </Link>
  );
}
