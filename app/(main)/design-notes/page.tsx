import type { Metadata } from "next";
import CountBeat from "@/components/count-beat";
import DensityToggle from "@/components/design-notes/density-toggle";
import ScrollScrub from "@/components/design-notes/scroll-scrub";
import Uncrop from "@/components/design-notes/uncrop";
import GenreTag from "@/components/genre-tag";
import ReviewBody from "@/components/review-body";
import Stars, { formatRating } from "@/components/stars";
import { artworkDimensions } from "@/lib/artwork";
import { GENRES, type Genre } from "@/lib/genre";
import { formatDate, byline } from "@/lib/format";
import { getReview, getReviews } from "@/lib/reviews";
import "./design-notes.css";

/*
 * A bench, not a page of the site.
 *
 * Nine notes taken off the current Awwwards winners, each rebuilt in the
 * site's own materials so the question is whether it suits Ramyan Reviews
 * rather than whether it looked good on somebody else's portfolio. Every demo
 * runs on real reviews, because a proposal that only works on lorem ipsum is
 * not a proposal.
 *
 * Not linked from the header and not in the sitemap. It is noindex because it
 * is a working document that happens to be reachable over the internet, and a
 * search result for it would be worse than useless. Promote what survives into
 * the real pages, then delete the route: this directory plus
 * components/design-notes is the whole footprint.
 */

export const metadata: Metadata = {
  title: "Design notes",
  description:
    "Nine notes from the current Awwwards winners, rebuilt in the type and colour this site already uses.",
  robots: { index: false, follow: false },
};

const SOURCES = [
  { name: "AI in Design Report 2026", took: "the offset column, the eyebrow, the un-crop" },
  { name: "mesh3d, The State of the Gallery", took: "the counting beat and the corner HUD" },
  { name: "The Watch, by 60fps", took: "scroll as a scrubber, 39 screens of it" },
  { name: "Michael Gatt", took: "the index escape hatch" },
  { name: "Gionatan Nese", took: "the numbered density modes" },
  { name: "Aardvark Book Club", took: "cards dealing out of a stack" },
  { name: "illoca, and Zero", took: "scroll removed altogether, as a warning" },
];

