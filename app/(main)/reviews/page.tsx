import { redirect } from "next/navigation";
import { REVIEWS_ANCHOR } from "@/lib/links";

/*
 * There is one review index and it lives at the foot of the landing page.
 * This route used to render a second copy of it, which meant scrolling to the
 * bottom of the home page landed you on something that looked like /reviews
 * but was a different page with its own heading and its own header. Keeping
 * the URL alive and sending it to the real thing preserves every existing
 * link, including ?genre= and ?q=, without maintaining two of anything.
 */
export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    const first = Array.isArray(value) ? value[0] : value;
    if (first) query.set(key, first);
  }

  const qs = query.toString();
  redirect(qs ? `/?${qs}#${REVIEWS_ANCHOR}` : `/#${REVIEWS_ANCHOR}`);
}
