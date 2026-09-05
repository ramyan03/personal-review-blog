/**
 * Where the site lives.
 *
 * Absolute URLs are needed in three places that cannot infer them: the sitemap,
 * robots.txt, and the social card metadata, since a link preview is fetched by
 * someone else's server and a relative image path means nothing to it.
 *
 * Vercel sets VERCEL_PROJECT_PRODUCTION_URL on every deployment, so production
 * is correct without configuring anything. Set NEXT_PUBLIC_SITE_URL once there
 * is a real domain and it wins over both.
 */
function resolve(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export const SITE_URL = resolve();

export const SITE_NAME = "Ramyan Reviews";

export const SITE_DESCRIPTION =
  "Reviews of the books, films, and anime I finish. Written by Ramyan Chelva.";
