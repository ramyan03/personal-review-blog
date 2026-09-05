export const GENRES = ["Books", "Film", "Anime"] as const;

export type Genre = (typeof GENRES)[number];

/**
 * Every genre shares a lightness/chroma and differs only by hue, so tags and
 * placeholder covers stay tonally identical across the index. The lightness
 * and chroma come from CSS custom properties rather than being baked in here,
 * which is what lets the same hue work on a dark and a light ground.
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
  heading: string;
  stat: string;
};

/** The genre shortcut cards on the home page, same hue system as the tags. */
export function genrePanel(genre: Genre): GenrePanel {
  const hue = HUE[genre] ?? HUE.Books;
  return {
    background: `oklch(var(--genre-panel-l) var(--genre-panel-c) ${hue} / var(--genre-panel-a))`,
    heading: `oklch(var(--genre-head-l) var(--genre-head-c) ${hue})`,
    stat: `oklch(var(--genre-stat-l) var(--genre-stat-c) ${hue})`,
  };
}

export function genreTheme(genre: Genre): GenreTheme {
  const hue = HUE[genre] ?? HUE.Books;
  return {
    posterBg: `oklch(var(--genre-poster-l) var(--genre-poster-c) ${hue})`,
    letterColor: `oklch(var(--genre-letter-l) var(--genre-letter-c) ${hue})`,
    pillBg: `oklch(var(--genre-pill-l) var(--genre-pill-c) ${hue} / var(--genre-pill-bg-a))`,
    pillColor: `oklch(var(--genre-pill-l) var(--genre-pill-c) ${hue})`,
    pillBorder: `oklch(var(--genre-pill-l) var(--genre-pill-c) ${hue} / var(--genre-pill-border-a))`,
  };
}