export default async function DesignNotesPage() {
  const reviews = await getReviews();

  const byGenre = Object.fromEntries(
    GENRES.map((genre) => [
      genre,
      reviews.filter((review) => review.genre === genre).length,
    ]),
  ) as Record<Genre, number>;

  // The offset column needs a real piece of writing at full length: a short
  // take would not show the problem it solves.
  const specimenMeta =
    reviews.find((review) => !review.short && review.rating !== null) ??
    reviews[0];
  const [specimen, sizes] = await Promise.all([
    specimenMeta ? getReview(specimenMeta.slug) : null,
    artworkDimensions(),
  ]);

  /*
   * The un-crop demo wants a wide picture, and it wants the recorded width and
   * height so the box is reserved before the file decodes. Covers are 3:4 and
   * would open into a tall slot, which is not what the technique is for, so
   * this looks for the widest piece of artwork the manifest knows about.
   */
  const uncrop = (() => {
    let best: { src: string; width: number; height: number } | null = null;
    for (const [src, dim] of sizes) {
      if (dim.width <= dim.height) continue;
      if (!best || dim.width / dim.height > best.width / best.height) {
        best = { src, width: dim.width, height: dim.height };
      }
    }
    return best ? { ...best, alt: "Artwork from a review, opening on entry" } : null;
  })();

  return (
    <main className="dn-page mx-auto w-full max-w-[1420px] px-5 pt-8 pb-24 sm:px-10 lg:px-[72px] lg:pt-12 lg:pb-[140px]">
      <header className="max-w-[720px] pb-14 lg:pb-20">
        <span className="dn-eyebrow">Design notes</span>
        <h1 className="mt-4 mb-6 font-serif text-2xl leading-[1.08] font-medium tracking-[-0.02em] text-fg-bright italic lg:text-display">
          What the winners do
        </h1>
        <p className="font-serif text-lg leading-[1.6] text-fg-quote">
          Read off seven sites currently on the Awwwards winners list, then
          rebuilt here in Newsreader, Work Sans and the same neutral ground
          this site already uses. Sections 05 to 07 are all about scroll, which
          is where they differ from an ordinary site most. Nothing on this page
          is live anywhere else.
        </p>

        {/*
          The page was written as a set of proposals and six of them have since
          been built, so it would now be lying by omission. Rather than rewrite
          every verdict in the past tense, this says plainly which are live and
          leaves the arguments as they were made.
        */}
        <p className="mt-7 border-l border-accent pl-4 font-serif text-base leading-[1.6] text-fg-muted italic">
          Since this was written, 01, 02, 03, 04, 07 and 08 have shipped. The
          eyebrow went in at 12px rather than 11, keeping the scale at six steps
          and one display size. 06, the scrubber, was not taken: a pinned
          section wants its own scroll budget and the landing page is on
          mandatory snapping, so the two would have fought. 05 is research and
          has nothing to ship. Each verdict below is left as it was argued.
        </p>

        <ul className="mt-9 grid list-none gap-x-8 gap-y-3 p-0 sm:grid-cols-2">
          {SOURCES.map((source) => (
            <li key={source.name} className="flex flex-col gap-1">
              <span className="dn-eyebrow">{source.name}</span>
              <span className="font-serif text-sm text-fg-faint italic">
                {source.took}
              </span>
            </li>
          ))}
        </ul>
      </header>

      {/* ------------------------------------------------ 01 */}
      <Section
        num="01"
        kicker="Typography"
        title="The eyebrow label"
        source="AI in Design Report 2026 sets OUR PARTNERS and AN INFLECTION POINT in 11px letterspaced mono above every section. It is the single most consistent tell across every site looked at."
        lede="A micro label above a heading, telling you where you are before the heading tells you what it is. One class, no layout change, no new colour."
        verdict="Costs nothing structurally. Shown at 11px, which is below the bottom of the scale, so adopting it at this size means a seventh step. At the existing 12px it works too and reads slightly heavier than the reference sites."
      >
        {/* One stage, not three. The first draft showed without, with at
            12px and with at 11px side by side, and comparing three things at
            once made the idea look more complicated than it is. */}
        <div className="dn-stage dn-stage-split">
          <div>
            <span className="dn-tag">Now</span>
            <h3 className="m-0 font-serif text-xl leading-[1.15] font-medium text-fg-bright">
              Books
            </h3>
            <p className="mt-3 mb-0 font-serif text-base leading-[1.5] text-fg-muted">
              {byGenre.Books} reviews
            </p>
          </div>

          <div>
            <span className="dn-tag">With the eyebrow</span>
            <span className="dn-eyebrow">
              Books, {word(byGenre.Books)} reviews
            </span>
            <h3 className="mt-3 mb-0 font-serif text-xl leading-[1.15] font-medium text-fg-bright">
              Books
            </h3>
            <p className="mt-3 mb-0 font-serif text-base leading-[1.5] text-fg-muted">
              Everything read since 2023, newest first.
            </p>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------ 02 */}
      <Section
        num="02"
        kicker="Typography"
        title="Stretch the extremes"
        source="Aardvark runs a 100px headline against 13px body. AI in Design runs 96px against 11px. The ratio between the largest and smallest type on those pages is eight to ten times."
        lede="The current scale tops out at 82px and bottoms out at 12px, a range of under seven times. Widening both ends costs two token values and touches nothing else."
        verdict="The cheapest change on this page: two numbers in globals.css. Worth testing on a phone first, since the display size is a clamp and the floor moves too."
      >
        <div className="dn-stage">
          <span className="dn-tag">Display, now and proposed</span>
          <span className="dn-specimen dn-specimen-now">Ramyan Reviews</span>
          <span className="mt-2 mb-9 block font-serif text-sm text-fg-dim italic">
            clamp(40px, 7vw, 82px)
          </span>
          <span className="dn-specimen dn-specimen-next">Ramyan Reviews</span>
          <span className="mt-2 block font-serif text-sm text-fg-dim italic">
            clamp(44px, 9.5vw, 132px)
          </span>
        </div>

        <div className="dn-stage">
          <span className="dn-tag">The whole scale</span>
          <Ruler token="--text-micro" now="none" next="11px" gain />
          <Ruler token="--text-xs" now="12px" next="12px" />
          <Ruler token="--text-sm" now="14px" next="14px" />
          <Ruler token="--text-base" now="16px" next="16px" />
          <Ruler token="--text-lg" now="19px" next="19px" />
          <Ruler token="--text-xl" now="28px" next="28px" />
          <Ruler token="--text-2xl" now="40px" next="44px" gain />
          <Ruler token="--text-display" now="82px" next="132px" gain />
          <Ruler token="Ratio, top to bottom" now="6.8x" next="12x" gain />
        </div>
      </Section>

      {/* ------------------------------------------------ 03 */}
      <Section
        num="03"
        kicker="Layout"
        title="Offset the review column"
        source="AI in Design sets its body column starting at x=533 in a 1272px viewport. The entire left half of the screen is empty, on purpose. None of the five centre a text column."
        lede="Move the measure right of centre and give the vacated margin a job: genre, date, rating, all of it sticky so it stays readable at any point in a long review."
        verdict={
          specimen
            ? "Shown on a real review below. The rail collapses above the body under 860px, which is where the current centred layout already lives, so phones are unaffected."
            : "No review long enough to demonstrate was found in the content directory."
        }
      >
        {specimen ? (
          <div className="dn-stage">
            <span className="dn-tag">Live, on a real review</span>
            <div className="dn-review">
              <div className="dn-review-rail flex flex-col gap-3">
                <GenreTag genre={specimen.genre} />
                <h3 className="m-0 font-serif text-base leading-[1.3] font-medium text-fg-title">
                  {specimen.title}
                </h3>
                <span className="text-sm text-fg-muted">
                  {byline(specimen)}
                </span>
                {specimen.rating !== null ? (
                  <div className="flex items-center gap-2 md:justify-end">
                    <Stars rating={specimen.rating} />
                    <span className="text-xs text-fg-faint">
                      {formatRating(specimen.rating)} of 5
                    </span>
                  </div>
                ) : null}
                <span className="text-xs tracking-[0.14em] text-fg-faint uppercase">
                  {formatDate(specimen.date)}
                </span>
              </div>

              <ReviewBody document={specimen.body} sizes={sizes} />
            </div>
          </div>
        ) : null}
      </Section>

      {/* ------------------------------------------------ 04 */}
      <Section
        num="04"
        kicker="Motion"
        title="A counting beat"
        source="mesh3d gives (514) Entries to date a whole screen, assembles the digits out of a particle field, then dissolves them into (408) Websites. One scroll gesture, one number."
        lede="The hero already says the review count in a line of 12px uppercase. The same fact, given a beat of its own, is the difference between a statistic and a claim."
        verdict="Built without the .panel class on purpose: adding it anywhere turns on mandatory scroll snapping for the whole document. On the landing page that is the design; on a page of stacked demos it would trap you."
      >
        <div className="dn-stage">
          <span className="dn-tag">Scroll it into view to run it</span>
          <CountBeat
            beats={[
              {
                value: reviews.length,
                label: "Reviews",
                note: "Everything published since 2023.",
              },
              {
                value: byGenre.Books,
                label: "Books",
                note: "Novels, mostly finished on the GO.",
              },
              {
                value: byGenre.Film,
                label: "Film",
                note: "Seen in a cinema wherever possible.",
              },
              {
                value: byGenre.Anime,
                label: "Anime",
                note: "Series and features together.",
              },
            ]}
          />
        </div>
      </Section>

      {/* ------------------------------------------------ 05 */}
      <Section
        num="05"
        kicker="Scroll"
        title="Five ways they handle scroll"
        source="Measured rather than guessed: each site was loaded and its document height, pinned elements and response to a programmatic scroll were read off the live page."
        lede="The interesting split is not how the effects look. It is whether the browser is still scrolling at all. Two of these replace the scrollbar outright, and that decision costs far more than it looks."
        verdict="B, C and E suit a site made of prose. A and D do not, and the reason is not taste: they break find in page, keyboard scrolling, deep links and the restored position when you come back to a review."
      >
        <div className="dn-stage">
          <span className="dn-tag">What each one actually does</span>
          <div className="dn-table">
            <ScrollRow
              letter="A"
              name="Scroll replaced"
              site="illoca.unseen.co, why.zero.university"
              detail="document.scrollHeight equals the viewport exactly, so there is nothing to scroll. The wheel is intercepted and the content is moved by transform. Calling scrollTo does nothing at all."
              suits={false}
              suitsLabel="No"
            />
            <ScrollRow
              letter="B"
              name="Scroll as a scrubber"
              site="thewatch.60fps.fr"
              detail="A 51,373px document, which is 39 viewports, and none of that height is content. It exists to give the reader something to drag. One pinned canvas reads the offset as a playhead. Native scrolling intact."
              suits
              suitsLabel="Yes"
            />
            <ScrollRow
              letter="C"
              name="Beats in a pinned frame"
              site="mesh3d.gallery"
              detail="The four corner labels never move. Each range of scroll swaps one number and one caption for the next, so a gesture advances a slide rather than a distance."
              suits
              suitsLabel="Yes"
            />
            <ScrollRow
              letter="D"
              name="A camera through z-space"
              site="michaelgatt.com, gionatannese.com"
              detail="Scroll moves you through a field of images arranged in depth rather than down a page. There is no document order to speak of, which is why both offer an index view as a way out."
              suits={false}
              suitsLabel="No"
            />
            <ScrollRow
              letter="E"
              name="Scroll decorates the document"
              site="stateofaidesign.com, aardvarkbookclub.com"
              detail="Ordinary native scrolling. Elements change state as they enter: a photo un-crops from a small window to full bleed, a stack of cards deals itself out flat."
              suits
              suitsLabel="Yes"
            />
          </div>
        </div>

        <p className="mt-7 mb-0 max-w-[62ch] font-serif text-base leading-[1.6] text-fg-faint italic">
          Worth knowing: every one of these is hand written JavaScript. Not one
          of the five used CSS scroll driven animation, which now does most of
          E natively with no script and ties the effect to scroll position
          rather than to a fixed duration. Safari is the reason it is not in
          use yet.
        </p>
      </Section>

      {/* ------------------------------------------------ 06 */}
      <Section
        num="06"
        kicker="Scroll"
        title="Scrub a pinned section"
        source="Technique B, from thewatch.60fps.fr, folded together with the beats of C. The page height is a budget, the frame is pinned, and the scroll offset is a playhead."
        lede="Four reviews advancing inside a frame that never moves. Every frame is a direct function of where the scrollbar is, which is what makes it feel like a control rather than a performance."
        verdict="Demonstrated inside its own 440px scroll box rather than by making this page 39 screens tall. Sticky resolves against the nearest scrolling ancestor, so the mechanism is identical and the page keeps its own scrolling."
      >
        <div className="dn-stage">
          <span className="dn-tag">Scroll inside the frame</span>
          <ScrollScrub reviews={reviews.slice(0, 4)} />
        </div>
      </Section>

      {/* ------------------------------------------------ 07 */}
      <Section
        num="07"
        kicker="Scroll"
        title="Un-crop on entry"
        source="Technique E, from AI in Design 2026. A photograph starts clipped inside a narrow window and opens to full bleed as it enters the viewport."
        lede="The picture never moves or scales. Only the window over it widens, which is the difference between a shutter opening and something sliding past. It is one transition on clip-path."
        verdict={
          uncrop
            ? "The cheapest of the scroll ideas and the only one that would suit a review page directly: the leading plate on a review opens as you reach it. Built on the same observer as components/reveal.tsx."
            : "No artwork with recorded dimensions was found to demonstrate this on."
        }
      >
        {uncrop ? (
          <div className="dn-stage">
            <span className="dn-tag">Scroll it into view</span>
            <Uncrop
              src={uncrop.src}
              alt={uncrop.alt}
              width={uncrop.width}
              height={uncrop.height}
            />
          </div>
        ) : null}
      </Section>

      {/* ------------------------------------------------ 08 */}
      <Section
        num="08"
        kicker="Layout"
        title="Corner anchored entry"
        source="mesh3d puts SCROLL TO DIVE IN top left, the wordmark top centre, AUDIO OFF top right, SHARE bottom left and the credit bottom right, and never moves any of them."
        lede="The hero currently stacks the scroll cue in the centre under the title. Pushing the same information into the four corners leaves the middle to the title and reads as a frame rather than a page."
        verdict="Careful here: the round scroll button is one of only two things on the site that is fully round, and it earns that. This version keeps it and only moves the labels outward."
      >
        <div className="dn-stage">
          <span className="dn-tag">A stand in for the hero viewport</span>
          <div className="dn-viewport">
            <span className="dn-hud dn-hud-tl">
              Scroll to read <span className="dn-hud-arrow">&darr;</span>
            </span>
            <span className="dn-hud dn-hud-tr">Books, film, anime</span>
            <span className="dn-hud dn-hud-bl">Since 2023</span>
            <span className="dn-hud dn-hud-br">
              {reviews.length} reviews
            </span>

            <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
              <span className="dn-specimen dn-specimen-next">
                Ramyan Reviews
              </span>
              <p className="mt-6 max-w-[420px] font-serif text-base leading-[1.6] text-fg-quote">
                Books, films, and anime, reviewed as I finish them.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------ 09 */}
      <Section
        num="09"
        kicker="Index"
        title="A density toggle"
        source="Michael Gatt keeps INDEX VIEW available in the middle of a 3D field you fly through. Gionatan Nese numbers three arrangements of the same eighteen thumbnails, 1 2 3."
        lede="Grid or list, over the same reviews, remembered per reader. Both sites offer an atmospheric browse and a scannable one without asking you to choose once and for all."
        verdict="This also solves something already on the list: the three column index runs about a third taller than the four column layout it replaced. The list is the version that fits on a screen."
      >
        <div className="dn-stage">
          <span className="dn-tag">The first six, either way</span>
          <DensityToggle reviews={reviews.slice(0, 6)} />
        </div>
      </Section>

      <p className="mt-16 max-w-[620px] font-serif text-base leading-[1.6] text-fg-faint italic">
        None of the seven is a reading site. Most are portfolios, one is a
        report and one sells a watch, and the machinery they win on is there
        because on those sites the images are the content. Two of them stop the
        browser scrolling at all, which a site made of reviews cannot afford:
        find in page stops working, so does the keyboard, so does coming back to
        where you were. What is above is the part that survives being pointed at
        prose.
      </p>
    </main>
  );
}

