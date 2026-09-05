import { genreTheme, type Genre } from "@/lib/genre";

/**
 * The site's placeholder cover: a genre-tinted block carrying the title's
 * initial in oversized italic serif. Used at every size, from the fanned
 * thumbnails on the landing page to the full grid card.
 */
export default function Cover({
  title,
  genre,
  className = "",
  letterClassName = "",
  ring = false,
}: {
  title: string;
  genre: Genre;
  className?: string;
  letterClassName?: string;
  ring?: boolean;
}) {
  const theme = genreTheme(genre);

  return (
    <div
      className={`flex items-center justify-center overflow-hidden rounded-[3px] ${className}`}
      style={{
        aspectRatio: "3 / 4",
        background: theme.posterBg,
        boxShadow: ring ? "0 0 0 1px oklch(0.17 0.008 55 / 0.9)" : undefined,
      }}
    >
      <span
        className={`font-serif leading-none font-medium italic opacity-85 ${letterClassName}`}
        style={{ color: theme.letterColor }}
        aria-hidden="true"
      >
        {title.charAt(0)}
      </span>
    </div>
  );
}
