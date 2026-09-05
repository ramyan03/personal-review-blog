import type { Genre } from "@/lib/genre";

/**
 * Shape of a review as it travels to client components. Deliberately free of
 * any Keystatic reader import so it can be bundled for the browser.
 */
export type Review = {
  slug: string;
  title: string;
  subject: string;
  genre: Genre;
  rating: number | null;
  cover: string | null;
  date: string;
  excerpt: string;
};

/** "Sep 2, 2026", parsed as a plain date so it never shifts with the timezone. */
export function formatDate(date: string): string {
  if (!date) return "";
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Books get "a novel by X"; film and anime carry their own "dir. X" phrasing. */
export function byline(review: Pick<Review, "genre" | "subject">): string {
  if (review.genre === "Books" && !/^dir\./i.test(review.subject)) {
    return `a novel by ${review.subject}`;
  }
  return review.subject;
}
