import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** The CMS is not for crawlers, and on a deployment it is disabled anyway. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/keystatic", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
