"use client";

/**
 * Walks the page to a landing panel.
 *
 * Two things make the obvious `scrollIntoView({ behavior: "smooth" })` the
 * wrong tool here. Mandatory scroll snapping refuses programmatic scrolls
 * outright, and native smooth scrolling is not animated in every context, so
 * the button either does nothing or jumps. Animating it here sidesteps both:
 * snapping is lifted for the duration, each frame is an explicitly instant
 * scroll so the root's own scroll-behavior cannot interfere, and the pace is
 * ours to set rather than the browser's.
 */

const DURATION = 1000;

// easeInOutCubic: unhurried at both ends, which is what stops a full screen of
// travel feeling like a jump cut.
function ease(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function scrollToPanel(target: HTMLElement, duration = DURATION): void {
  const html = document.documentElement;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    target.scrollIntoView({ behavior: "auto", block: "start" });
    return;
  }

  const start = window.scrollY;
  const limit = html.scrollHeight - window.innerHeight;
  const end = Math.max(
    0,
    Math.min(target.getBoundingClientRect().top + start, limit),
  );

  if (Math.abs(end - start) < 2) return;

  const restoreSnap = html.style.scrollSnapType;
  html.style.scrollSnapType = "none";

  let settled = false;

  const finish = (jump: boolean) => {
    if (settled) return;
    settled = true;
    if (jump) window.scrollTo({ top: end });
    // The destination is itself a snap point, so this is silent.
    html.style.scrollSnapType = restoreSnap;
  };

  const began = performance.now();

  const step = (now: number) => {
    if (settled) return;
    const progress = Math.min(1, (now - began) / duration);
    window.scrollTo({ top: start + (end - start) * ease(progress) });
    if (progress < 1) requestAnimationFrame(step);
    else finish(false);
  };

  requestAnimationFrame(step);

  /*
   * A backgrounded or occluded tab stops servicing requestAnimationFrame
   * entirely. Without this the animation would never run and snapping would be
   * left switched off, so the page would end up stuck and unsnapped. Landing
   * the reader where they asked to go matters more than animating the trip.
   */
  window.setTimeout(() => finish(true), duration + 250);
}
