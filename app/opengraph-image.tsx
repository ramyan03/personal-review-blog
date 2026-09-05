import { ImageResponse } from "next/og";
import { getReviews } from "@/lib/reviews";
import { ogFonts, SANS, SERIF } from "@/lib/og-fonts";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The card people see when the link is pasted somewhere. */
export default async function Image() {
  const [reviews, fonts] = await Promise.all([getReviews(), ogFonts()]);

  const earliest = reviews.reduce(
    (year, review) => Math.min(year, Number(review.date.slice(0, 4)) || year),
    9999,
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#141414",
          padding: "0 90px",
        }}
      >
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 104,
            color: "#f5f5f4",
            letterSpacing: "-0.02em",
          }}
        >
          {SITE_NAME}
        </div>

        <div
          style={{ width: 96, height: 2, background: "#c9a15a", margin: "44px 0" }}
        />

        <div
          style={{
            fontFamily: SANS,
            fontSize: 31,
            color: "#a3a3a3",
            textAlign: "center",
            lineHeight: 1.45,
          }}
        >
          {SITE_DESCRIPTION}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 56,
            display: "flex",
            fontFamily: SANS,
            fontSize: 21,
            letterSpacing: "0.18em",
            color: "#c9a15a",
          }}
        >
          {`${reviews.length} REVIEWS SINCE ${earliest === 9999 ? 2023 : earliest}`}
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
