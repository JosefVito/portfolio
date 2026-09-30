/** Absolute site origin. Fails the production build loudly instead of shipping localhost URLs into the sitemap and OG tags. */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit;
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelHost) return `https://${vercelHost}`;
  if (process.env.VERCEL_ENV === "production") throw new Error("Set NEXT_PUBLIC_SITE_URL in Vercel (Production and Preview)");
  return "http://localhost:3000";
}
