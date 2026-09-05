import Link from "next/link";
import Reveal from "@/components/reveal";
import ScrollDown from "@/components/scroll-down";
import Stars from "@/components/stars";
import IndexLink from "@/components/index-link";
import { genrePanel, type Genre } from "@/lib/genre";
import { truncate, type Review } from "@/lib/format";

const DRIFT_COUNT = 6;

/**
 * One genre to a screen. The three used to share a row, three narrow columns
 * with four covers each, which gave the artwork no room and made the labels
 * fight for the same fold. Given a screen apiece the covers can be large enough
 * to actually read, and each one links to its own review rather than the whole
 * panel linking to the filtered index.
 */
export default function GenreSection({
  genre,
  reviews,
  id,
  next,
  nextLabel,
}: {
  genre: Genre;
  reviews: Review[];
  id: string;
  next: string;
  nextLabel: string;
}) {
  const panel = genrePanel(genre);
  const drift = reviews.filter((entry) => entry.cover).slice(0, DRIFT_COUNT);

  return (
    <section
      id={id}
      className="panel relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-20"
      style={{ background: panel.background }}
    >
      {/* The covers from this genre, scattered and drifting. Hovering one holds
          it still, brings it forward and drops a line of the review under it. */}
      <Reveal variant="bare" className="genre-drift">
        {drift.map((entry, i) => (
          <Link
            key={entry.slug}
            href={`/reviews/${entry.slug}`}
            aria-label={`${entry.title}: read the review`}
            className={`genre-drift-item genre-drift-${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={entry.cover ?? ""} alt="" loading="lazy" decoding="async" />
            <span className="genre-drift-note" aria-hidden="true">
              <span className="genre-drift-note-title">
                {entry.title}
                {entry.rating ? (
                  <span className="genre-drift-note-stars">
                    <Stars rating={entry.rating} size={11} />
                  </span>
                ) : null}
              </span>
              {truncate(entry.excerpt, 96)}
            </span>
          </Link>
        ))}
      </Reveal>

      <Reveal className="relative z-[1] flex flex-col items-center text-center">
        <h2
          className="m-0 font-serif text-display leading-[0.95] font-medium tracking-[-0.02em] italic"
          style={{ color: panel.heading }}
        >
          {genre}
        </h2>
        <span
          className="mt-5 text-xs tracking-[0.18em] uppercase"
          style={{ color: panel.stat }}
        >
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
        </span>
        <IndexLink
          genre={genre}
          className="mt-8 inline-flex items-center gap-2 border-b-2 border-accent pb-2 text-xs font-semibold tracking-[0.14em] text-accent uppercase transition-colors hover:text-fg-bright"
        >
          See all {genre}
          <svg
            width="12"
            height="9"
            viewBox="0 0 12 9"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path d="M1 4.5h10M7 1l3.5 3.5L7 8" />
          </svg>
        </IndexLink>
      </Reveal>

      <div className="absolute bottom-10 z-[2]">
        <ScrollDown targetId={next} label={nextLabel} />
      </div>
    </section>
  );
}
