import InfoPageLayout from "@/components/InfoPageLayout";
import SEO from "@/components/SEO";

const sectionTitle = "text-xl font-semibold text-white sm:text-2xl";
const bodyText = "text-sm leading-relaxed text-white/80 sm:text-base";

export default function Terms() {
  return (
    <InfoPageLayout
      title="Terms of Use"
      description="Terms governing your use of Minerva's Tools — free, browser-based design utilities provided as-is."
      updatedAt="August 10, 2026"
    >
      <SEO
        title="Terms of Use — Minerva's Tools"
        description="Terms of use for Minerva's Tools. Free, browser-based design utilities provided as-is."
        canonical="/terms"
      />

      <section className="space-y-4">
        <h2 className={sectionTitle}>1. Acceptance</h2>
        <p className={bodyText}>
          By accessing and using Minerva's Tools ("the Service"), you agree to these Terms
          of Use. If you do not agree, please discontinue use of the Service.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={sectionTitle}>2. Description of Service</h2>
        <p className={bodyText}>
          Minerva's Tools provides free, browser-based design utilities including color
          palette generators, gradient builders, contrast checkers, QR code generators, and other
          tools. Core tool inputs and transformations are handled in your browser. Limited hosting
          and optional font-preview requests are described in the Privacy Policy.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={sectionTitle}>3. Use of Tools and Output</h2>
        <p className={bodyText}>
          You may use the tools and download their generated outputs (images, code, and files) for
          personal or commercial projects. This permission does not grant rights to the source code
          or branding for Minerva's Tools, or to third-party materials.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={sectionTitle}>4. Disclaimer</h2>
        <p className={bodyText}>
          The Service is provided "as is" without warranties of any kind, express or implied. We
          do not guarantee uninterrupted availability, accuracy of outputs, or fitness for a
          particular purpose.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={sectionTitle}>5. Limitation of Liability</h2>
        <p className={bodyText}>
          In no event shall Minerva's Tools or its creators be liable for any indirect,
          incidental, special, or consequential damages arising from your use of the Service.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={sectionTitle}>6. Changes</h2>
        <p className={bodyText}>
          We reserve the right to modify these terms at any time. Continued use of the Service
          after changes constitutes acceptance of the updated terms.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={sectionTitle}>7. Contact</h2>
        <p className={bodyText}>
          Questions about these terms? Email us at{" "}
          <a href="mailto:grantpedersen@outlook.com" className="underline underline-offset-4 hover:text-white">
            grantpedersen@outlook.com
          </a>.
        </p>
      </section>
    </InfoPageLayout>
  );
}