/** Small counts read better spelled out in a label than set as a digit. */
function word(n: number): string {
  const words = [
    "no",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
  ];
  return words[n] ?? String(n);
}

function ScrollRow({
  letter,
  name,
  site,
  detail,
  suits,
  suitsLabel,
}: {
  letter: string;
  name: string;
  site: string;
  detail: string;
  suits: boolean;
  suitsLabel: string;
}) {
  return (
    <div className="dn-table-row">
      <div>
        <span className="dn-num">{letter}</span>
        <span className="mt-1 block font-serif text-base leading-[1.3] font-medium text-fg-title">
          {name}
        </span>
        <span className="mt-1 block font-serif text-sm text-fg-dim italic">
          {site}
        </span>
      </div>

      <p className="m-0 font-serif text-base leading-[1.6] text-fg-body">
        {detail}
      </p>

      <div>
        <span className="dn-eyebrow">Suits prose</span>
        <span
          className={`mt-1 block font-serif text-base font-medium ${
            suits ? "dn-verdict-yes" : "text-fg-dim"
          }`}
        >
          {suitsLabel}
        </span>
      </div>
    </div>
  );
}

function Ruler({
  token,
  now,
  next,
  gain = false,
}: {
  token: string;
  now: string;
  next: string;
  gain?: boolean;
}) {
  return (
    <div className="dn-ruler">
      <span>{token}</span>
      <span className="flex items-baseline gap-3">
        <span>{now}</span>
        <span aria-hidden="true">&rarr;</span>
        <span className={gain ? "dn-ruler-gain" : undefined}>{next}</span>
      </span>
    </div>
  );
}

