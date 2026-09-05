import { genreTheme, type Genre } from "@/lib/genre";

export default function GenreTag({
  genre,
  size = "sm",
}: {
  genre: Genre;
  size?: "sm" | "md";
}) {
  const theme = genreTheme(genre);
  return (
    <span
      className={`inline-flex items-center gap-[6px] font-semibold tracking-[0.14em] uppercase ${
        size === "md" ? "text-xs" : "text-xs"
      }`}
      style={{ color: theme.pillColor }}
    >
      <span
        aria-hidden="true"
        className="inline-block h-[5px] w-[5px] rounded-full"
        style={{ background: "currentColor" }}
      />
      {genre}
    </span>
  );
}
