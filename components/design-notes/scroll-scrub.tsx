"use client";

import { useEffect, useRef, useState } from "react";
import Cover from "@/components/cover";
import GenreTag from "@/components/genre-tag";
import type { Review } from "@/lib/format";

/**
 * Scroll as a scrubber, in a box.
 *
 * thewatch.60fps.fr is the purest example on the winners list: the document is
 * 51,373px tall, which is 39 viewports, and none of that height is content.
 * It exists so there is something to scroll. One canvas is pinned at
 * position:fixed and the scroll offset is read as a playhead. mesh3d does the
 * same thing with less budget and swaps a number and a caption at each beat
 * instead of advancing a render.
 *
 * Demonstrated here inside its own scroll container rather than by making this
 * page 39 screens tall. position:sticky works against the nearest scrolling
 * ancestor, so a 440px box holding a track three times its height gives the
 * identical mechanism at a size you can see all at once, and the page it sits
 * on keeps its own scrolling.
 *
 * No reduced-motion branch, deliberately. Nothing here animates on its own:
 * every frame is a direct function of where the reader has put the scrollbar,
 * which is the property that makes this technique feel responsive rather than
 * showy.
 */
export default function ScrollScrub({ reviews }: { reviews: Review[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    const read = () => {
      frame = 0;
      const span = node.scrollHeight - node.clientHeight;
      setProgress(span > 0 ? node.scrollTop / span : 0);
    };

    // Scroll fires far faster than the screen refreshes, so the work is
    // deferred to the next frame and the extra events collapse into it.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    node.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      node.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Which review the playhead is currently over, and how far into it.
  const scaled = progress * (reviews.length - 1);
  const index = Math.min(reviews.length - 1, Math.floor(scaled + 0.5));
  const current = reviews[index];

  return (
    <div>
      <div className="dn-scrub" ref={ref}>
        <div className="dn-scrub-track">
          <div className="dn-scrub-frame">
            <div className="dn-scrub-art">
              {reviews.map((review, i) => (
                <div
                  key={review.slug}
                  className="dn-scrub-layer"
                  /* Every cover is mounted and only opacity changes, so
                     nothing has to decode at the moment it is needed. */
                  style={{ opacity: i === index ? 1 : 0 }}
                  aria-hidden={i === index ? undefined : true}
                >
                  <Cover
                    title={review.title}
                    genre={review.genre}
                    cover={review.cover}
                    className="w-full"
                    letterClassName="text-[52px]"
                    sizes="200px"
                  />
                </div>
              ))}
            </div>

            <div className="dn-scrub-caption">
              <GenreTag genre={current.genre} />
              <h3 className="mt-3 mb-0 font-serif text-xl leading-[1.15] font-medium text-fg-bright">
                {current.title}
              </h3>
              <p className="mt-2 mb-0 text-sm text-fg-muted">
                {current.subject}
              </p>

              <div className="dn-scrub-rule" aria-hidden="true">
                <span style={{ transform: `scaleX(${progress})` }} />
              </div>
              <span className="dn-eyebrow" style={{ marginTop: 10 }}>
                {index + 1} of {reviews.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 mb-0 font-serif text-sm text-fg-dim italic">
        Scroll inside the box. The frame never moves; only the playhead does.
      </p>
    </div>
  );
}
