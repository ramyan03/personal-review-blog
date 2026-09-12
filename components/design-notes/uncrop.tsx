"use client";

import { useEffect, useRef, useState } from "react";

/**
 * An image that arrives by opening rather than by fading.
 *
 * AI in Design starts its photograph clipped inside a small window and lets it
 * un-crop to full bleed as it enters. The picture itself never moves or
 * scales, which is what separates it from the usual parallax: the frame around
 * it widens, so it reads as a shutter opening rather than as something sliding
 * past.
 *
 * Done with clip-path and an IntersectionObserver, the same pattern as
 * components/reveal.tsx, because that combination works everywhere. The
 * platform can now do this natively with `animation-timeline: view()` and no
 * JavaScript at all, and it ties the opening to scroll position rather than to
 * a fixed duration, which is better. None of the five winning sites used it.
 * Safari is the reason: it is still behind a flag there, and a review page
 * that opens its artwork on Chrome and not on an iPhone is worse than one that
 * does neither.
 */
export default function Uncrop({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpen(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setOpen(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`dn-uncrop${open ? " is-open" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
