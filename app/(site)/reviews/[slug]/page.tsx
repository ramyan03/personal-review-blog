import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocumentRenderer } from "@keystatic/core/renderer";
import GenreTag from "@/components/genre-tag";
import Stars from "@/components/stars";
import { ArrowLeftIcon } from "@/components/icons";
import { reader } from "@/lib/reader";
import { byline, formatDate } from "@/lib/format";
import { getReview, getReviews } from "@/lib/reviews";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await reader.collections.reviews.list();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const review = await getReview(slug);
  if (!review) return {};
  return { title: review.title, description: review.excerpt };
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
        href="/reviews"
        className="mb-10 inline-flex items-center gap-2 text-[12px] tracking-[0.1em] text-fg-soft uppercase transition-colors hover:text-fg lg:mb-14"
      >
        <ArrowLeftIcon />
        Back to Index
      </Link>

      <div className="mb-[22px] flex items-center gap-[14px]">
        <GenreTag genre={review.genre} size="md" />
        <span className="text-[12px] text-fg-faint">
          {formatDate(review.date)}
        </span>
      </div>

      <h1 className="mb-4 font-serif text-[32px] leading-[1.15] font-medium tracking-[-0.01em] text-fg-bright sm:text-[38px] lg:text-[44px]">
        {review.title}
      </h1>
      <p className="mb-8 font-serif text-[17px] text-[oklch(0.63_0.01_55)] italic lg:text-[19px]">
        {byline(review)}
      </p>

      <div className="mb-11 flex items-center gap-[14px] border-b border-rule pb-9">
        <Stars rating={review.rating} size={18} />
        <span className="text-[13px] text-fg-faint">{review.rating} / 5</span>
      </div>

      <article className="review-body">
        <DocumentRenderer document={review.body} />
      </article>

      <nav className="mt-[72px] flex items-center justify-between gap-6 border-t border-rule pt-8 text-[13px] text-fg-soft">
        {newer ? (
          <Link
            href={`/reviews/${newer.slug}`}
            className="max-w-[45%] truncate transition-colors hover:text-fg"
          >
            ← {newer.title}
          </Link>
        ) : (
          <span />
        )}
        {older ? (
          <Link
            href={`/reviews/${older.slug}`}
            className="max-w-[45%] truncate text-right transition-colors hover:text-fg"
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
