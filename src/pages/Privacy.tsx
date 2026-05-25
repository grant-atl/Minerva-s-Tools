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
      description="Minerva Tools is committed to your privacy. All tools run client-side — your data never leaves your browser."
      updatedAt="April 1, 2026"
    >
      <SEO
        title="Privacy Policy — Minerva Tools"
        description="All tools run client-side. No personal data is collected, stored, or transmitted."
        canonical="/privacy"
      />

      <section className="space-y-4">
        <h2 className={sectionTitle}>1. Overview</h2>
        <p className={bodyText}>
          Minerva Tools ("we", "us") operates entirely within your web browser. No files,
          colors, images, text, or other inputs you provide are ever sent to our servers.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={sectionTitle}>2. Data We Do NOT Collect</h2>
        <ul className={listText}>
          <li>Personal information (name, email, address)</li>
          <li>Tool inputs (colors, images, text, QR code content)</li>
          <li>Account or login data (we have no accounts)</li>
          <li>Usage analytics beyond what is described below</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className={sectionTitle}>3. Third-Party Services</h2>
        <div className="grid gap-2">
          <p className={card}>
            <strong className="text-white">Google AdSense:</strong> We display ads provided by Google AdSense to sustain
            the project. Google may use cookies to serve ads based on your prior visits. You can opt out at{" "}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-white">
              Google Ads Settings
            </a>.
          </p>
          <p className={card}>
            <strong className="text-white">Google Fonts:</strong> Some tools load fonts from Google Fonts, which may log
            your IP address per{" "}
            <a href="https://developers.google.com/fonts/faq/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-white">
              Google's font privacy policy
            </a>.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className={sectionTitle}>4. Cookies</h2>
        <p className={bodyText}>
          Minerva Tools does not set its own cookies. Third-party services (Google
          AdSense) may set cookies as described above.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={sectionTitle}>5. Changes to This Policy</h2>
        <p className={bodyText}>
          We may update this policy from time to time. Changes will be reflected on this page with
          an updated "Last updated" date.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={sectionTitle}>6. Contact</h2>
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
