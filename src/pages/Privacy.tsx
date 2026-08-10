import InfoPageLayout from "@/components/InfoPageLayout";
import SEO from "@/components/SEO";

const sectionTitle = "text-xl font-semibold text-white sm:text-2xl";
const bodyText = "text-sm leading-relaxed text-white/80 sm:text-base";
const listText = "list-disc space-y-2 pl-5 text-sm text-white/80 sm:text-base";
const card = "rounded-none border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white/80 sm:text-base";

export default function Privacy() {
  return (
    <InfoPageLayout
      title="Privacy Policy"
      description="How Minerva Tools keeps tool inputs local and handles limited hosting and font-preview requests."
      updatedAt="August 10, 2026"
    >
      <SEO
        title="Privacy Policy — Minerva Tools"
        description="Learn how Minerva Tools processes tool inputs locally without analytics or advertising scripts."
        canonical="/privacy"
      />

      <section className="space-y-4">
        <h2 className={sectionTitle}>1. Overview</h2>
        <p className={bodyText}>
          Minerva Tools ("we", "us") does not offer accounts and does not load analytics,
          advertising, or behavioral-tracking scripts. Its utilities process files, colors, text,
          code, and other tool inputs in your browser rather than uploading those inputs to Minerva
          Tools.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={sectionTitle}>2. Tool Data We Do Not Receive</h2>
        <ul className={listText}>
          <li>Files and images opened in a tool</li>
          <li>Text, code, colors, URLs, or QR code content entered into a tool</li>
          <li>Generated files or copied output</li>
          <li>Account or login data, because Minerva Tools has no accounts</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className={sectionTitle}>3. Limited Third-Party Requests</h2>
        <div className="grid gap-2">
          <p className={card}>
            <strong className="text-white">Hosting and delivery:</strong> Requests for site pages
            and assets are handled by our hosting and content-delivery providers. Like most web
            infrastructure, they may process standard connection and security information such as
            your IP address, browser details, requested URL, and request time in server logs.
          </p>
          <p className={card}>
            <strong className="text-white">Optional Google Font previews:</strong> The Font Pairing
            and Typography Scale tools request font previews from Google Fonts when those tools are
            used. Those requests expose standard connection information, including your IP address
            and browser details, to Google. Other Minerva Tools pages do not request Google Fonts.
            Read the{" "}
            <a href="https://fonts.google.com/faq#privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-white">
              Google Fonts privacy FAQ
            </a>.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className={sectionTitle}>4. Browser Storage and Cookies</h2>
        <p className={bodyText}>
          Minerva Tools can store accessibility preferences in your browser so those settings persist
          between visits. The application does not use account, analytics, advertising, or tracking
          cookies.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={sectionTitle}>5. Your Choices</h2>
        <p className={bodyText}>
          You can reset saved accessibility settings from the accessibility menu or clear site data in
          your browser. You can also block requests to Google Fonts; typography previews may then use
          a fallback font, while the rest of the tool remains available.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={sectionTitle}>6. Changes to This Policy</h2>
        <p className={bodyText}>
          We may update this policy from time to time. Changes will be reflected on this page with an
          updated "Last updated" date.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={sectionTitle}>7. Contact</h2>
        <p className={card}>
          <strong className="text-white">Email:</strong>{" "}
          <a href="mailto:grantpedersen@outlook.com" className="underline underline-offset-4 hover:text-white">
            grantpedersen@outlook.com
          </a>
        </p>
      </section>
    </InfoPageLayout>
  );
}
