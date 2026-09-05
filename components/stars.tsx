const STAR_PATH =
  "M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.9-6.2 3.9 1.6-7L2 9.2l7.1-.6z";

/**
 * Ratings run in half steps, so each star is drawn twice: the empty outline,
 * then the filled version clipped to however much of that star is earned.
 */
export default function Stars({
  rating,
  size = 13,
}: {
  rating: number;
  size?: number;
}) {
  const value = Math.max(0, Math.min(5, rating));

  return (
    <div
      className="flex items-center gap-[3px]"
      role="img"
      aria-label={`${formatRating(value)} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => {
        const portion = Math.max(0, Math.min(1, value - i));
        return <Star key={i} portion={portion} size={size} />;
      })}
    </div>
  );
}

function Star({ portion, size }: { portion: number; size: number }) {
  return (
    <span
      className="relative inline-block"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-star-empty)"
        strokeWidth={1.4}
        className="absolute inset-0"
      >
        <path d={STAR_PATH} />
      </svg>
      {portion > 0 ? (
        <span
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${portion * 100}%` }}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="var(--color-accent)"
            className="block"
          >
            <path d={STAR_PATH} />
          </svg>
        </span>
      ) : null}
    </span>
  );
}

/** "4.5" but "5", so whole numbers do not pick up a pointless decimal. */
export function formatRating(rating: number): string {
  return Number.isInteger(rating) ? String(rating) : rating.toFixed(1);
}
