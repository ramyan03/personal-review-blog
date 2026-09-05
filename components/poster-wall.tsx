const COLUMNS = 5;

/**
 * The hero background: every cover on the site, dealt into columns that drift
 * slowly in alternating directions behind the title. A review blog's most
 * characteristic material is the artwork, so the hero is made of it rather
 * than of decoration. Each column is doubled so the loop has no seam, and the
 * whole thing is decorative, hidden from assistive tech, and stopped entirely
 * under prefers-reduced-motion.
 */
export default function PosterWall({ covers }: { covers: string[] }) {
  if (covers.length === 0) return null;

  const columns: string[][] = Array.from({ length: COLUMNS }, () => []);
  covers.forEach((cover, i) => {
    columns[i % COLUMNS].push(cover);
  });

  return (
    <div className="poster-wall" aria-hidden="true">
      {columns.map((column, index) => (
        <div
          key={index}
          className={`poster-col poster-col-${index + 1}`}
          data-col={index + 1}
        >
          {[...column, ...column].map((cover, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`${cover}-${i}`}
              src={cover}
              alt=""
              loading={index < 3 && i === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
