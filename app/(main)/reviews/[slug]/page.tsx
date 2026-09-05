import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocumentRenderer } from "@keystatic/core/renderer";
import Cover from "@/components/cover";
import GenreTag from "@/components/genre-tag";
import MoreInGenre from "@/components/more-in-genre";
import Stars, { formatRating } from "@/components/stars";
import { ArrowLeftIcon } from "@/components/icons";
import { reader } from "@/lib/reader";
import { byline, formatDate } from "@/lib/format";
import { getReview, getReviews } from "@/lib/reviews";
import { REVIEWS_HREF } from "@/lib/links";
import { SITE_NAME } from "@/lib/site";

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

  const all = await getReviews();
  const index = all.findIndex((item) => item.slug === slug);
  const newer = index > 0 ? all[index - 1] : null;
  const older = index >= 0 && index < all.length - 1 ? all[index + 1] : null;

  return (
    <main className="mx-auto max-w-[680px] px-5 pt-8 pb-24 sm:px-6 lg:pt-12 lg:pb-[140px]">
      <Link
        href={REVIEWS_HREF}
        className="mb-10 inline-flex items-center gap-2 text-xs tracking-[0.1em] text-fg-soft uppercase transition-colors hover:text-fg lg:mb-14"
      >
        <ArrowLeftIcon />
        All reviews
      </Link>

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
        </div>
      </div>

      <article className="review-body">
        <DocumentRenderer document={review.body} />
      </article>

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
    </main>
  );
}

