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
      stroke="var(--color-fg-soft)"
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

export function HomeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.4V20h13V9.4" />
      <path d="M9.8 20v-5.6h4.4V20" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.4 15.4 4.1 4.1" />
    </svg>
  );
}
