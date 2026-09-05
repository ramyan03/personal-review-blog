import Link from "next/link";
import Cover from "@/components/cover";
import Stars from "@/components/stars";
import { formatDate, type Review } from "@/lib/format";
import type { Genre } from "@/lib/genre";

const COUNT = 4;

/**
 * More from the same shelf, at the foot of a review.
 *
 * The previous and next links below this walk the whole archive by date, so
 * from a Murakami novel the next review is whatever happened to be finished
 * that week. This is the other axis: the rest of the Books, or the rest of the
 * Film. A row rather than cards, so it reads as a shelf and not as a widget.
 */
export default function MoreInGenre({
  genre,
  currentSlug,
  reviews,
}: {
  genre: Genre;
  currentSlug: string;
  reviews: Review[];
}) {
  const others = reviews
    .filter((review) => review.genre === genre && review.slug !== currentSlug)
    .slice(0, COUNT);

  if (others.length === 0) return null;

  return (
    <section className="mt-[72px] border-t border-rule pt-8">
      <h2 className="mb-7 text-xs font-semibold tracking-[0.16em] text-fg-dim uppercase">
        More {genre}
      </h2>

      <ul className="m-0 grid list-none grid-cols-2 gap-x-6 gap-y-8 p-0 sm:grid-cols-4">
        {others.map((review) => (
          <li key={review.slug}>
            <Link href={`/reviews/${review.slug}`} className="group block">
              <Cover
                title={review.title}
                genre={review.genre}
                cover={review.cover}
                letterClassName="text-[44px]"
                sizes="(min-width: 640px) 150px, 40vw"
              />
              <h3 className="mt-3 font-serif text-base leading-[1.25] font-medium text-fg-title transition-colors group-hover:text-accent">
                {review.title}
              </h3>
              <p className="mt-1 truncate text-xs text-fg-muted">
                {review.subject}
              </p>
              {review.rating ? (
                <div className="mt-2">
                  <Stars rating={review.rating} size={12} />
                </div>
              ) : (
                <p className="mt-2 text-xs text-fg-faint">
                  {formatDate(review.date)}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
