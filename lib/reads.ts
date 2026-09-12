/**
 * The other half of the pair.
 *
 * Ramyan Reads is the reading list; a book review here can point at its entry
 * there. Held as a small hand-maintained map rather than fetched, for the same
 * reason the link back is: both sites are statically built, there are five
 * books, and a cross-site request at build time would be real machinery for one
 * line of metadata.
 *
 * The value is the search term Reads should land on, not the slug: Reads
 * searches titles and authors, so handing it a slug would find nothing. Add an
 * entry when a book review goes up and the book is on the list.
 */

export const READS_ORIGIN = "https://ramyan-reads.vercel.app";

const onTheList: Record<string, string> = {
  "kafka-on-the-shore": "Kafka on the Shore",
  "the-bell-jar": "The Bell Jar",
  "the-blade-itself": "The Blade Itself",
  "the-picture-of-dorian-gray": "The Picture of Dorian Gray",
  "the-setting-sun": "The Setting Sun",
};

export function readsUrl(slug: string): string | null {
  const title = onTheList[slug];
  return title ? `${READS_ORIGIN}/?q=${encodeURIComponent(title)}` : null;
}
