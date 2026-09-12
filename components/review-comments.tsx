import CommentForm from "@/components/comment-form";
import { formatDate, type Comment } from "@/lib/format";

/**
 * Comments on a review.
 *
 * Content, not a service: they are typed into /keystatic and ship in the static
 * build, so there is nothing to post to, nothing to moderate and nothing to
 * rate limit. The section is simply absent when a review has none, rather than
 * showing an empty box, because an empty comment box under a review reads worse
 * than no comment box at all.
 *
 * Set as quietly as the rest of the page: a rule, a label, and the writing.
 * No avatars, no cards, no reply affordance, since there is nothing to reply
 * with.
 */
export default function ReviewComments({
  slug,
  comments,
}: {
  slug: string;
  comments: Comment[];
}) {
  return (
    <section className="mt-14 border-t border-rule pt-8">
      <h2 className="mb-8 text-xs font-semibold tracking-[0.16em] text-fg-dim uppercase">
        {comments.length === 0
          ? "Comments"
          : comments.length === 1
            ? "One comment"
            : `${comments.length} comments`}
      </h2>

      <ul className="m-0 list-none p-0">
        {comments.map((comment, index) => (
          <li
            key={`${comment.name}-${index}`}
            className="border-b border-row py-6 last:border-0 last:pb-0 first:pt-0"
          >
            <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-serif text-base font-medium text-fg-title">
                {comment.name}
              </span>
              {comment.date ? (
                <span className="text-xs text-fg-faint">
                  {formatDate(comment.date)}
                </span>
              ) : null}
            </div>
            <p className="m-0 max-w-[62ch] font-serif text-base leading-[1.7] text-fg-body">
              {comment.text}
            </p>
          </li>
        ))}
      </ul>

      <div className={comments.length > 0 ? "mt-10" : ""}>
        <CommentForm slug={slug} />
      </div>
    </section>
  );
}
