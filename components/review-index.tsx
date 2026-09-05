"use client";

import { useMemo, useState } from "react";
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
  { value: 5, label: "5 only" },
];

export default function ReviewIndex({
  reviews,
  initialGenre = "All",
}: {
  reviews: Review[];
  initialGenre?: GenreFilter;
}) {
  const [genre, setGenre] = useState<GenreFilter>(initialGenre);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<Sort>("newest");

  const visible = useMemo(() => {
    const filtered = reviews.filter(
      (review) =>
        (genre === "All" || review.genre === genre) &&
        review.rating >= minRating,
    );

    return filtered.sort((a, b) => {
      if (sort === "rating") {
        return b.rating - a.rating || b.date.localeCompare(a.date);
      }
      if (sort === "oldest") return a.date.localeCompare(b.date);
      return b.date.localeCompare(a.date);
    });
  }, [reviews, genre, minRating, sort]);

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
                className="flex-none cursor-pointer rounded-full border px-4 py-2 text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors lg:px-[18px] lg:py-[9px] lg:text-[12px]"
                style={
                  active
                    ? {
                        borderColor: "var(--color-accent)",
                        background:
                          "color-mix(in srgb, var(--color-accent) 18%, oklch(0.21 0.01 55))",
                        color: "oklch(0.97 0.006 55)",
                      }
                    : {
                        borderColor: "oklch(0.32 0.01 55)",
                        background: "transparent",
                        color: "oklch(0.68 0.01 55)",
                      }
                }
              >
                {option}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-5 lg:gap-6">
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
          <SelectControl
            label="Sort"
            value={sort}
            onChange={(value) => setSort(value as Sort)}
            options={SORTS}
          />
        </div>
      </div>

      <div className="px-5 sm:px-10 lg:px-[72px]">
        <div className="pt-7 pb-2 text-[12px] tracking-[0.08em] text-fg-dim uppercase sm:pb-0">
          {visible.length} {visible.length === 1 ? "review" : "reviews"}
        </div>

        {visible.length === 0 ? (
          <p className="py-16 font-serif text-[19px] text-fg-muted italic">
            Nothing filed under that combination yet.
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
    <label className="flex items-center gap-2 text-[12px] tracking-[0.06em] text-fg-muted uppercase">
      <span>{label}</span>
      <span className="relative inline-flex items-center gap-2">
        <span className="text-[12px] font-semibold tracking-normal text-[oklch(0.92_0.006_55)] normal-case">
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
