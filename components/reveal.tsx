"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fade + rise as the element scrolls into view. Uses an IntersectionObserver
 * rather than a CSS scroll timeline so the reveal works outside Chromium.
 *
 * `variant="bare"` skips the fade on the wrapper itself and only stamps
 * `is-visible`, which lets a panel stage its own children from CSS: the genre
 * covers pop in one after another off a single observer rather than one per
 * cover.
 */
export default function Reveal({
  children,
  className = "",
  delayMs,
  variant = "fade",
}: {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  variant?: "fade" | "bare";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      // Fires as soon as the top edge clears the fold, so it works for panels
      // taller than the viewport as well as small ones.
      { threshold: 0, rootMargin: "0px 0px -80px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const base = variant === "fade" ? "reveal" : "";

  return (
    <div
      ref={ref}
      className={`${base}${visible ? " is-visible" : ""} ${className}`.trim()}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
