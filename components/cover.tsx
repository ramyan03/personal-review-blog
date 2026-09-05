import { genreTheme, type Genre } from "@/lib/genre";

/**
 * A review's artwork. When there is a poster or jacket it is used; otherwise
 * the fallback is a genre-tinted block carrying the title's initial in
 * oversized italic serif. Both keep the same 3:4 box, so a grid of covers stays
 * aligned whether or not every entry has art yet.
 */
export default function Cover({
  title,
  genre,
  cover,
  className = "",
  letterClassName = "",
  ring = false,
  sizes = "(min-width: 1280px) 20vw, (min-width: 640px) 30vw, 40vw",
}: {
  title: string;
  genre: Genre;
  cover?: string | null;
  className?: string;
  letterClassName?: string;
  ring?: boolean;
  sizes?: string;
}) {
  const theme = genreTheme(genre);

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-[3px] ${className}`}
      style={{
        aspectRatio: "3 / 4",
        background: theme.posterBg,
        boxShadow: ring ? "0 0 0 1px var(--color-ink)" : undefined,
      }}
    >
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover}
          alt={`Cover art for ${title}`}
          loading="lazy"
          decoding="async"
          sizes={sizes}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <span
          className={`font-serif leading-none font-medium italic opacity-85 ${letterClassName}`}
          style={{ color: theme.letterColor }}
          aria-hidden="true"
        >
          {title.charAt(0)}
        </span>
      )}
    </div>
  );
}
