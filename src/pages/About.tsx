import InfoPageLayout from "@/components/InfoPageLayout";
import SEO from "@/components/SEO";

const sectionTitle = "text-xl font-semibold text-white sm:text-2xl";
const bodyText = "text-sm leading-relaxed text-white/80 sm:text-base";
const valueCard = "rounded-none border border-white/15 bg-white/[0.03] px-4 py-3";

export default function About() {
  return (
    <InfoPageLayout
      title="About Minerva"
      description="Free, focused design utilities built for designers and developers who value speed, simplicity, and privacy."
    >
      <SEO
        title="About — Minerva Tools"
        description="Minerva Tools is a free collection of browser-based design and development utilities."
        canonical="/about"
      />

      <section className="space-y-4">
        <h2 className={sectionTitle}>What We Build</h2>
        <p className={bodyText}>
          Minerva Tools is a growing collection of free, focused design utilities built
          for designers and developers who value speed and simplicity. Tool inputs are processed in
          your browser rather than uploaded to Minerva Tools.
        </p>
        <p className={bodyText}>
          The project started with a simple idea: the small utilities designers reach for daily —
          contrast checkers, palette generators, shadow editors — should be instant, free, and
          private. We build each tool to do one thing well, with a clean interface that stays out
          of your way.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={sectionTitle}>What We Believe</h2>
        <ul className="grid gap-2">
          <li className={valueCard}>
            <span className="text-sm text-white/80"><strong className="text-white">Privacy-conscious by design.</strong> Tool inputs stay in your browser; site analytics, advertising, and remote fonts are disclosed in the Privacy Policy.</span>
          </li>
          <li className={valueCard}>
            <span className="text-sm text-white/80"><strong className="text-white">No gatekeeping.</strong> Core tools are free, forever. No sign-up walls.</span>
          </li>
          <li className={valueCard}>
            <span className="text-sm text-white/80"><strong className="text-white">Quality over quantity.</strong> Each tool is focused, polished, and accessible.</span>
          </li>
          <li className={valueCard}>
            <span className="text-sm text-white/80"><strong className="text-white">Fast iteration with strong defaults.</strong></span>
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className={sectionTitle}>Sustainability</h2>
        <p className={bodyText}>
          Minerva Tools is sustained by unobtrusive advertising. We keep ads minimal and
          clearly separated from the tools themselves. If you find the tools useful, simply using
          them with ads visible is enough to support continued development.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={sectionTitle}>Get in Touch</h2>
        <p className={bodyText}>
          Have feedback, a bug report, or a tool request? Visit the project's{" "}
          <a
            href="https://github.com/grant-atl/Minerva-s-Tools"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-white"
          >
            GitHub repository<span className="sr-only"> (opens in a new tab)</span>
          </a>
          .
        </p>
      </section>
    </InfoPageLayout>
  );
}
