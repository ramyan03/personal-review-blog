/**
 * The two faces the social cards are set in, fetched at build time.
 *
 * They are not bundled into the repo: next/font keeps its copies inside .next
 * where this cannot reach them, and committing font binaries to hold one image
 * together is not worth it. If a fetch fails the card still renders in the
 * fallback face, because a missing font should not fail a build.
 *
 * Only TrueType works here, so the request carries an old user agent. Google
 * serves woff2 to anything modern, and Satori cannot read woff2.
 */
type Face = { name: string; data: ArrayBuffer; weight: 400 | 500; style: "normal" | "italic" };

async function fetchFace(
  query: string,
  name: string,
  weight: 400 | 500,
  style: "normal" | "italic",
): Promise<Face | null> {
  try {
    const css = await fetch(`https://fonts.googleapis.com/css2?family=${query}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
    }).then((response) => response.text());

    const url = css.match(/src: url\((https:[^)]+\.ttf)\)/)?.[1];
    if (!url) return null;

    const data = await fetch(url).then((response) => response.arrayBuffer());
    return { name, data, weight, style };
  } catch {
    return null;
  }
}

/** Newsreader italic for the wordmark and titles, Work Sans for everything else. */
export async function ogFonts(): Promise<Face[]> {
  const faces = await Promise.all([
    fetchFace("Newsreader:ital,wght@1,500", "Newsreader", 500, "italic"),
    fetchFace("Work+Sans:wght@400", "Work Sans", 400, "normal"),
  ]);

  return faces.filter((face): face is Face => face !== null);
}

export const SERIF = "Newsreader, serif";
export const SANS = "Work Sans, sans-serif";
