import Link from "next/link";
import Cover from "@/components/cover";
import LandingNav from "@/components/landing-nav";
import Reveal from "@/components/reveal";
import { GENRES, genrePanel, genreTheme, type Genre } from "@/lib/genre";
import type { Review } from "@/lib/format";
import { getReviews } from "@/lib/reviews";

const GENRE_BLURB: Record<Genre, string> = {
  Books: "Fiction mostly, read cover to cover before a word gets written.",
  Film: "New releases and old favourites, watched twice before anything is posted.",
  Anime: 'Series and films both, judged on their own terms — not as "just cartoons."',
};

const SHELF_ID: Record<Genre, string> = {
  Books: "books-shelf",
  Film: "film-shelf",
  Anime: "anime-shelf",
};

/** The line pulled out for the closing quote panel, tied to a real entry. */
const FEATURED = {
  slug: "the-remains-of-the-day",
  quote:
    "What can we ever gain in forever looking back and blaming ourselves if our lives have not turned out quite as we might have wished?",
};

const SHELF_BG = "oklch(0.195 0.008 55)";

export default async function LandingPage() {
  const reviews = await getReviews();
  const byGenre = Object.fromEntries(
    GENRES.map((genre) => [
      genre,
      reviews.filter((review) => review.genre === genre),
    ]),
  ) as Record<Genre, Review[]>;
  const featured = reviews.find((review) => review.slug === FEATURED.slug);

  return (
    <>
      <LandingNav />

      <main>
        {/* Hero */}
        <section className="panel relative flex min-h-screen flex-col items-center justify-center px-6 py-10 text-center">
          <span className="mb-7 text-[11px] tracking-[0.28em] text-fg-faint uppercase">
            Ramyan Reviews
          </span>
          <h1 className="m-0 font-serif text-[clamp(64px,12vw,168px)] leading-[0.95] font-medium tracking-[-0.01em] text-fg-bright italic">
            Ramyan
          </h1>
          <p className="mt-8 max-w-[540px] font-serif text-[20px] leading-[1.6] text-[oklch(0.63_0.01_55)] italic">
            A personal log of books, films, and anime — read slowly, watched
            twice.
          </p>
          <div className="scroll-cue absolute bottom-12 flex flex-col items-center gap-2 text-[oklch(0.55_0.01_55)]">
            <span className="text-[10px] tracking-[0.14em] uppercase">
              Scroll
            </span>
            <svg
              width="14"
              height="9"
              viewBox="0 0 14 9"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path d="M1 1l6 6 6-6" />
            </svg>
          </div>
        </section>

        {/* Genre split — each panel jumps to its shelf below */}
        <section className="panel grid min-h-screen grid-cols-1 md:grid-cols-3">
          {GENRES.map((genre, index) => {
            const panel = genrePanel(genre);
            const entries = byGenre[genre] ?? [];
            return (
              <Reveal
                key={genre}
                delay={index === 1 ? 2 : index === 2 ? 3 : undefined}
                className="flex"
              >
                <a
                  href={`#${SHELF_ID[genre]}`}
                  className="group flex w-full flex-col items-start justify-center gap-[14px] px-8 py-16 lg:px-12"
                  style={{ background: panel.background }}
                >
                  <span
                    className="font-serif text-[15px] italic"
                    style={{ color: panel.kicker }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="flex items-end py-1">
                    {entries.slice(0, 3).map((review, i) => (
                      <div
                        key={review.slug}
                        className={i > 0 ? "-ml-4" : ""}
                        style={{
                          transform: `translateY(${i * 5}px)`,
                          zIndex: 3 - i,
                        }}
                      >
                        <Cover
                          title={review.title}
                          genre={genre}
                          className="w-12"
                          letterClassName="text-[22px]"
                          ring
                        />
                      </div>
                    ))}
                  </div>

                  <h3
                    className="m-0 font-serif text-[34px] font-medium"
                    style={{ color: panel.heading }}
                  >
                    {genre}
                  </h3>
                  <p
                    className="m-0 max-w-[260px] text-[14px] leading-[1.6]"
                    style={{ color: panel.body }}
                  >
                    {GENRE_BLURB[genre]}
                  </p>
                  <span
                    className="text-[11px] tracking-[0.08em] uppercase"
                    style={{ color: panel.stat }}
                  >
                    {entries.length}{" "}
                    {entries.length === 1 ? "review" : "reviews"} →
                  </span>
                </a>
              </Reveal>
            );
          })}
        </section>

        {/* Shelves */}
        {GENRES.map((genre, index) => (
          <Shelf
            key={genre}
            genre={genre}
            index={index}
            reviews={byGenre[genre] ?? []}
          />
        ))}

        {/* Featured quote */}
        {featured ? (
          <section className="panel flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center">
            <Reveal>
              <div className="max-w-[760px]">
                <span
                  className="mb-8 inline-flex items-center rounded-full border px-[11px] py-[5px] text-[10px] font-semibold tracking-[0.08em] uppercase"
                  style={{
                    background: genreTheme(featured.genre).pillBg,
                    color: genreTheme(featured.genre).pillColor,
                    borderColor: genreTheme(featured.genre).pillBorder,
                  }}
                >
                  {featured.genre} · {featured.rating} / 5
                </span>
                <p className="mt-0 mb-7 font-serif text-[clamp(24px,3.4vw,36px)] leading-[1.5] text-[oklch(0.9_0.006_55)] italic">
                  “{FEATURED.quote}”
                </p>
                <p className="mb-8 text-[14px] text-fg-soft">
                  on <em className="font-serif">{featured.title}</em>,{" "}
                  {featured.subject}
                </p>
                <Link
                  href={`/reviews/${featured.slug}`}
                  className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.08em] text-accent uppercase"
                >
                  Read the full review
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
                </Link>
              </div>
            </Reveal>
          </section>
        ) : null}

        {/* Closing */}
        <section className="panel flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-20 text-center">
          <Reveal>
            <span className="font-serif text-[clamp(40px,6vw,72px)] font-medium text-fg-bright italic">
              Ramyan Reviews
            </span>
          </Reveal>
          <Reveal delay={2}>
            <Link
              href="/reviews"
              className="inline-flex items-center gap-3 rounded-full border border-accent px-10 py-[18px] text-[13px] font-semibold tracking-[0.1em] text-accent uppercase transition-colors hover:bg-[color-mix(in_srgb,var(--color-accent)_14%,transparent)]"
            >
              Enter the Index
              <svg
                width="14"
                height="10"
                viewBox="0 0 14 10"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path d="M1 5h12M8 1l4 4-4 4" />
              </svg>
            </Link>
          </Reveal>
        </section>
      </main>
    </>
  );
}

