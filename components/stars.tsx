import { StarIcon } from "@/components/icons";

export default function Stars({
  rating,
  size = 13,
}: {
  rating: number;
  size?: number;
}) {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div
      className="flex items-center gap-[3px]"
      role="img"
      aria-label={`${filled} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon key={i} filled={i < filled} size={size} />
      ))}
    </div>
  );
}
