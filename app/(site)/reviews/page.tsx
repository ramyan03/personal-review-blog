import { Suspense } from "react";
import type { Metadata } from "next";
import ReviewIndex from "@/components/review-index";
import { getReviews } from "@/lib/reviews";

export const metadata: Metadata = {
  title: "Reviews",
};

export default async function ReviewsPage() {
  const reviews = await getReviews();

  return (
    <main className="pb-20 lg:pb-[120px]">
      <div className="mx-auto max-w-[1420px] px-5 pt-1 pb-5 sm:px-10 lg:px-[72px] lg:pb-2">
        <h1 className="m-0 font-serif text-xl leading-[1.15] font-medium tracking-[-0.01em] text-fg-bright lg:text-2xl">
          Reviews
        </h1>
        <p className="mt-3 max-w-[560px] font-serif text-base leading-[1.5] text-fg-muted lg:text-lg">
          Everything so far. Search, filter by genre or rating, or change the
          order.
        </p>
      </div>
      {/*
       * The genre and search term live in the query string and are read on the
       * client, so this page prerenders as static HTML and still responds to
       * /reviews?genre=film or /reviews?q=kon.
       */}
      <Suspense fallback={null}>
        <ReviewIndex reviews={reviews} />
      </Suspense>
    </main>
  );
}
