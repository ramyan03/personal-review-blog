# Ramyan Reviews

A personal blog for book, film, and anime reviews. Dark, typography-first, and
edited through a Keystatic dashboard so reviews can be written and published
without touching code.

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **Keystatic CMS** in local (git) storage mode, dashboard at `/keystatic`
- Deploys to **Vercel**

## Getting started

```bash
npm install
npm run dev
```

Then open:

| URL          | What it is                                                  |
| ------------ | ----------------------------------------------------------- |
| `/`          | Cinematic landing page (scroll-through intro)               |
| `/reviews`   | The index — review grid with genre / rating filters and sort |
| `/reviews/…` | An individual review                                        |
| `/about`     | About page                                                  |
| `/keystatic` | The editing dashboard                                       |

Other scripts: `npm run build` (production build), `npm start` (serve the
build), `npm run lint`.

## Where the content lives

All content is plain files in the repo — there is no database.

```
content/
  about.mdoc                  # the About page (Keystatic singleton)
  reviews/
    the-remains-of-the-day.mdoc
    paris-texas.mdoc
    …                         # one file per review; filename = URL slug
```

Each review file is YAML frontmatter plus a Markdoc body:

```yaml
---
title: The Remains of the Day
subject: Kazuo Ishiguro # "Author / Director"
genre: Books # Books | Film | Anime
rating: 5 # 1–5
date: 2026-09-02
excerpt: >-
  Short teaser shown on the index grid.
---
The review body, in markdown…
```

The schema lives in [`keystatic.config.ts`](./keystatic.config.ts); pages read
it through `createReader` in [`lib/reader.ts`](./lib/reader.ts).

## Using the `/keystatic` dashboard

1. Run `npm run dev` and open <http://localhost:3000/keystatic>.
2. **Reviews → New** to add an entry. Fill in title (which also generates the
   URL slug), author/director, genre, rating, date, excerpt, and write the
   review in the rich-text editor. Formatting, links and dividers are enabled;
   a blockquote renders as the centered pull-quote seen on review pages.
3. **About** edits the About page body.
4. Hit **Save**. Because storage is set to `{ kind: 'local' }`, Keystatic writes
   the `.mdoc` files straight into your working tree — nothing is sent anywhere.
   The dev server picks the change up immediately.
5. Publishing is a git operation:

   ```bash
   git add content
   git commit -m "Add review: …"
   git push
   ```

   Vercel rebuilds on push and the new review is live.

Local storage mode means the dashboard is a **local authoring tool** — it edits
files on the machine running the dev server, so it is not usable on the
deployed site. If you ever want to edit from a browser on production instead,
switch `storage` in `keystatic.config.ts` to
`{ kind: 'github', repo: 'owner/repo' }` and add the GitHub app credentials
Keystatic asks for; the schema and all pages stay exactly the same.

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel, **Add New → Project** and import the repo. The framework is
   detected automatically; the defaults (`npm install`, `next build`) are
   correct.
3. Deploy. **No environment variables or secrets are required** — local storage
   mode reads content from the repo at build time.

New reviews go live by committing the files under `content/` and pushing, as
above.

## Notes on the design

- **Dark mode only.** This is an intentional scope decision — there is no
  light theme and no theme toggle. The palette is a set of warm near-black
  oklch tokens defined in [`app/globals.css`](./app/globals.css).
- **No cover images.** Each review's "cover" is a genre-tinted rectangle with
  the title's first letter set large in italic serif. Genres share one
  lightness/chroma and differ only in hue (Books 145, Film 255, Anime 15), so
  tags, covers and landing-page panels stay tonally consistent.
- **Fonts** are Newsreader (serif — headings, titles, bylines, quotes) and
  Work Sans (sans — nav, labels, meta), loaded via `next/font/google`.
- **Landing page motion** uses an `IntersectionObserver` that toggles a CSS
  class for the fade-and-rise reveals, rather than a CSS scroll timeline
  (`animation-timeline: view()`), so the animation works outside Chromium. All
  motion is disabled under `prefers-reduced-motion`.
- Filtering and sorting on `/reviews` happens client-side: the page loads every
  review server-side and hands the list to a client component that filters and
  sorts in state. No API route involved.

## Project layout

```
app/
  (landing)/            # "/" — the landing page (own root layout, no site header)
  (site)/               # "/reviews", "/reviews/[slug]", "/about" (site header)
  (keystatic)/keystatic # the dashboard (own root layout, no site styles)
  api/keystatic/        # Keystatic route handler
components/             # header, review card, filter bar, stars, icons
lib/                    # Keystatic reader, content helpers, genre colours, fonts
content/                # the reviews and About page
keystatic.config.ts     # CMS schema
```
