import type { Metadata } from "next";
import ReviewIndex from "@/components/review-index";
import { GENRES } from "@/lib/genre";
import { getReviews } from "@/lib/reviews";

export const metadata: Metadata = {
  title: "Index",
};

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string }>;
}) {
  const { genre } = await searchParams;
  const reviews = await getReviews();

  // `/reviews?genre=film` opens the index with that pill already selected.
  const initialGenre =
    GENRES.find((option) => option.toLowerCase() === genre?.toLowerCase()) ??
    "All";

  return (
    <main className="pb-20 lg:pb-[120px]">
      <div className="px-5 pt-1 pb-5 sm:px-10 lg:px-[72px] lg:pb-2">
        <p className="max-w-[560px] font-serif text-[15px] leading-[1.5] text-fg-muted italic lg:text-[18px]">
          Notes on books, films, and anime — kept like a reading log, not a
          scorecard.
        </p>
      </div>
      <ReviewIndex reviews={reviews} initialGenre={initialGenre} />
    </main>
  );
}
