export const BASE_URL = "https://minervas.tools";

export function resolveCanonicalUrl(canonical?: string) {
  if (!canonical) return BASE_URL;
  if (/^https?:\/\//i.test(canonical)) return canonical;
  return canonical.startsWith("/") ? `${BASE_URL}${canonical}` : `${BASE_URL}/${canonical}`;
}