function Shelf({
  genre,
  index,
  reviews,
}: {
  genre: Genre;
  index: number;
  reviews: Review[];
}) {
  const panel = genrePanel(genre);
  const shelf = reviews.slice(0, 5);

  return (
    <section
      id={SHELF_ID[genre]}
      className="panel flex min-h-screen flex-col justify-center px-6 py-24 sm:px-10 lg:px-[72px]"
      style={{ background: SHELF_BG }}
    >
      <Reveal>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-5 border-b border-rule pb-6">
          <div className="flex items-baseline gap-4">
            <span
              className="font-serif text-[15px] italic"
              style={{ color: panel.kicker }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h2
              className="m-0 font-serif text-[36px] leading-none font-medium lg:text-[44px]"
              style={{ color: panel.heading }}
            >
              {genre}
            </h2>
          </div>
          <Link
            href={`/reviews?genre=${genre.toLowerCase()}`}
            className="text-[12px] font-semibold tracking-[0.08em] text-accent uppercase"
          >
            Browse all {genre} →
          </Link>
        </div>

        {shelf.length === 0 ? (
          <p className="font-serif text-[19px] text-fg-muted italic">
            Nothing shelved here yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
            {shelf.map((review) => (
              <Link
                key={review.slug}
                href={`/reviews/${review.slug}`}
                className="group flex flex-col gap-3"
              >
                <Cover
                  title={review.title}
                  genre={genre}
                  letterClassName="text-[56px]"
                />
                <h3 className="line-clamp-2 font-serif text-[16px] leading-[1.3] font-medium text-fg-title transition-colors group-hover:text-accent">
                  {review.title}
                </h3>
                <span className="truncate text-[12px] text-fg-muted">
                  {review.subject}
                </span>
              </Link>
            ))}
          </div>
        )}
      </Reveal>
    </section>
  );
}
