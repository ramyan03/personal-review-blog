"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Cover from "@/components/cover";
import ReviewCard from "@/components/review-card";
import GenreTag from "@/components/genre-tag";
import Stars from "@/components/stars";
import { ChevronDownIcon } from "@/components/icons";
import { GENRES, type Genre } from "@/lib/genre";
import { formatDate, type Review } from "@/lib/format";
import { useSlidingRule } from "@/lib/use-sliding-rule";

type GenreFilter = Genre | "All";
type Sort = "newest" | "oldest" | "rating";

const SORTS: { value: Sort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "rating", label: "Highest rated" },
];

const RATINGS: { value: number; label: string }[] = [
  { value: 0, label: "Any" },
  { value: 3, label: "3 & up" },
  { value: 4, label: "4 & up" },
  { value: 4.5, label: "4.5 & up" },
  { value: 5, label: "5 only" },
];

const FEATURED_COUNT = 3;
const FILTERS = ["All", ...GENRES] as GenreFilter[];

export default function ReviewIndex({ reviews }: { reviews: Review[] }) {
  // Genre and the search term come from the URL, which is what lets this page
  // stay static: nothing is resolved on the server.
  const params = useSearchParams();
  const [genre, setGenre] = useState<GenreFilter>("All");
  const [query, setQuery] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<Sort>("newest");

  useEffect(() => {
    const wanted = params.get("genre");
    setGenre(
      GENRES.find((option) => option.toLowerCase() === wanted?.toLowerCase()) ??
        "All",
    );
    setQuery(params.get("q") ?? "");
  }, [params]);

  const rule = useSlidingRule<HTMLButtonElement>(FILTERS.indexOf(genre));

  const anyRated = useMemo(
    () => reviews.some((review) => review.rating != null),
    [reviews],
  );

  const untouched =
    genre === "All" && minRating === 0 && query.trim() === "" && sort === "newest";

  // The newest three keep their place at the top whatever is filtered below, so
  // filtering never pulls the page out from under you.
  const featured = useMemo(() => reviews.slice(0, FEATURED_COUNT), [reviews]);
  const featuredSlugs = useMemo(
    () => new Set(featured.map((review) => review.slug)),
    [featured],
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = reviews.filter(
      (review) =>
        !featuredSlugs.has(review.slug) &&
        (genre === "All" || review.genre === genre) &&
        (minRating === 0 || (review.rating ?? 0) >= minRating) &&
        (needle === "" ||
          review.title.toLowerCase().includes(needle) ||
          review.subject.toLowerCase().includes(needle) ||
          review.excerpt.toLowerCase().includes(needle)),
    );

    return filtered.sort((a, b) => {
      if (sort === "rating") {
        return (b.rating ?? 0) - (a.rating ?? 0) || b.date.localeCompare(a.date);
      }
      if (sort === "oldest") return a.date.localeCompare(b.date);
      return b.date.localeCompare(a.date);
    });
  }, [reviews, genre, query, minRating, sort, featuredSlugs]);

  // The one or two sentence entries sit under their own heading rather than
  // among pieces ten times their length.
  const full = visible.filter((review) => !review.short);
  const shorts = visible.filter((review) => review.short);

  return (
    <>
      {featured.length > 0 ? (
        <section className="px-5 pt-2 pb-14 sm:px-10 lg:px-[72px] lg:pb-20">
          <div className="mx-auto max-w-[1120px]">
            <h2 className="mb-2 border-b border-rule pb-4 text-xs font-semibold tracking-[0.16em] text-fg-dim uppercase">
              Latest
            </h2>
            <div className="flex flex-col">
              {featured.map((review, index) => (
                <FeaturedReview
                  key={review.slug}
                  review={review}
                  flip={index % 2 === 1}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <div className="mx-auto flex max-w-[1420px] flex-wrap items-end justify-between gap-x-8 gap-y-5 border-b border-rule px-5 pb-4 sm:px-10 lg:px-[72px]">
        <nav
          ref={rule.trackRef as React.RefObject<HTMLElement>}
          aria-label="Filter by genre"
          className="relative -mx-5 flex gap-6 overflow-x-auto px-5 sm:mx-0 sm:px-0 lg:gap-8"
        >
          {FILTERS.map((option, index) => {
            const active = option === genre;
            return (
              <button
                key={option}
                ref={(node) => {
                  rule.itemRefs.current[index] = node;
                }}
                type="button"
                onClick={() => setGenre(option)}
                aria-pressed={active}
                className={`flex-none cursor-pointer pb-3 font-serif text-lg transition-colors ${
                  active ? "text-fg-bright" : "text-fg-muted hover:text-fg"
                }`}
              >
                {option}
              </button>
            );
          })}

          {/* One rule for the row, so switching genre slides it across, the
              same way the header nav moves between Reviews and About. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 h-[2px] bg-accent"
            style={rule.style}
          />
        </nav>

        <div className="flex items-center gap-5 pb-3 lg:gap-6">
          {anyRated ? (
            <>
              <SelectControl
                label="Rating"
                value={String(minRating)}
                onChange={(value) => setMinRating(Number(value))}
                options={RATINGS.map((r) => ({
                  value: String(r.value),
                  label: r.label,
                }))}
              />
              <div className="h-4 w-px bg-hairline" />
            </>
          ) : null}
          <SelectControl
            label="Sort"
            value={sort}
            onChange={(value) => setSort(value as Sort)}
            options={anyRated ? SORTS : SORTS.filter((s) => s.value !== "rating")}
          />
        </div>
      </div>

      <div className="mx-auto max-w-[1420px] px-5 sm:px-10 lg:px-[72px]">
        <div className="pt-7 pb-2 text-xs tracking-[0.08em] text-fg-dim uppercase sm:pb-0">
          {untouched
            ? `${visible.length} more`
            : `${visible.length} ${visible.length === 1 ? "review" : "reviews"}`}
          {query.trim() ? ` matching "${query.trim()}"` : ""}
        </div>

        {visible.length === 0 ? (
          <p className="py-16 font-serif text-lg text-fg-muted">
            No reviews match
            {query.trim() ? ` "${query.trim()}"` : " those filters"}.
          </p>
        ) : null}

        {/*
          Three columns, not four. At four the covers were small enough that
          the index read as a database of thumbnails; at three they are large
          enough to be looked at, which is the point of a shelf of artwork.
        */}
        {full.length > 0 ? (
          <div className="grid grid-cols-1 sm:mt-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 md:grid-cols-3 lg:gap-x-10 lg:gap-y-14">
            {full.map((review) => (
              <ReviewCard key={review.slug} review={review} />
            ))}
          </div>
        ) : null}

        {shorts.length > 0 ? (
          <section className="mt-16 lg:mt-20">
            <h2 className="mb-1 border-b border-rule pb-4 text-xs font-semibold tracking-[0.16em] text-fg-dim uppercase">
              Short takes
            </h2>
            <p className="mt-4 mb-2 max-w-[52ch] font-serif text-base text-fg-muted">
              A couple of sentences and a line worth keeping.
            </p>
            <ul className="m-0 grid list-none grid-cols-1 gap-x-8 p-0 md:grid-cols-2">
              {shorts.map((review) => (
                <ShortTake key={review.slug} review={review} />
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  );
}

/**
 * The newest few reviews, given room: cover on one side, the writing on the
 * other, alternating sides down the page. The column order flips with the
 * layout, so a flipped row puts its cover flush to the right edge instead of
 * stranding it at the left of a wide column.
 */
function FeaturedReview({ review, flip }: { review: Review; flip: boolean }) {
  return (
    <article
      className={`grid items-center gap-6 border-b border-row py-9 sm:gap-12 sm:py-12 lg:gap-16 ${
        flip
          ? "sm:grid-cols-[minmax(0,1fr)_minmax(0,300px)]"
          : "sm:grid-cols-[minmax(0,300px)_minmax(0,1fr)]"
      }`}
    >
      <Link
        href={`/reviews/${review.slug}`}
        className={`block w-[46%] max-w-[300px] sm:w-full ${
          flip ? "sm:order-2" : ""
        }`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <Cover
          title={review.title}
          genre={review.genre}
          cover={review.cover}
          letterClassName="text-[92px]"
          sizes="(min-width: 640px) 300px, 46vw"
        />
      </Link>

      <div className={flip ? "sm:order-1" : ""}>
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <GenreTag genre={review.genre} />
          <span className="text-xs text-fg-faint">
            Ramyan Chelva &middot; {formatDate(review.date)}
          </span>
        </div>

        <h3 className="m-0 font-serif text-xl leading-[1.12] font-medium tracking-[-0.01em] text-fg-bright lg:text-2xl">
          <Link
            href={`/reviews/${review.slug}`}
            className="transition-colors hover:text-accent"
          >
            {review.title}
          </Link>
        </h3>

        <p className="mt-2 font-serif text-base text-fg-quote italic lg:text-lg">
          {review.subject}
        </p>

        {review.rating ? (
          <div className="mt-4">
            <Stars rating={review.rating} size={15} />
          </div>
        ) : null}

        <p className="mt-5 max-w-[52ch] font-serif text-base leading-[1.6] text-fg-body lg:text-lg">
          {review.excerpt}
        </p>

        <Link
          href={`/reviews/${review.slug}`}
          className="mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.1em] text-accent uppercase"
        >
          Read the review
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
    </article>
  );
}

/**
 * A short entry shown whole rather than teased, since the excerpt would be
 * most of it anyway.
 */
function ShortTake({ review }: { review: Review }) {
  return (
    <li className="border-b border-row py-7">
      <Link href={`/reviews/${review.slug}`} className="group block">
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <GenreTag genre={review.genre} />
          <span className="text-xs text-fg-faint">
            {formatDate(review.date)}
          </span>
          {review.rating ? (
            <span className="ml-auto">
              <Stars rating={review.rating} size={13} />
            </span>
          ) : null}
        </div>
        <h3 className="m-0 font-serif text-base leading-[1.2] font-medium text-fg-bright transition-colors group-hover:text-accent">
          {review.title}
        </h3>
        <p className="mt-1 font-serif text-sm text-fg-quote italic">
          {review.subject}
        </p>
        <p className="mt-3 max-w-[52ch] font-serif text-base leading-[1.6] text-fg-body">
          {review.excerpt}
        </p>
      </Link>
    </li>
  );
}

function SelectControl({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  const current = options.find((option) => option.value === value);

  return (
    <label className="flex items-center gap-2 text-xs tracking-[0.06em] text-fg-muted uppercase">
      <span>{label}</span>
      <span className="relative inline-flex items-center gap-2">
        <span className="text-xs font-semibold tracking-normal text-fg-bright normal-case">
          {current?.label ?? ""}
        </span>
        <ChevronDownIcon />
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label={label}
          className="absolute inset-0 w-full cursor-pointer opacity-0"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}
