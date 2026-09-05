import { reader } from "@/lib/reader";
import { GENRES, type Genre } from "@/lib/genre";
import type { Review } from "@/lib/format";

function isGenre(value: string): value is Genre {
  return (GENRES as readonly string[]).includes(value);
}

/** All reviews, newest first. */
export async function getReviews(): Promise<Review[]> {
  const entries = await reader.collections.reviews.all();

  return entries
    .map(({ slug, entry }) => ({
      slug,
      title: entry.title,
      subject: entry.subject,
      genre: isGenre(entry.genre) ? entry.genre : ("Books" as Genre),
      rating: entry.rating ?? null,
      cover: entry.cover ?? null,
      date: entry.date ?? "",
      excerpt: entry.excerpt,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getReview(slug: string) {
  const entry = await reader.collections.reviews.read(slug);
  if (!entry) return null;

  return {
    slug,
    title: entry.title,
    subject: entry.subject,
    genre: isGenre(entry.genre) ? entry.genre : ("Books" as Genre),
    rating: entry.rating ?? null,
    cover: entry.cover ?? null,
    date: entry.date ?? "",
    excerpt: entry.excerpt,
    body: await entry.body(),
  };
}
