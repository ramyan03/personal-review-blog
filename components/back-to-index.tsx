"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@/components/icons";
import { REVIEWS_HREF } from "@/lib/links";

/**
 * Back to the index, landing where you left it.
 *
 * As a plain link this always went to the top of the index, which on a page of
 * 21 reviews meant scrolling back down to find your place every time you opened
 * one. A history back instead returns to the exact scroll position, because the
 * browser restores it for you.
 *
 * Only when there is somewhere to go back to. Arriving cold from a shared link
 * or a search result has no index behind it, so that case stays a real
 * navigation to the index, and the element stays an anchor either way so it
 * keeps its href, middle click and open in new tab.
 */
export default function BackToIndex({ className }: { className?: string }) {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Same origin referrer means the previous entry is a page of this site,
    // which is the only case where going back lands on the index.
    let sameOrigin = false;
    try {
      sameOrigin =
        document.referrer !== "" &&
        new URL(document.referrer).origin === location.origin;
    } catch {
      sameOrigin = false;
    }
    setCanGoBack(sameOrigin && window.history.length > 1);
  }, []);

  return (
    <Link
      href={REVIEWS_HREF}
      className={className}
      onClick={(event) => {
        // Leave modified clicks alone so new tab and new window still work.
        if (
          !canGoBack ||
          event.defaultPrevented ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          event.button !== 0
        ) {
          return;
        }
        event.preventDefault();
        router.back();
      }}
    >
      <ArrowLeftIcon />
      All reviews
    </Link>
  );
}
