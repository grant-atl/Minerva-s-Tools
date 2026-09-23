import InfoPageLayout from "@/components/InfoPageLayout";
import SEO from "@/components/SEO";

export default function About() {
  return (
    <InfoPageLayout title="About Minerva's Tools" description="Free browser tools for design and development.">
      <SEO title="About — Minerva's Tools" description="Free browser tools for design and development." canonical="/about" />
      <section className="space-y-4">
        <h2 className="text-xl">The tools</h2>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          Minerva&apos;s Tools includes 45 utilities for color, CSS, typography, images, and code. Each tool runs in your browser and does not require an account.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl">Privacy</h2>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          Tool inputs are processed in your browser. The site has no analytics or advertising scripts. Some typography previews load Google Fonts; see the Privacy Policy for details.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl">Feedback</h2>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          Report a bug or request a tool on the{" "}
          <a href="https://github.com/grant-atl/Minerva-s-Tools" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
            GitHub repository<span className="sr-only"> (opens in a new tab)</span>
          </a>.
        </p>
      </section>
    </InfoPageLayout>
  );
}
