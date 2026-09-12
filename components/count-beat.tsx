"use client";

import { useEffect, useRef, useState } from "react";
import Eyebrow from "@/components/eyebrow";

export type Beat = { value: number; label: string; note: string };

const DURATION_MS = 1100;

/**
 * Four numbers that arrive rather than sit there.
 *
 * mesh3d gives each of its counts a whole screen and assembles the digits out
 * of a particle field. That is the right amount of theatre for a page whose
 * entire subject is the numbers; here the same idea has to survive on a page
 * that is mostly prose, so the beat is the count itself: the figures run up
 * from zero and the four tiles stagger in behind them.
 *
 * The line in the hero that used to say how many reviews there are is gone,
 * because a fact stated twice on one page reads as neither emphasis nor
 * information. This is where the site says how much of it there is.
 *
 * Carries no positioning of its own: the landing page wraps it in a .panel and
 * the design notes page stands it on a stage, and neither needs this component
 * to know which it is.
 */
export default function CountBeat({ beats }: { beats: Beat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState<number[]>(() => beats.map(() => 0));

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    const targets = beats.map((beat) => beat.value);

    // Someone who has asked for less motion still wants the numbers, just not
    // the run up to them.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValues(targets);
      return;
    }

    let frame = 0;
    let done = false;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION_MS);
      // Ease out, so the last few digits settle instead of snapping shut.
      const eased = 1 - Math.pow(1 - t, 3);
      setValues(targets.map((target) => Math.round(target * eased)));
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        done = true;
      }
    };

    frame = requestAnimationFrame(tick);

    /*
     * A backgrounded tab stops servicing rAF, so a count that starts and is
     * then switched away from never finishes: come back and the reviews all
     * read zero, which is not a slow animation, it is a wrong number. The
     * guard lands the final values whether or not the frames ever ran. Same
     * failure the panel scroll in lib/scroll-to-panel.ts has to defend against.
     */
    const guard = setTimeout(() => {
      if (!done) setValues(targets);
    }, DURATION_MS + 400);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(guard);
    };
  }, [visible, beats]);

  return (
    <div
      ref={ref}
      className={`count-beat${visible ? " is-visible" : ""}`}
      /* The figures change many times a second while counting. Without this a
         screen reader would try to announce every frame. */
      aria-live="off"
    >
      {beats.map((beat, index) => (
        <div key={beat.label} className="count-beat-item">
          <span className="count-beat-value">{values[index] ?? 0}</span>
          <Eyebrow className="mt-[14px]">{beat.label}</Eyebrow>
          <p className="mt-2 font-serif text-sm leading-[1.5] text-fg-faint">
            {beat.note}
          </p>
        </div>
      ))}
    </div>
  );
}
