"use client";

import { useEffect } from "react";

/**
 * Snapping, but only where it belongs.
 *
 * The landing page is a run of screen-sized panels followed by the index,
 * which is a long list, and then the footer. One `scroll-snap-type` on <html>
 * cannot serve both halves, and trying made three separate bugs:
 *
 *  - the footer was unreachable, sitting past the last snap point with nowhere
 *    for the scroll to come to rest
 *  - one wheel gesture inside the index cleared the whole filter header
 *  - coming back from a review, the browser restored the scroll position and
 *    the snap engine immediately pulled it to the index's own snap point, so
 *    you landed at the top of the list with a visible flicker on the way
 *
 * The last one is the reason this is a component and not more CSS. Scroll
 * restoration happens before any effect runs, so snapping has to be off
 * already when the page is restored, not switched off in response. The server
 * renders data-snap="off" and this turns it on only once the scroll is known
 * to be up among the panels: arriving mid-index, it simply never turns on.
 *
 * Reads scroll in a passive listener and writes one attribute, coalesced
 * through rAF, so nothing here rerenders React.
 */
export default function SnapScope({ untilId }: { untilId: string }) {
  useEffect(() => {
    const root = document.documentElement;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    const apply = () => {
      frame = 0;
      const boundary = document.getElementById(untilId);
      if (!boundary) return;

      /*
       * Measured against the document rather than read off offsetTop, and
       * abandoned if the answer is implausible. On a back navigation this runs
       * while the artwork above is still being laid out, and an index that
       * briefly measures near zero would switch snapping on underneath a
       * reader who is a long way down it, ready to yank them on their next
       * gesture. Leaving it alone until the page has a real height is always
       * the safe direction, because the default is off.
       */
      const top = boundary.getBoundingClientRect().top + window.scrollY;
      if (top < window.innerHeight) return;

      // The panels end where the index begins. A screen of slack keeps the
      // handover off the seam, so the last panel still snaps cleanly.
      const inPanels = window.scrollY < top - window.innerHeight;

      const next = inPanels ? "on" : "off";
      if (root.dataset.snap !== next) root.dataset.snap = next;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(apply);
    };

    apply();

    /*
     * And again as the page settles.
     *
     * Coming back to the index, this component mounts before the scroll
     * position is restored, so the first measurement sees the top of the page
     * and would leave snapping switched on under a reader who is actually a
     * long way down. Nothing fires afterwards to correct it: a restore is not
     * a scroll event and not a load. A few passes over the next half second
     * cover it without leaving anything polling.
     */
    const settle = [60, 200, 500].map((delay) => setTimeout(apply, delay));
    window.addEventListener("pageshow", apply);
    window.addEventListener("load", apply);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      settle.forEach(clearTimeout);
      window.removeEventListener("pageshow", apply);
      window.removeEventListener("load", apply);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      delete root.dataset.snap;
    };
  }, [untilId]);

  return null;
}
