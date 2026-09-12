import { reader } from "@/lib/reader";
import { GENRES, type Genre } from "@/lib/genre";
import type { Review } from "@/lib/format";

function isGenre(value: string): value is Genre {
  return (GENRES as readonly string[]).includes(value);
}

/**
 * A handful of entries are a couple of sentences and a pulled quote. Mixed into
 * the grid they made the longer pieces look padded, so they are counted here
 * and grouped under their own heading on the index.
 */
const SHORT_TAKE_WORDS = 85;

type DocumentNode = { text?: string; children?: DocumentNode[] };

function documentText(nodes: readonly DocumentNode[]): string {
  return nodes
    .map((node) =>
      [node.text ?? "", node.children ? documentText(node.children) : ""]
        .filter(Boolean)
        .join(" "),
    )
    .join(" ");
}

function countWords(nodes: readonly DocumentNode[]): number {
  const text = documentText(nodes).trim();
  return text ? text.split(/\s+/).length : 0;
}

/** All reviews, newest first. */
export async function getReviews(): Promise<Review[]> {
  const entries = await reader.collections.reviews.all();

  const reviews = await Promise.all(
    entries.map(async ({ slug, entry }) => {
      const body = (await entry.body()) as unknown as DocumentNode[];
      return {
        slug,
        title: entry.title,
        subject: entry.subject,
        genre: isGenre(entry.genre) ? entry.genre : ("Books" as Genre),
        rating: entry.rating ?? null,
        cover: entry.cover ?? null,
        date: entry.date ?? "",
        excerpt: entry.excerpt,
        short: countWords(body) <= SHORT_TAKE_WORDS,
      };
    }),
  );

  return reviews.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getReview(slug: string) {
  const entry = await reader.collections.reviews.read(slug);
  if (!entry) return null;

  const body = await entry.body();

  return {
    slug,
    title: entry.title,
    subject: entry.subject,
    genre: isGenre(entry.genre) ? entry.genre : ("Books" as Genre),
    rating: entry.rating ?? null,
    cover: entry.cover ?? null,
    date: entry.date ?? "",
    excerpt: entry.excerpt,
    short: countWords(body as unknown as DocumentNode[]) <= SHORT_TAKE_WORDS,
    body,
  };
}

export type LandingQuote = {
  text: string;
  review: { slug: string; title: string; subject: string } | null;
};

/**
 * The landing page pull quote, plus whichever review it was taken from. Both
 * live in the Keystatic singleton, so changing the quote is a field and a save.
 */
export async function getLandingQuote(): Promise<LandingQuote | null> {
  const quote = await reader.singletons.quote.read();
  if (!quote?.text) return null;

  const slug = quote.review ?? null;
  const entry = slug ? await reader.collections.reviews.read(slug) : null;

  return {
    text: quote.text,
    review:
      entry && slug
        ? { slug, title: entry.title, subject: entry.subject }
        : null,
  };
}
