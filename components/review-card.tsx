import Link from "next/link";
import Cover from "@/components/cover";
import GenreTag from "@/components/genre-tag";
import Stars from "@/components/stars";
import { type Review } from "@/lib/format";

/**
 * One entry in the index.
 *
 * Deliberately not a card. There is no background, no border and no rule under
 * each item: the artwork is the object and the type hangs off it, which is how
 * a contact sheet reads and how a grid of cards does not. The date has gone
 * from the grid as well. Twenty one of them stacked up into a column of small
 * grey numbers that nothing was ever going to be sorted or scanned by, and the
 * index has a date sort of its own for when the order actually matters.
 *
 * The hover is the same move the genre panels make, so the index belongs to
 * the same site as the artwork above it: the held entry comes forward and its
 * neighbours recede. That rule lives on the grid in globals.css, since it
 * needs :has() over siblings.
 */
export default function ReviewCard({ review }: { review: Review }) {
  return (
    <Link href={`/reviews/${review.slug}`} className="index-entry group block">
      <Cover
        title={review.title}
        genre={review.genre}
        cover={review.cover}
        className="index-entry-art w-full"
        letterClassName="text-[64px] sm:text-[72px] xl:text-[92px]"
      />

      <div className="mt-4 flex flex-col gap-[7px]">
        <GenreTag genre={review.genre} />

        <h3 className="m-0 font-serif text-lg leading-[1.25] font-medium text-fg-title transition-colors group-hover:text-accent">
          {review.title}
        </h3>

        <span className="text-sm text-fg-muted">{review.subject}</span>

        {review.rating ? <Stars rating={review.rating} /> : null}

        <p className="mt-1 line-clamp-3 max-w-[38ch] font-serif text-sm leading-[1.6] text-fg-excerpt italic">
          {review.excerpt}
        </p>
      </div>
    </Link>
  );
}
