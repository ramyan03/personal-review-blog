"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ReviewCard from "@/components/review-card";
import { ChevronDownIcon } from "@/components/icons";
import { GENRES, type Genre } from "@/lib/genre";
import type { Review } from "@/lib/format";

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

  // The rating controls only make sense once something carries a rating.
  const anyRated = useMemo(
    () => reviews.some((review) => review.rating != null),
    [reviews],
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = reviews.filter(
      (review) =>
        (genre === "All" || review.genre === genre) &&
        (minRating === 0 || (review.rating ?? 0) >= minRating) &&
        (needle === "" ||
          review.title.toLowerCase().includes(needle) ||
          review.subject.toLowerCase().includes(needle) ||
          review.excerpt.toLowerCase().includes(needle)),
    );

    return filtered.sort((a, b) => {
      if (sort === "rating") {
        return (
          (b.rating ?? 0) - (a.rating ?? 0) || b.date.localeCompare(a.date)
        );
      }
      if (sort === "oldest") return a.date.localeCompare(b.date);
      return b.date.localeCompare(a.date);
    });
  }, [reviews, genre, query, minRating, sort]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-5 border-b border-rule px-5 pb-5 sm:px-10 lg:px-[72px] lg:pt-9 lg:pb-7">
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:gap-[10px] sm:overflow-visible sm:px-0">
          {(["All", ...GENRES] as GenreFilter[]).map((option) => {
            const active = option === genre;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setGenre(option)}
                aria-pressed={active}
                className="flex-none cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.08em] uppercase transition-colors lg:px-[18px] lg:py-[9px]"
                style={
                  active
                    ? {
                        borderColor: "var(--color-accent)",
                        background:
                          "color-mix(in srgb, var(--color-accent) 16%, transparent)",
                        color: "var(--color-fg-bright)",
                      }
                    : {
                        borderColor: "var(--color-hairline)",
                        background: "transparent",
                        color: "var(--color-fg-muted)",
                      }
                }
              >
                {option}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-5 lg:gap-6">
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

      <div className="px-5 sm:px-10 lg:px-[72px]">
        <div className="pt-7 pb-2 text-xs tracking-[0.08em] text-fg-dim uppercase sm:pb-0">
          {visible.length} {visible.length === 1 ? "review" : "reviews"}
          {query.trim() ? ` matching "${query.trim()}"` : ""}
        </div>

        {visible.length === 0 ? (
          <p className="py-16 font-serif text-lg text-fg-muted">
            No reviews match{query.trim() ? ` "${query.trim()}"` : " those filters"}.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:mt-8 sm:grid-cols-2 sm:gap-x-7 sm:gap-y-11 md:grid-cols-3 xl:grid-cols-4">
            {visible.map((review) => (
              <ReviewCard key={review.slug} review={review} />
            ))}
          </div>
        )}
      </div>
    </>
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
