"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The leading picture on a review, opening as you reach it.
 *
 * AI in Design starts its photograph clipped inside a narrow window and lets
 * it un-crop to full bleed on entry. The picture never moves or scales, so it
 * reads as a shutter opening rather than as something sliding past, and one
 * transition on clip-path is the whole effect.
 *
 * This renders a plain img and nothing else, deliberately. Wrapping it in a
 * div was the obvious way to write it and would have broken two things in
 * globals.css that took a while to get right: `.review-body > img:first-child`
 * promotes a leading image to a full width plate, and `img:nth-of-type(2n)`
 * alternates which side the later ones float to. A wrapper removes the image
 * from that count and flips every float on the page.
 *
 * Only the topmost image gets this. Further down a review the pictures are
 * floated into the text at 45% and an opening frame there would read as a
 * glitch rather than an entrance.
 */
export default function UncropImage(
  props: React.ImgHTMLAttributes<HTMLImageElement>,
) {
  const ref = useRef<HTMLImageElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpen(true);
      return;
    }

    /*
     * A review opens at the top of the page, so its leading picture is
     * usually already on screen before the observer has run. Firing on the
     * first callback either way is what makes it open on arrival instead of
     * sitting there clipped until you scroll.
     */
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setOpen(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const { className = "", ...rest } = props;

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      {...rest}
      ref={ref}
      className={`uncrop${open ? " is-open" : ""} ${className}`.trim()}
    />
  );
}
