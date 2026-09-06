import { promises as fs } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getReview } from "@/lib/reviews";
import { formatRating } from "@/components/stars";
import { byline } from "@/lib/format";
import { ogFonts, SANS, SERIF } from "@/lib/og-fonts";
import { SITE_NAME } from "@/lib/site";

/* Build it once per review, at build time. Without this the route is treated
   as dynamic and runs in a function with no content/ or public/ to read. */
export const dynamic = "force-static";

export const alt = "A review on " + SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * A review's own card: the artwork beside the title, rating and opening line.
 *
 * The cover on its own will not do. Jackets and posters are 3:4, and every
 * feed crops a link image to roughly 1.91:1 from the centre, which slices the
 * top and bottom off a book cover. Composing the card here means the artwork
 * is placed rather than cropped.
 *
 * The image is read off disk and inlined, because at build time there is no
 * server to fetch it from over HTTP.
 */
/*
 * Prerendered for every slug at build time, where content/ and public/ both
 * exist. It previously carried a generateImageMetadata export, which adds a
 * [__metadata_id__] segment and makes the route dynamic: it then ran per
 * request inside a function that has neither directory, the reader found no
 * review, and the card came out blank. The slugs come from the page.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [review, fonts] = await Promise.all([getReview(slug), ogFonts()]);

  if (!review) {
    return new ImageResponse(<div style={{ background: "#141414" }} />, size);
  }

  let cover: string | null = null;
  if (review.cover) {
    try {
      const file = path.join(process.cwd(), "public", review.cover);
      const bytes = await fs.readFile(file);
      cover = `data:image/jpeg;base64,${bytes.toString("base64")}`;
    } catch {
      cover = null;
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          background: "#141414",
          padding: "0 84px",
        }}
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt=""
            width={330}
            height={440}
            style={{ objectFit: "cover", borderRadius: 4, flexShrink: 0 }}
          />
        ) : null}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: SANS,
              fontSize: 20,
              letterSpacing: "0.16em",
              color: "#c9a15a",
              marginBottom: 22,
            }}
          >
            {review.genre.toUpperCase()}
          </div>

          <div
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: review.title.length > 34 ? 54 : 66,
              lineHeight: 1.12,
              color: "#f5f5f4",
              letterSpacing: "-0.02em",
            }}
          >
            {review.title}
          </div>

          <div
            style={{
              fontFamily: SANS,
              fontSize: 26,
              color: "#a3a3a3",
              marginTop: 20,
            }}
          >
            {byline(review)}
          </div>

          {review.rating ? (
            <div
              style={{
                display: "flex",
                fontFamily: SANS,
                fontSize: 24,
                color: "#c9a15a",
                marginTop: 30,
                letterSpacing: "0.06em",
              }}
            >
              {`${formatRating(review.rating)} / 5`}
            </div>
          ) : null}

          {/* In the flow rather than pinned: Satori resolves an absolute box
              against the root, which dropped this on top of the byline. */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 44,
            }}
          >
            <div style={{ width: 46, height: 2, background: "#3a3a3a" }} />
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: "italic",
                fontSize: 23,
                color: "#7a7a7a",
              }}
            >
              {SITE_NAME}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
