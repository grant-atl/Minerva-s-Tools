import { Helmet } from "react-helmet-async";
import type { FAQ } from "@/components/ToolContent";

interface ToolSchemaProps {
  name: string;
  description: string;
  url: string;
  faqs?: FAQ[];
}

const BASE_URL = "https://minervas.tools";

export default function ToolSchema({ name, description, url, faqs = [] }: ToolSchemaProps) {
  const fullUrl = `${BASE_URL}${url}`;

  const softwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${name} — Minerva's Tools`,
    description,
    url: fullUrl,
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name, item: fullUrl },
    ],
  };

  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(softwareApp)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      {faqSchema && (
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      )}
    </Helmet>
  );
}
