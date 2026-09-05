import Link from "next/link";
import Cover from "@/components/cover";
import GenreTag from "@/components/genre-tag";
import Stars from "@/components/stars";
import { formatDate, type Review } from "@/lib/format";

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <Link
      href={`/reviews/${review.slug}`}
      className="group flex gap-4 border-b border-row py-5 sm:flex-col sm:gap-4 sm:border-0 sm:py-0"
    >
      <Cover
        title={review.title}
        genre={review.genre}
        className="w-[76px] flex-none sm:w-full"
        letterClassName="text-[34px] sm:text-[72px] xl:text-[92px]"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-[6px] sm:gap-[9px]">
        <div className="flex items-center justify-between gap-3">
          <GenreTag genre={review.genre} />
          <span className="text-[11px] whitespace-nowrap text-fg-faint">
            {formatDate(review.date)}
          </span>
        </div>

        <h3 className="truncate font-serif text-[16px] leading-[1.3] font-medium text-fg-title transition-colors group-hover:text-accent sm:line-clamp-2 sm:text-[19px] sm:whitespace-normal">
          {review.title}
        </h3>

        <span className="truncate text-[12px] text-fg-muted sm:text-[13px]">
          {review.subject}
        </span>

        <div className="mt-px">
          <Stars rating={review.rating} />
        </div>

        <div className="hidden sm:block">
          <p className="mt-[5px] line-clamp-2 font-serif text-[13px] leading-[1.55] text-fg-excerpt italic">
            {review.excerpt}
          </p>
        </div>
      </div>
    </Link>
  );
}
