"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { SearchIcon } from "@/components/icons";
import { formatDate, type Review } from "@/lib/format";
import { REVIEWS_ANCHOR } from "@/lib/links";
import { scrollToPanel } from "@/lib/scroll-to-panel";

const MAX_SUGGESTIONS = 6;

/**
 * Search resolves against the reviews already in memory, so there is nothing to
 * query on the server and the page stays static. Typing opens a list of
 * matches: picking one goes straight to that review, while Enter on the input
 * falls through to /reviews?q= for the full filtered set.
 */
export default function HeaderSearch({ reviews }: { reviews: Review[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  // Mobile only: the input is hidden behind its own icon until asked for.
  const [expanded, setExpanded] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  // Opening the row on a phone should put the cursor in it, or the icon has
  // just cost you a tap.
  useEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);

  // Keep the box in step with the URL, including back and forward navigation.
  useEffect(() => {
    setValue(params.get("q") ?? "");
  }, [params]);

  const matches = useMemo(() => {
    const needle = value.trim().toLowerCase();
    if (needle.length < 2) return [];
    return reviews
      .filter(
        (review) =>
          review.title.toLowerCase().includes(needle) ||
          review.subject.toLowerCase().includes(needle) ||
          review.excerpt.toLowerCase().includes(needle),
      )
      .slice(0, MAX_SUGGESTIONS);
  }, [reviews, value]);

  const total = useMemo(() => {
    const needle = value.trim().toLowerCase();
    if (needle.length < 2) return 0;
    return reviews.filter(
      (review) =>
        review.title.toLowerCase().includes(needle) ||
        review.subject.toLowerCase().includes(needle) ||
        review.excerpt.toLowerCase().includes(needle),
    ).length;
  }, [reviews, value]);

  // A click anywhere else dismisses the list.
  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  function goToAll(next: string) {
    const query = new URLSearchParams(params.toString());
    if (next.trim()) query.set("q", next.trim());
    else query.delete("q");
    const qs = query.toString();
    setOpen(false);

    // The index is a section of the landing page. Searching from that page has
    // nowhere to navigate to, so the term goes into the URL and the page walks
    // down to the results; from anywhere else this is an ordinary navigation.
    const onIndexPage = document.getElementById(REVIEWS_ANCHOR);
    if (onIndexPage) {
      router.push(qs ? `/?${qs}` : "/", { scroll: false });
      scrollToPanel(onIndexPage);
      return;
    }

    router.push(qs ? `/?${qs}#${REVIEWS_ANCHOR}` : `/#${REVIEWS_ANCHOR}`);
  }

  function openReview(slug: string) {
    setOpen(false);
    router.push(`/reviews/${slug}`);
  }

  const showList = open && value.trim().length >= 2;

  return (
    <>
      {/*
        A full width input is the widest thing in the bar, and on a phone it
        forced the header onto a third line that then stayed there, sticky, for
        the whole page. Below the small breakpoint it collapses to its own icon
        and only takes a row once you actually want to search.
      */}
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
        aria-label="Search reviews"
        className="flex-none p-1 text-fg-muted transition-colors hover:text-fg sm:hidden"
      >
        <SearchIcon />
      </button>

      <div
        ref={boxRef}
        className={`relative order-last w-full min-w-0 sm:order-none sm:block sm:w-auto sm:max-w-[300px] sm:flex-1 ${
          expanded ? "block" : "hidden"
        }`}
      >
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          if (active >= 0 && matches[active]) openReview(matches[active].slug);
          else goToAll(value);
        }}
      >
        <label className="flex items-center gap-2 border-b border-hairline pb-2 transition-colors focus-within:border-accent">
          <span className="flex-none text-fg-faint">
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            type="search"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setOpen(true);
              setActive(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setOpen(false);
                setActive(-1);
                return;
              }
              if (!showList || matches.length === 0) return;
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActive((i) => (i + 1) % matches.length);
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActive((i) => (i <= 0 ? matches.length - 1 : i - 1));
              }
            }}
            placeholder="Search reviews"
            aria-label="Search reviews"
            role="combobox"
            aria-expanded={showList}
            aria-controls={listId}
            aria-autocomplete="list"
            autoComplete="off"
            className="w-full min-w-0 bg-transparent text-sm text-fg placeholder:text-fg-faint focus:outline-none"
          />
        </label>
      </form>

      {showList ? (
        <div
          id={listId}
          role="listbox"
          aria-label="Search results"
          className="absolute inset-x-0 top-full z-30 mt-2 border border-rule bg-surface shadow-[0_18px_50px_oklch(0_0_0/0.5)]"
        >
          {matches.length === 0 ? (
            <p className="m-0 px-4 py-5 font-serif text-sm text-fg-muted">
              Nothing matches &ldquo;{value.trim()}&rdquo;.
            </p>
          ) : (
            <>
              <ul className="m-0 list-none p-0">
                {matches.map((review, index) => (
                  <li key={review.slug}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={index === active}
                      onMouseEnter={() => setActive(index)}
                      onClick={() => openReview(review.slug)}
                      className={`flex w-full cursor-pointer items-center gap-3 border-b border-row px-3 py-[10px] text-left transition-colors ${
                        index === active ? "bg-shelf" : ""
                      }`}
                    >
                      {review.cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={review.cover}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="h-[46px] w-[34px] flex-none rounded-[2px] object-cover"
                        />
                      ) : (
                        <span className="h-[46px] w-[34px] flex-none rounded-[2px] bg-shelf" />
                      )}
                      <span className="min-w-0">
                        <span className="block truncate font-serif text-base text-fg-title">
                          {review.title}
                        </span>
                        <span className="block truncate text-xs text-fg-faint">
                          {review.genre} &middot; {formatDate(review.date)}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => goToAll(value)}
                className="w-full cursor-pointer px-3 py-3 text-left text-xs font-semibold tracking-[0.1em] text-accent uppercase"
              >
                See all {total} {total === 1 ? "result" : "results"} &rarr;
              </button>
            </>
          )}
        </div>
      ) : null}
      </div>
    </>
  );
}
