export function StarIcon({
  filled,
  size = 13,
}: {
  filled: boolean;
  size?: number;
}) {
  const path =
    "M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.9-6.2 3.9 1.6-7L2 9.2l7.1-.6z";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill={filled ? "var(--color-accent)" : "none"}
      stroke={filled ? "none" : "var(--color-star-empty)"}
      strokeWidth={1.4}
    >
      <path d={path} />
    </svg>
  );
}

export function ChevronDownIcon() {
  return (
    <svg
      width="9"
      height="6"
      viewBox="0 0 9 6"
      aria-hidden="true"
      fill="none"
      stroke="oklch(0.55 0.01 55)"
      strokeWidth={1.4}
    >
      <path d="M1 1l3.5 3.5L8 1" />
    </svg>
  );
}

export function ArrowLeftIcon() {
  return (
    <svg
      width="12"
      height="10"
      viewBox="0 0 12 10"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
    >
      <path d="M11 5H1M5 1 1 5l4 4" />
    </svg>
  );
}
