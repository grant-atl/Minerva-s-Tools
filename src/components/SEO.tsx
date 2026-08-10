import { Helmet } from "react-helmet-async";
import { resolveCanonicalUrl } from "@/lib/seo";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  type?: string;
  noIndex?: boolean;
}

export default function SEO({
  title,
  description,
  canonical,
  ogImage = "https://minervas.tools/og-image.png",
  type = "website",
  noIndex = false,
}: SEOProps) {
  const url = resolveCanonicalUrl(canonical);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex, follow" />}
      <link rel="canonical" href={url} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