function Section({
  num,
  kicker,
  title,
  lede,
  source,
  verdict,
  children,
}: {
  num: string;
  kicker: string;
  title: string;
  lede: string;
  source: string;
  verdict: string;
  children: React.ReactNode;
}) {
  return (
    <section className="dn-section" id={`s${num}`}>
      <div className="dn-rail">
        <span className="dn-num">{num}</span>
        <span className="dn-eyebrow" style={{ marginTop: 8 }}>
          {kicker}
        </span>
      </div>

      <div>
        <h2 className="m-0 font-serif text-xl leading-[1.15] font-medium tracking-[-0.01em] text-fg-bright lg:text-2xl">
          {title}
        </h2>
        <p className="mt-4 mb-0 max-w-[62ch] font-serif text-lg leading-[1.65] text-fg-body">
          {lede}
        </p>
        <p className="mt-4 mb-0 max-w-[62ch] font-serif text-base leading-[1.6] text-fg-faint italic">
          {source}
        </p>

        {children}

        <p className="mt-7 mb-0 max-w-[62ch] text-sm leading-[1.6] text-fg-muted">
          <span className="dn-eyebrow" style={{ marginBottom: 6 }}>
            Cost
          </span>
          {verdict}
        </p>
      </div>
    </section>
  );
}
