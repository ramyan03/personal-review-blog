"use client";

import { useEffect, useState } from "react";
import Cover from "@/components/cover";
import GenreTag from "@/components/genre-tag";
import Stars from "@/components/stars";
import { formatDate, type Review } from "@/lib/format";

type Density = "grid" | "list";

const STORAGE_KEY = "dn-density";

/**
 * Section 07. The index at two densities, with the choice remembered.
 *
 * Michael Gatt keeps INDEX VIEW available in the middle of a 3D field, and
 * Gionatan Nese numbers three arrangements of the same eighteen thumbnails.
 * Neither makes you pick between an atmospheric browse and a scannable one.
 *
 * There is a practical reason to want this here too: the three column index
 * is about a third taller than the four column one it replaced, so the list
 * is not only a different mood, it is the version that fits on a screen.
 *
 * The choice is per reader and per browser, which is what localStorage is for.
 * It is read after mount rather than during render, because the server has no
 * idea which way this reader left it and a mismatch would hydrate wrong.
 */
export default function DensityToggle({ reviews }: { reviews: Review[] }) {
  const [density, setDensity] = useState<Density>("grid");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "grid" || saved === "list") setDensity(saved);
    } catch {
      // Private windows and blocked site data both throw on access. The
      // default is a perfectly good answer.
    }
  }, []);

  const choose = (next: Density) => {
    setDensity(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Remembering is a convenience, not a requirement.
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <span className="dn-tag" style={{ marginBottom: 0 }}>
          {reviews.length} shown
        </span>
        <div className="dn-switch" role="group" aria-label="Index density">
          <button
            type="button"
            aria-pressed={density === "grid"}
            onClick={() => choose("grid")}
          >
            Grid
          </button>
          <button
            type="button"
            aria-pressed={density === "list"}
            onClick={() => choose("list")}
          >
            List
          </button>
        </div>
      </div>

      {density === "grid" ? (
        <div className="dn-grid">
          {reviews.map((review) => (
            <div key={review.slug} className="flex flex-col gap-[9px]">
              <Cover
                title={review.title}
                genre={review.genre}
                cover={review.cover}
                className="w-full"
                letterClassName="text-[40px]"
                sizes="(min-width: 1100px) 16vw, (min-width: 700px) 24vw, 44vw"
              />
              <GenreTag genre={review.genre} />
              <h3 className="line-clamp-2 font-serif text-base leading-[1.3] font-medium text-fg-title">
                {review.title}
              </h3>
              <span className="line-clamp-1 text-sm text-fg-muted">
                {review.subject}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {reviews.map((review) => (
            <div key={review.slug} className="dn-row">
              {/*
                Every one of these breakpoints has to be md, matching the 768px
                in .dn-row. They were sm, which reveals at 640px, so between
                640 and 760 there were four children in a two column grid: the
                last two wrapped onto a second row and ran into the row below.
              */}
              <div className="hidden md:block">
                <GenreTag genre={review.genre} />
              </div>

              <div className="min-w-0">
                {/* Truncate sets nowrap, and a percentage max-width does not
                    constrain min-content, so a long title inflates the whole
                    row on a narrow screen. A clamp is the fix. */}
                <h3 className="line-clamp-1 font-serif text-base leading-[1.35] font-medium text-fg-title">
                  {review.title}
                </h3>
                <span className="line-clamp-1 text-sm text-fg-faint md:hidden">
                  {review.subject}
                </span>
              </div>

              {/*
                The clamp needs its own element. line-clamp works by setting
                display to -webkit-box, so putting `hidden md:block` on the
                same span replaced that with `block` and switched the clamp
                off: a long subject then overflowed its 108px track and sat on
                top of the rating. The wrapper carries the showing and hiding,
                the span keeps its display.
              */}
              <div className="hidden min-w-0 md:block">
                <span className="line-clamp-1 text-sm text-fg-muted">
                  {review.subject}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3">
                {review.rating ? <Stars rating={review.rating} /> : null}
                <span className="hidden text-xs whitespace-nowrap text-fg-faint lg:inline">
                  {formatDate(review.date)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
