"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fade + rise as the element scrolls into view. Uses an IntersectionObserver
 * rather than a CSS scroll timeline so the reveal works outside Chromium.
 */
export default function Reveal({
  children,
  className = "",
  delay,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: 2 | 3;
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
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const delayClass = delay ? ` reveal-delay-${delay}` : "";

  return (
    <div
      ref={ref}
      className={`reveal${delayClass}${visible ? " is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
