import { Suspense } from "react";
import Link from "next/link";
import CountBeat from "@/components/count-beat";
import Eyebrow from "@/components/eyebrow";
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
 * The landing page runs: hero, quote, the count, one panel per genre, then the
 * review index itself. The index used to be a click away behind a closing panel, which
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
            <SocialLinks className="mt-9" />
          </div>

          {/*
            The corner rail. mesh3d anchors its labels to the four corners and
            never moves them, which leaves the middle of the screen to the
            title and makes the hero read as a frame rather than as the top of
            a page.

            Only the bottom two corners are used. The header is fixed on this
            route and fades in over the top two as soon as you scroll, so
            anything put up there would either collide with it or have to
            duplicate the scroll cue that is already at the foot. The count
            moved out of the centre column and into the right corner: it now
            has a whole panel of its own further down, and stating it twice in
            one screen was neither emphasis nor information.
          */}
          <div className="absolute inset-x-0 bottom-10 z-[1] flex items-end justify-between px-6 sm:px-10 lg:px-[72px]">
            <Eyebrow className="hidden sm:block">Since 2023</Eyebrow>

            <div className="flex flex-1 flex-col items-center gap-4">
              <Eyebrow>Scroll</Eyebrow>
              <ScrollDown targetId="quote" label="Down to the quote" />
            </div>

            <Eyebrow tone="accent" className="hidden sm:block">
              {reviews.length} reviews
            </Eyebrow>
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
              <ScrollDown targetId="counts" label="Down to the count" />
            </div>
          </section>
        ) : null}

        {/*
          How much of it there is, given a screen. mesh3d spends a whole
          viewport on each of its figures and assembles the digits out of a
          particle field; this is the same beat at the scale a reading site can
          carry, and it replaces the one line of small caps that used to state
          the total in the hero.
        */}
        <section
          id="counts"
          className="panel relative flex min-h-screen flex-col items-center justify-center bg-ink px-6 py-20"
        >
          <Reveal className="flex w-full flex-col items-center">
            <Eyebrow className="mb-12 text-center">Everything so far</Eyebrow>
            <CountBeat
              beats={[
                {
                  value: reviews.length,
                  label: "Reviews",
                  note: "Everything published since 2023.",
                },
                {
                  value: byGenre.Books?.length ?? 0,
                  label: "Books",
                  note: "Novels, mostly finished on the GO.",
                },
                {
                  value: byGenre.Film?.length ?? 0,
                  label: "Film",
                  note: "Seen in a cinema wherever possible.",
                },
                {
                  value: byGenre.Anime?.length ?? 0,
                  label: "Anime",
                  note: "Series and features together.",
                },
              ]}
            />
          </Reveal>

          <div className="absolute bottom-10">
            <ScrollDown targetId="books" label="Down to Books" />
          </div>
        </section>

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
            <Eyebrow className="mb-4">The index</Eyebrow>
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
