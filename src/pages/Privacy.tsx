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
      description="How Minerva Tools handles tool inputs and uses analytics, advertising, cookies, and remote fonts."
      updatedAt="August 10, 2026"
    >
      <SEO
        title="Privacy Policy — Minerva Tools"
        description="Learn how Minerva Tools processes tool inputs locally and uses Google analytics, advertising, and font services."
        canonical="/privacy"
      />

      <section className="space-y-4">
        <h2 className={sectionTitle}>1. Overview</h2>
        <p className={bodyText}>
          Minerva Tools ("we", "us") does not offer accounts. Its utilities process files,
          colors, text, and other tool inputs in your browser rather than uploading those inputs to
          Minerva Tools. The website also uses the third-party services described below, which
          receive site-usage and connection data separately from your tool inputs.
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
        <h2 className={sectionTitle}>3. Third-Party Services</h2>
        <div className="grid gap-2">
          <p className={card}>
            <strong className="text-white">Google Tag Manager:</strong> We use Tag Manager to
            load and manage measurement tags. Depending on the tags configured, page views and
            interaction events may be sent to Google or another configured service. Read Google's{" "}
            <a href="https://developers.google.com/tag-platform/tag-manager/datalayer" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-white">
              Tag Manager documentation
            </a>.
          </p>
          <p className={card}>
            <strong className="text-white">Google Analytics:</strong> We use Google Analytics 4
            to understand site usage. Its default collection can include page and session activity,
            approximate location, traffic source, and browser or device information. Analytics may
            use a first-party identifier cookie. Read Google's{" "}
            <a href="https://support.google.com/analytics/answer/11593727" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-white">
              Analytics data-collection documentation
            </a>.
          </p>
          <p className={card}>
            <strong className="text-white">Google AdSense:</strong> We load Google AdSense to
            support the project with advertising. AdSense can use first- and third-party cookies or
            similar identifiers for ad delivery, frequency control, reporting, and—where allowed by
            settings and applicable requirements—personalization. Read how{" "}
            <a href="https://support.google.com/adsense/answer/7549925" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-white">
              AdSense uses cookies
            </a>.
          </p>
          <p className={card}>
            <strong className="text-white">Google Fonts:</strong> The site and selected typography
            tools request font files from Google Fonts. Those network requests expose standard
            connection information, including your IP address and browser information, to Google.
            Read the{" "}
            <a href="https://fonts.google.com/faq#privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-white">
              Google Fonts privacy FAQ
            </a>.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className={sectionTitle}>4. Cookies and Browser Storage</h2>
        <p className={bodyText}>
          Google Analytics and AdSense may set first- or third-party cookies and use comparable
          browser storage for measurement and advertising. Minerva Tools does not use cookies for
          account sessions because it has no accounts.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={sectionTitle}>5. Your Choices</h2>
        <p className={bodyText}>
          You can limit or clear cookies through your browser, manage personalization in{" "}
          <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-white">
            Google Ads Settings
          </a>
          , or install Google's{" "}
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-white">
            Analytics opt-out browser add-on
          </a>
          . Blocking third-party services may prevent ads, analytics, or remote fonts from loading,
          but core tool inputs will still be processed locally.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={sectionTitle}>6. Reports and Retention</h2>
        <p className={bodyText}>
          We can access aggregated Analytics and AdSense reports. The application does not
          intentionally include your tool inputs in those reports. Google handles retention for its
          services according to its policies and the settings applied to those services.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={sectionTitle}>7. Changes to This Policy</h2>
        <p className={bodyText}>
          We may update this policy from time to time. Changes will be reflected on this page with
          an updated "Last updated" date.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={sectionTitle}>8. Contact</h2>
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
