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
      className={
        size === "md"
          ? "inline-flex items-center rounded-full border px-[11px] py-[5px] text-[10px] font-semibold tracking-[0.08em] uppercase"
          : "inline-flex items-center rounded-full border px-[9px] py-[4px] text-[10px] font-semibold tracking-[0.08em] uppercase"
      }
      style={{
        background: theme.pillBg,
        color: theme.pillColor,
        borderColor: theme.pillBorder,
      }}
    >
      {genre}
    </span>
  );
}
