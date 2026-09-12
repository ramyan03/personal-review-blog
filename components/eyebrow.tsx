/**
 * The micro label that sits above a heading and says where you are before the
 * heading says what it is.
 *
 * Set at --text-xs, the existing floor of the scale, rather than at the 11px
 * the reference sites use. Eleven would have meant a seventh step below
 * --text-xs for the sake of one pixel, and the scale rule is worth more than
 * the pixel.
 *
 * The index already had this pattern in two places, on Latest and on Short
 * takes, written out longhand both times. Those now come through here too, so
 * there is one definition of what an eyebrow is.
 */
/*
 * Colour is a prop rather than something a caller overrides through className.
 * Passing `text-accent` alongside the default `text-fg-faint` puts two
 * utilities of equal specificity on one element, and which one wins is decided
 * by their order in Tailwind's generated stylesheet, not by the order they are
 * written in the attribute. That is a coin toss dressed up as an override.
 *
 * An inline style is still the right answer for the genre panels, whose colour
 * is computed per hue and cannot be a class at all. Inline styles outrank both.
 */
const TONE = {
  faint: "text-fg-faint",
  accent: "text-accent",
  /* For callers that set colour themselves, through `style` or a parent. */
  inherit: "",
} as const;

export default function Eyebrow({
  children,
  as: Tag = "span",
  tone = "faint",
  className = "",
  style,
}: {
  children: React.ReactNode;
  /** Headings that happen to be set as eyebrows pass their own tag. */
  as?: "span" | "h2" | "h3" | "p";
  tone?: keyof typeof TONE;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Tag
      className={`block text-xs font-semibold tracking-[0.18em] uppercase ${TONE[tone]} ${className}`.trim()}
      style={style}
    >
      {children}
    </Tag>
  );
}
