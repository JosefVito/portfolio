import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";

const base = getSiteUrl();

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${base}/sitemap.xml` };
}
