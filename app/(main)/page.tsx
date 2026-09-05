import { Suspense } from "react";
import Link from "next/link";
import PosterWall from "@/components/poster-wall";
import Reveal from "@/components/reveal";
import ScrollDown from "@/components/scroll-down";
import SocialLinks from "@/components/social-links";
import GenreSection from "@/components/genre-section";
import ReviewIndex from "@/components/review-index";
import HashTarget from "@/components/hash-target";
import { GENRES, type Genre } from "@/lib/genre";
import type { Review } from "@/lib/format";
import { getLandingQuote, getReviews } from "@/lib/reviews";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";

/* absolute, or the shared template would render "Ramyan Reviews . Ramyan Reviews". */
export const metadata: Metadata = {
  title: { absolute: SITE_NAME },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

/*
 * The landing page runs: hero, quote, one panel per genre, then the review
 * index itself. The index used to be a click away behind a closing panel, which
 * left no sign that there was anything below the fold; now the page simply
 * keeps going into it. /reviews is kept alive as a redirect here, so old
 * links and ?genre= still work, but there is only one index.
 */

export default async function LandingPage() {
  const reviews = await getReviews();
  const quote = await getLandingQuote();

  const byGenre = Object.fromEntries(
    GENRES.map((genre) => [
      genre,
      reviews.filter((review) => review.genre === genre),
    ]),
  ) as Record<Genre, Review[]>;

  const covers = reviews
    .map((review) => review.cover)
    .filter((cover): cover is string => Boolean(cover));

  const genreIds: Record<Genre, string> = {
    Books: "books",
    Film: "film",
    Anime: "anime",
  };

  return (
    <>
      <HashTarget />

      <main>
        {/* Hero */}
        <section
          id="top"
          className="panel relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-10 text-center"
        >
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
            <SocialLinks className="mt-9" />
          </div>

          <div className="absolute bottom-10 z-[1] flex flex-col items-center gap-4">
            <span className="text-xs tracking-[0.14em] text-fg-faint uppercase">
              Scroll
            </span>
            <ScrollDown targetId="quote" label="Down to the quote" />
          </div>
        </section>

        {/* The handpicked quote, edited in /keystatic under Landing quote. */}
        {quote ? (
          <section
            id="quote"
            className="panel relative flex min-h-screen flex-col items-center justify-center bg-ink px-6 py-20 text-center"
          >
            <Reveal>
              <div className="max-w-[760px]">
                <p className="mt-0 mb-7 font-serif text-2xl leading-[1.5] text-fg-bright italic">
                  &ldquo;{quote.text}&rdquo;
                </p>
                {quote.review ? (
                  <>
                    <p className="mb-8 text-sm text-fg-soft">
                      on <em className="font-serif">{quote.review.title}</em>,{" "}
                      {quote.review.subject}
                    </p>
                    <Link
                      href={`/reviews/${quote.review.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-accent uppercase transition-colors hover:text-fg-bright"
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
                  </>
                ) : null}
              </div>
            </Reveal>

            <div className="absolute bottom-10">
              <ScrollDown targetId="books" label="Down to Books" />
            </div>
          </section>
        ) : null}

        {GENRES.map((genre, index) => {
          const next = GENRES[index + 1];
          return (
            <GenreSection
              key={genre}
              genre={genre}
              reviews={byGenre[genre] ?? []}
              id={genreIds[genre]}
              next={next ? genreIds[next] : "all-reviews"}
              nextLabel={next ? `Down to ${next}` : "Down to all reviews"}
            />
          );
        })}

        {/*
          The index, on the same page rather than behind a click. The top
          padding is there because the bar is fixed and this panel snaps to the
          top of the viewport, so the heading has to clear it rather than sit
          underneath it.
        */}
        <section
          id="all-reviews"
          className="panel pt-24 pb-20 lg:pt-28 lg:pb-[120px]"
        >
          <div className="mx-auto max-w-[1420px] px-5 sm:px-10 lg:px-[72px]">
            <h2 className="m-0 font-serif text-xl leading-[1.15] font-medium tracking-[-0.01em] text-fg-bright lg:text-2xl">
              Reviews
            </h2>
            <p className="mt-3 mb-6 max-w-[560px] font-serif text-base leading-[1.5] text-fg-muted lg:text-lg">
              Everything so far. Search, filter by genre or rating, or change the
              order.
            </p>
          </div>
          <Suspense fallback={null}>
            <ReviewIndex reviews={reviews} />
          </Suspense>
        </section>
      </main>
    </>
  );
}
