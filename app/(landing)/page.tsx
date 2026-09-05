import Link from "next/link";
import Cover from "@/components/cover";
import LandingNav from "@/components/landing-nav";
import Reveal from "@/components/reveal";
import Stars from "@/components/stars";
import { GENRES, genrePanel, type Genre } from "@/lib/genre";
import type { Review } from "@/lib/format";
import { getReviews } from "@/lib/reviews";

const SHELF_ID: Record<Genre, string> = {
  Books: "books-shelf",
  Film: "film-shelf",
  Anime: "anime-shelf",
};

/** The closing pull-quote, taken from a real review rather than invented. */
const FEATURED = {
  slug: "kafka-on-the-shore",
  quote:
    "It's not about finding definitive answers, but about accepting life's uncertainties, and maybe listening to some Prince on the way.",
};

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
          <span className="mb-7 text-xs tracking-[0.28em] text-fg-faint uppercase">
            Ramyan Reviews
          </span>
          <h1 className="m-0 font-serif text-display leading-[0.95] font-medium tracking-[-0.01em] text-fg-bright italic">
            Ramyan
          </h1>
          <p className="mt-8 max-w-[540px] font-serif text-lg leading-[1.6] text-fg-quote">
            Books, films, and anime, reviewed as I finish them.
          </p>
          <div className="scroll-cue absolute bottom-12 flex flex-col items-center gap-2 text-fg-soft">
            <span className="text-xs tracking-[0.14em] uppercase">Scroll</span>
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

        {/* Genre split. Each panel jumps to its shelf below. */}
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
                          cover={review.cover}
                          className="w-12"
                          letterClassName="text-[22px]"
                          ring
                        />
                      </div>
                    ))}
                  </div>

                  <h2
                    className="m-0 font-serif text-xl font-medium"
                    style={{ color: panel.heading }}
                  >
                    {genre}
                  </h2>
                  <span
                    className="text-xs tracking-[0.08em] uppercase"
                    style={{ color: panel.stat }}
                  >
                    {entries.length}{" "}
                    {entries.length === 1 ? "review" : "reviews"} &rarr;
                  </span>
                </a>
              </Reveal>
            );
          })}
        </section>

        {/* Shelves */}
        {GENRES.map((genre) => (
          <Shelf key={genre} genre={genre} reviews={byGenre[genre] ?? []} />
        ))}

        {/* Featured quote */}
        {featured ? (
          <section className="panel flex min-h-screen flex-col items-center justify-center bg-ink px-6 py-20 text-center">
            <Reveal>
              <div className="max-w-[760px]">
                <p className="mt-0 mb-7 font-serif text-2xl leading-[1.5] text-fg-bright italic">
                  &ldquo;{FEATURED.quote}&rdquo;
                </p>
                <p className="mb-8 text-sm text-fg-soft">
                  on <em className="font-serif">{featured.title}</em>,{" "}
                  {featured.subject}
                </p>
                <Link
                  href={`/reviews/${featured.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-accent uppercase"
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
        <section className="panel flex min-h-screen flex-col items-center justify-center gap-10 bg-ink px-6 py-20 text-center">
          <Reveal>
            <span className="font-serif text-display font-medium text-fg-bright italic">
              Ramyan Reviews
            </span>
          </Reveal>
          <Reveal delay={2}>
            <Link
              href="/reviews"
              className="inline-flex items-center gap-3 rounded-full border border-accent px-10 py-[18px] text-xs font-semibold tracking-[0.1em] text-accent uppercase transition-colors hover:bg-[color-mix(in_srgb,var(--color-accent)_14%,transparent)]"
            >
              Browse all {reviews.length} reviews
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

function Shelf({ genre, reviews }: { genre: Genre; reviews: Review[] }) {
  const panel = genrePanel(genre);
  const shelf = reviews.slice(0, 5);

  return (
    <section
      id={SHELF_ID[genre]}
      className="panel flex min-h-screen flex-col justify-center bg-shelf px-6 py-24 sm:px-10 lg:px-[72px]"
    >
      <Reveal>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-5 border-b border-rule pb-6">
          <h2
            className="m-0 font-serif text-2xl leading-none font-medium"
            style={{ color: panel.heading }}
          >
            {genre}
          </h2>
          <Link
            href={`/reviews?genre=${genre.toLowerCase()}`}
            className="text-xs font-semibold tracking-[0.08em] text-accent uppercase"
          >
            All {genre} &rarr;
          </Link>
        </div>

        {shelf.length === 0 ? (
          <p className="font-serif text-lg text-fg-muted">Nothing here yet.</p>
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
                  cover={review.cover}
                  letterClassName="text-[56px]"
                />
                <h3 className="line-clamp-2 font-serif text-base leading-[1.3] font-medium text-fg-title transition-colors group-hover:text-accent">
                  {review.title}
                </h3>
                {review.rating ? <Stars rating={review.rating} /> : null}
              </Link>
            ))}
          </div>
        )}
      </Reveal>
    </section>
  );
}
