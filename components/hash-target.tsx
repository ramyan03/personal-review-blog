"use client";

import { useEffect } from "react";

/**
 * Puts the reader where the URL says, on arrival.
 *
 * Landing on `/#all-reviews` should open at the index, which is what `/reviews`
 * now redirects to. The browser's own fragment scrolling cannot be relied on
 * here: mandatory scroll snapping on the root refuses scrolls it did not
 * initiate, and five screens of artwork sit above the target, still settling as
 * they decode.
 *
 * So rather than scrolling once and hoping, this re-aligns on a short interval
 * until the target actually sits at the top and stays there. Any deliberate
 * input from the reader ends it immediately: correcting the position out from
 * under someone who has started scrolling would be worse than landing short.
 */
const SETTLE_MS = 2500;
const CHECK_MS = 100;

export default function HashTarget() {
  useEffect(() => {
    const id = window.location.hash.replace(/^#/, "");
    if (!id) return;

    const html = document.documentElement;
    let stopped = false;

    function cleanup() {
      stopped = true;
      window.clearInterval(interval);
      window.clearTimeout(settled);
      window.removeEventListener("wheel", cleanup);
      window.removeEventListener("touchstart", cleanup);
      window.removeEventListener("keydown", cleanup);
    }

    function align() {
      if (stopped) return;
      const target = document.getElementById(id);
      if (!target) return;

      const offset = target.getBoundingClientRect().top;
      if (Math.abs(offset) < 1) return;

      const restore = html.style.scrollSnapType;
      html.style.scrollSnapType = "none";
      window.scrollTo({ top: window.scrollY + offset, behavior: "auto" });
      html.style.scrollSnapType = restore;
    }

    align();
    const interval = window.setInterval(align, CHECK_MS);
    const settled = window.setTimeout(cleanup, SETTLE_MS);

    window.addEventListener("wheel", cleanup, { passive: true });
    window.addEventListener("touchstart", cleanup, { passive: true });
    window.addEventListener("keydown", cleanup, { passive: true });

    return cleanup;
  }, []);

  return null;
}
