export const GENRES = ["Books", "Film", "Anime"] as const;

export type Genre = (typeof GENRES)[number];

/**
 * Every genre shares a lightness/chroma and differs only by hue, so tags and
 * placeholder covers stay tonally identical across the index.
 */
const HUE: Record<Genre, number> = {
  Books: 145,
  Film: 255,
  Anime: 15,
};

export type GenreTheme = {
  posterBg: string;
  letterColor: string;
  pillBg: string;
  pillColor: string;
  pillBorder: string;
};

export type GenrePanel = {
  background: string;
  kicker: string;
  heading: string;
  body: string;
  stat: string;
};

/** Full-height genre column on the landing page, same hue system as the tags. */
export function genrePanel(genre: Genre): GenrePanel {
  const hue = HUE[genre] ?? HUE.Books;
  return {
    background: `oklch(0.24 0.03 ${hue} / 0.5)`,
    kicker: `oklch(0.82 0.09 ${hue})`,
    heading: `oklch(0.95 0.02 ${hue})`,
    body: `oklch(0.72 0.02 ${hue})`,
    stat: `oklch(0.6 0.02 ${hue})`,
  };
}

export function genreTheme(genre: Genre): GenreTheme {
  const hue = HUE[genre] ?? HUE.Books;
  return {
    posterBg: `oklch(0.24 0.03 ${hue})`,
    letterColor: `oklch(0.9 0.05 ${hue})`,
    pillBg: `oklch(0.82 0.09 ${hue} / 0.14)`,
    pillColor: `oklch(0.82 0.09 ${hue})`,
    pillBorder: `oklch(0.82 0.09 ${hue} / 0.35)`,
  };
}
