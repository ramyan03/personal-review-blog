import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Intrinsic dimensions for the artwork, read from posters/manifest.json.
 *
 * Images inside a review come out of the Keystatic document as a bare src and
 * alt, with no size. The browser then reserves no height for them, so the
 * paragraph below sits where the picture will be until it decodes and shoves
 * everything down. Handing the real width and height to the img element lets
 * the space be held from the first paint, which is the difference between an
 * image appearing and an image popping.
 *
 * The manifest already records this for every file, so nothing new has to be
 * measured or stored.
 */
export type Dimensions = { width: number; height: number };

type ManifestEntry = {
  file: string | null;
  width?: number;
  height?: number;
};

let cache: Map<string, Dimensions> | null = null;

export async function artworkDimensions(): Promise<Map<string, Dimensions>> {
  if (cache) return cache;

  const sizes = new Map<string, Dimensions>();

  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "public", "posters", "manifest.json"),
      "utf8",
    );

    for (const entry of JSON.parse(raw) as ManifestEntry[]) {
      if (entry.file && entry.width && entry.height) {
        sizes.set(`/posters/${entry.file}`, {
          width: entry.width,
          height: entry.height,
        });
      }
    }
  } catch {
    // A missing manifest costs the reserved space, not the page.
  }

  cache = sizes;
  return sizes;
}
