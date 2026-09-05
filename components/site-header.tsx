"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import ThemeToggle from "@/components/theme-toggle";
import HeaderSearch from "@/components/header-search";
import { CloseIcon, MenuIcon } from "@/components/icons";
import type { Review } from "@/lib/format";
import { REVIEWS_HREF } from "@/lib/links";
import { useSlidingRule } from "@/lib/use-sliding-rule";

/*
 * Reviews points at a section of the landing page, so which item is current
 * can no longer be read off the href. `match` carries that instead: a review
 * still lives under /reviews/<slug>, so the tab lights up there even though
 * following it goes to /#all-reviews.
 */
/* useLayoutEffect warns when it runs during server rendering, and this file is
   a client component that still gets prerendered. */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const NAV = [
  { href: REVIEWS_HREF, label: "Reviews", match: "/reviews" },
  { href: "/about", label: "About", match: "/about" },
  { href: "/contact", label: "Contact", match: "/contact" },
];

/**
 * The one header, used on every page.
 *
 * The landing page used to carry a bar of its own with a different set of
 * controls, so arriving at a review from it swapped the header out underneath
 * you. Same component everywhere now; the only difference is that on the
 * landing it floats over the hero and fades in once you start scrolling,
 * because the hero is meant to be met on its own.
 */
export default function SiteHeader({ reviews }: { reviews: Review[] }) {
  const pathname = usePathname();

  /*
   * The landing page is met on its own, so there the bar floats over the hero
   * and fades in once you scroll. Everywhere else it is simply there. This is
   * read from the route rather than passed in, because one layout now renders
   * the header for every page.
   */
  const floating = pathname === "/";
  const activeIndex = NAV.findIndex((item) => pathname.startsWith(item.match));
  const rule = useSlidingRule<HTMLAnchorElement>(activeIndex);

  const [revealed, setRevealed] = useState(!floating);
  // The fade is for scrolling away from the hero, not for arriving. Coming
  // back to this page already scrolled down, an animated fade in is a flash.
  const [animate, setAnimate] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const headerRef = useRef<HTMLElement>(null);

  // Leaving the page you opened the menu from should not leave it hanging open.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Escape, and a tap anywhere else, both close it.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const onDown = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [menuOpen]);

  /*
   * Runs before paint. On a back navigation the browser restores the scroll
   * position, so the bar should already be showing on the first frame; with a
   * plain effect it painted once at opacity 0 and then faded in, which is the
   * flicker you get swiping back to the reviews.
   */
  useIsomorphicLayoutEffect(() => {
    if (!floating) return;
    setRevealed(window.scrollY > 80);
  }, [floating]);

  useEffect(() => {
    if (!floating) return;
    const onScroll = () => setRevealed(window.scrollY > 80);
    onScroll();
    const id = requestAnimationFrame(() => setAnimate(true));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", onScroll);
    };
  }, [floating]);

  return (
    /*
     * Two positioning modes, one appearance. The bar used to be laid out
     * differently in each: floating it spanned the full width, in flow it was
     * centred inside the 1420px cap, so the wordmark landed in a different
     * place depending on which page you were on, and the switch between them
     * on navigation read as a flicker.
     *
     * Both now share the same inner container and padding. Off the landing
     * page it is sticky rather than fixed, so it stays in the flow and nothing
     * has to be padded out from underneath it.
     */
    <header
      ref={headerRef}
      className={`z-20 border-b border-rule bg-ink/85 backdrop-blur-[10px] ${
        floating
          ? `fixed inset-x-0 top-0 ${animate ? "transition-[opacity,transform] duration-500" : ""}`
          : "sticky top-0"
      }`}
      style={
        floating
          ? {
              opacity: revealed ? 1 : 0,
              transform: revealed ? "none" : "translateY(-6px)",
              pointerEvents: revealed ? "auto" : "none",
            }
          : undefined
      }
    >
      <div className="mx-auto flex w-full max-w-[1420px] flex-wrap items-center gap-x-5 gap-y-4 px-5 py-[18px] sm:min-h-[29px] sm:gap-x-6 sm:px-10 lg:px-[72px]">
        <Link
          href="/"
          className="flex-none font-serif text-sm leading-none font-medium text-fg-title italic transition-colors hover:text-accent sm:text-base"
        >
          Ramyan Reviews
        </Link>

        {/* Reads the query string, so it needs its own boundary to keep every
            page in this layout statically prerenderable. */}
        <Suspense
          fallback={
            /* Same height as the resolved search box. Without it the bar was
               4px shorter until search hydrated, and that shift was the
               flicker on arrival. */
            <div className="hidden h-[29px] sm:block sm:max-w-[300px] sm:flex-1" />
          }
        >
          <HeaderSearch reviews={reviews} />
        </Suspense>

        <div className="ml-auto flex flex-none items-center gap-4 sm:gap-7 lg:gap-9">
          <nav
            ref={rule.trackRef as React.RefObject<HTMLElement>}
            aria-label="Main"
            className="relative hidden items-center gap-4 sm:flex sm:gap-7 lg:gap-9"
          >
            {NAV.map((item, index) => (
              <Link
                key={item.href}
                ref={(node) => {
                  rule.itemRefs.current[index] = node;
                }}
                href={item.href}
                aria-current={index === activeIndex ? "page" : undefined}
                className={
                  index === activeIndex
                    ? "text-xs font-semibold tracking-[0.1em] text-accent uppercase sm:tracking-[0.12em]"
                    : "text-xs font-semibold tracking-[0.1em] text-fg-muted uppercase transition-colors hover:text-fg sm:tracking-[0.12em]"
                }
              >
                {item.label}
              </Link>
            ))}

            {/* One rule for the whole nav, so switching pages slides it across. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-[7px] left-0 h-[2px] bg-accent"
              style={rule.style}
            />
          </nav>

          <ThemeToggle />

          {/*
            Three labelled links, a search field and a theme control do not fit
            across a phone beside the wordmark; they were wrapping onto a second
            row that then sat there, sticky, down the whole page. Behind a menu
            the bar is one line again.
          */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? "Close menu" : "Menu"}
            className="flex-none p-1 text-fg-muted transition-colors hover:text-fg sm:hidden"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          id={menuId}
          aria-label="Main"
          className="absolute inset-x-0 top-full border-b border-rule bg-ink/95 backdrop-blur-[10px] sm:hidden"
        >
          <ul className="m-0 list-none p-0">
            {NAV.map((item, index) => (
              <li key={item.href} className="border-t border-row first:border-t-0">
                <Link
                  href={item.href}
                  aria-current={index === activeIndex ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-5 py-4 text-xs font-semibold tracking-[0.14em] uppercase ${
                    index === activeIndex ? "text-accent" : "text-fg-muted"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
