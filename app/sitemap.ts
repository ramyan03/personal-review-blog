import type { MetadataRoute } from "next";
import { getReviews } from "@/lib/reviews";
import { SITE_URL } from "@/lib/site";

/**
 * The landing page carries the index, so there is no /reviews entry: that route
 * is a redirect and listing it would point crawlers at a 307. Each review gets
 * its own entry, dated by when it was written.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const reviews = await getReviews();

  const newest = reviews[0]?.date ? new Date(reviews[0].date) : new Date();

  return [
    {
      url: SITE_URL,
      lastModified: newest,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...reviews.map((review) => ({
      url: `${SITE_URL}/reviews/${review.slug}`,
      lastModified: review.date ? new Date(review.date) : undefined,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
