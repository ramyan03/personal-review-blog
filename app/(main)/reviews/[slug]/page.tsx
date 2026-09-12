import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Cover from "@/components/cover";
import ReviewBody from "@/components/review-body";
import GenreTag from "@/components/genre-tag";
import MoreInGenre from "@/components/more-in-genre";
import Stars, { formatRating } from "@/components/stars";
import BackToIndex from "@/components/back-to-index";
import { reader } from "@/lib/reader";
import { byline, formatDate } from "@/lib/format";
import { readsUrl } from "@/lib/reads";
import { getReview, getReviews } from "@/lib/reviews";
import { REVIEWS_HREF } from "@/lib/links";
import { SITE_NAME } from "@/lib/site";
import { artworkDimensions } from "@/lib/artwork";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await reader.collections.reviews.list();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const review = await getReview(slug);
  if (!review) return {};

  /*
   * Shared into a feed, a review should preview as itself: its own artwork and
   * its own opening line. Without this every link on the site produced the
   * same generic card, which is what a link with nothing behind it looks like.
   */
  const description = review.excerpt;

  // No images here on purpose: opengraph-image.tsx in this folder composes the
  // card, and setting images explicitly would override it with the bare cover.
  return {
    title: review.title,
    description,
    alternates: { canonical: "/reviews/" + slug },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      title: review.title,
      description,
      url: "/reviews/" + slug,
      publishedTime: review.date || undefined,
      authors: ["Ramyan Chelva"],
    },
    twitter: {
      card: "summary_large_image",
      title: review.title,
      description,
    },
  };
}

export default async function ReviewPage({ params }: Params) {
  const { slug } = await params;
  const review = await getReview(slug);
  if (!review) notFound();

  const [all, sizes] = await Promise.all([getReviews(), artworkDimensions()]);
  const readsHref = readsUrl(slug);
  const index = all.findIndex((item) => item.slug === slug);
  const newer = index > 0 ? all[index - 1] : null;
  const older = index >= 0 && index < all.length - 1 ? all[index + 1] : null;

  return (
    <main className="review-page mx-auto px-5 pt-8 pb-24 sm:px-6 lg:pt-12 lg:pb-[140px]">
      <BackToIndex className="mb-10 inline-flex items-center gap-2 text-xs tracking-[0.1em] text-fg-soft uppercase transition-colors hover:text-fg lg:mb-14" />

      {/*
        The writing is centred, with a running rail hanging in the left margin.
        The rail used to push the column right of centre, because its track and
        gutter were only ever added on one side; an empty track of the same
        width on the right now balances it.

        The rail is not a copy of the header beside it. The header is read once
        on arrival and then scrolled past, so on a long review nothing on
        screen says any longer what is being reviewed or what it scored. The
        rail is sticky and says exactly that, which is the argument for moving
        the column in the first place.

        Below 1024px the rail is not rendered at all rather than stacked: the
        header has just said all of it, and repeating it immediately underneath
        on a phone is noise. Everything else keeps the measure it had.
      */}
      <div className="review-offset">
        <aside className="review-rail" aria-hidden="true">
          <GenreTag genre={review.genre} />
          <p className="mt-3 mb-0 font-serif text-base leading-[1.3] font-medium text-fg-title">
            {review.title}
          </p>
          {review.rating ? (
            <div className="mt-3 flex items-center justify-end gap-2">
              <Stars rating={review.rating} />
              <span className="text-xs text-fg-faint">
                {formatRating(review.rating)} / 5
              </span>
            </div>
          ) : null}
          <p className="mt-3 mb-0 text-xs tracking-[0.14em] text-fg-faint uppercase">
            {formatDate(review.date)}
          </p>
        </aside>

        <div className="review-column">
      {/*
        The artwork leads the review, beside the title rather than above it.
        Every other surface on the site shows a review as its cover, so arriving
        at the review itself and finding no picture of the thing being reviewed
        was the one place that broke.
      */}
      <div className="mb-11 flex flex-col gap-6 border-b border-rule pb-9 sm:flex-row sm:items-center sm:gap-8">
        <Cover
          title={review.title}
          genre={review.genre}
          cover={review.cover}
          className="w-[132px] flex-none sm:w-[168px]"
          priority
          letterClassName="text-[64px]"
          sizes="(min-width: 640px) 168px, 132px"
        />

        <div className="min-w-0">
          <div className="mb-[18px] flex flex-wrap items-center gap-x-[14px] gap-y-2">
            <GenreTag genre={review.genre} size="md" />
            <span className="text-xs text-fg-faint">
              Ramyan Chelva &middot; {formatDate(review.date)}
            </span>
          </div>

          <h1 className="mb-3 font-serif text-xl leading-[1.15] font-medium tracking-[-0.01em] text-fg-bright lg:text-2xl">
            {review.title}
          </h1>
          <p className="font-serif text-base text-fg-quote italic lg:text-lg">
            {byline(review)}
          </p>

          {review.rating ? (
            <div className="mt-5 flex items-center gap-[14px]">
              <Stars rating={review.rating} size={18} />
              <span className="text-sm text-fg-faint">
                {formatRating(review.rating)} / 5
              </span>
            </div>
          ) : null}

          {/*
            Across to the reading list, for books that are on it. Deliberately
            in the same quiet register as the byline above rather than as a
            promoted link: it is a fact about this book, not an advert for the
            other site.
          */}
          {readsHref ? (
            <p className="mt-5">
              <a
                href={readsHref}
                className="border-b border-hairline pb-px text-sm text-fg-muted transition-colors hover:border-accent hover:text-accent"
              >
                In my reading list &rarr;
              </a>
            </p>
          ) : null}
        </div>
      </div>

      <ReviewBody document={review.body} sizes={sizes} />

      <MoreInGenre genre={review.genre} currentSlug={slug} reviews={all} />

      <nav className="mt-14 flex items-center justify-between gap-6 border-t border-rule pt-8 text-sm text-fg-soft">
        {newer ? (
          <Link
            href={`/reviews/${newer.slug}`}
            className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-normal [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1] transition-colors hover:text-fg"
          >
            ← {newer.title}
          </Link>
        ) : (
          <span />
        )}
        {older ? (
          <Link
            href={`/reviews/${older.slug}`}
            className="min-w-0 flex-1 overflow-hidden text-right text-ellipsis whitespace-normal [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1] transition-colors hover:text-fg"
          >
            {older.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
        </div>
      </div>
    </main>
  );
}

