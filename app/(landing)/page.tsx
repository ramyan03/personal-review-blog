import Link from "next/link";
import LandingNav from "@/components/landing-nav";
import PosterWall from "@/components/poster-wall";
import Reveal from "@/components/reveal";
import { GENRES, genrePanel, type Genre } from "@/lib/genre";
import { truncate, type Review } from "@/lib/format";
import { getReviews } from "@/lib/reviews";

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
  const covers = reviews
    .map((review) => review.cover)
    .filter((cover): cover is string => Boolean(cover));

  return (
    <>
      <LandingNav />

      <main>
        {/* Hero */}
        <section className="panel relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-10 text-center">
          <PosterWall covers={covers} />

          <div className="relative z-[1] flex flex-col items-center">
            <h1 className="m-0 max-w-[13ch] font-serif text-display leading-[0.92] font-medium tracking-[-0.02em] text-fg-bright italic">
              Ramyan Reviews
            </h1>
            <p className="mt-8 max-w-[520px] font-serif text-lg leading-[1.6] text-fg-quote">
              Books, films, and anime, reviewed as I finish them.
            </p>
            <span className="mt-7 text-xs tracking-[0.18em] text-fg-faint uppercase">
              {reviews.length} reviews since 2023
            </span>
          </div>

          <div className="scroll-cue absolute bottom-12 z-[1] flex flex-col items-center gap-2 text-fg-soft">
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

        {/* Genre split. Each panel goes straight to that genre in the index. */}
        <section className="panel grid min-h-screen grid-cols-1 md:grid-cols-3">
          {GENRES.map((genre, index) => {
            const panel = genrePanel(genre);
            const entries = byGenre[genre] ?? [];
            const drift = entries.filter((entry) => entry.cover).slice(0, 4);

            return (
              <Reveal
                key={genre}
                delay={index === 1 ? 2 : index === 2 ? 3 : undefined}
                className="flex"
              >
                <Link
                  href={`/reviews?genre=${genre.toLowerCase()}`}
                  className="group relative flex w-full flex-col items-start justify-end overflow-hidden px-8 py-16 lg:px-12 lg:py-20"
                  style={{ background: panel.background }}
                >
                  {/* Covers from this genre, floating behind the label. Hover
                      one and it comes forward with a line from the review. */}
                  <div className="genre-drift" aria-hidden="true">
                    {drift.map((entry, i) => (
                      <span
                        key={entry.slug}
                        className={`genre-drift-item genre-drift-${i + 1}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={entry.cover ?? ""}
                          alt=""
                          loading="lazy"
                          decoding="async"
                        />
                        <span className="genre-drift-note">
                          <span className="genre-drift-note-title">
                            {entry.title}
                          </span>
                          {truncate(entry.excerpt, 96)}
                        </span>
                      </span>
                    ))}
                  </div>

                  <div className="relative z-[1]">
                    <h2
                      className="m-0 font-serif text-2xl leading-none font-medium"
                      style={{ color: panel.heading }}
                    >
                      {genre}
                    </h2>
                    <span
                      className="mt-4 block text-xs tracking-[0.14em] uppercase transition-colors group-hover:text-accent"
                      style={{ color: panel.stat }}
                    >
                      {entries.length}{" "}
                      {entries.length === 1 ? "review" : "reviews"} &rarr;
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </section>

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
              className="inline-flex items-center gap-3 border-b-2 border-accent pb-3 text-xs font-semibold tracking-[0.16em] text-accent uppercase transition-colors hover:text-fg-bright"
            >
              See all {reviews.length} reviews
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
