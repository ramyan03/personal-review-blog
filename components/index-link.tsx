"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { REVIEWS_ANCHOR, reviewsHref } from "@/lib/links";
import { scrollToPanel } from "@/lib/scroll-to-panel";

/**
 * A link to the review index, which is a section of the landing page rather
 * than a page of its own.
 *
 * From anywhere else the href does the work. From the landing page itself
 * there is nowhere to navigate to, so the click applies the filter to the URL
 * and walks the page down to the index instead. Without this, "See all Books"
 * from the Books panel would appear to do nothing at all.
 */
export default function IndexLink({
  genre,
  q,
  className,
  children,
  ...rest
}: {
  genre?: string;
  q?: string;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof Link>, "href" | "children">) {
  const router = useRouter();
  const href = reviewsHref({ genre, q });

  return (
    <Link
      {...rest}
      href={href}
      className={className}
      onClick={(event) => {
        const target = document.getElementById(REVIEWS_ANCHOR);
        if (!target) return; // Not on the landing page; let the href navigate.

        event.preventDefault();
        const query = href.split("#")[0];
        router.push(query || "/", { scroll: false });
        scrollToPanel(target);
      }}
    >
      {children}
    </Link>
  );
}
