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

| URL          | What it is                                                    |
| ------------ | ------------------------------------------------------------- |
| `/`          | The landing page: hero, genre panels, shelves, closing quote    |
| `/reviews`   | The full archive, with genre / rating filters and sort         |
| `/reviews/…` | An individual review                                           |
| `/about`     | About page                                                     |
| `/contact`   | Contact page: email and optional links                         |
| `/keystatic` | The editing dashboard                                          |

Other scripts: `npm run build` (production build), `npm start` (serve the
build), `npm run lint`.

Every page shares one root layout (`app/(site)/layout.tsx`) with the same header
and footer, so `Reviews · About · Contact` is reachable from anywhere.

## Where the content lives

All content is plain files in the repo. There is no database.

```
content/
  about.mdoc                  # the About page (Keystatic singleton)
  contact.mdoc                # the Contact page (email, links, body)
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
3. **About** and **Contact** edit those two pages. Contact also holds the email
   address and an "Elsewhere" list of links (label, handle, URL). Leave the
   list empty and the section is hidden.
4. Hit **Save**. Because storage is set to `{ kind: 'local' }`, Keystatic writes
   the `.mdoc` files straight into your working tree. Nothing is sent anywhere.
   The dev server picks the change up immediately.
5. Publishing is a git operation:

   ```bash
   git add content
   git commit -m "Add review: …"
   git push
   ```

   Vercel rebuilds on push and the new review is live.

Local storage mode means the dashboard is a **local authoring tool**. It edits
files on the machine running the dev server, so it is not usable on the
deployed site. If you ever want to edit from a browser on production instead,
switch `storage` in `keystatic.config.ts` to
`{ kind: 'github', repo: 'ramyan03/personal-review-blog' }` and add the GitHub
app credentials Keystatic asks for; the schema and all pages stay exactly the
same.

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel, **Add New → Project** and import the repo. The framework is
   detected automatically; the defaults (`npm install`, `next build`) are
   correct.
3. Deploy. **No environment variables or secrets are required**. Local storage
   mode reads content from the repo at build time.

New reviews go live by committing the files under `content/` and pushing, as
above.

## Notes on the design

- **One layout, one header.** Home, archive, review, about and contact all
  render inside `app/(site)/`, so navigation never changes shape. Home is a
  short page, not a full-screen scroll sequence: its job is to show the newest
  reviews and hand you off to `/reviews`.
- **`/` vs `/reviews`.** `/` is the landing page, a full-height scroll with its
  own root layout and no site header. It is the way in; every panel and shelf
  on it links into `/reviews`, which is the complete archive with search,
  genre / rating filters and sorting. The genre panels jump to that genre's
  shelf, and each shelf heading links to `/reviews?genre=film` and friends.
- **Search needs no database.** The archive page loads all reviews at build
  time and hands them to a client component, which filters title, author or
  director, and excerpt in memory. The header box just writes `?q=` and the
  archive reads it, which is why every page here is static.
- **Ratings run in half steps.** `rating` is optional and accepts 1 to 5 in
  increments of 0.5. Each star is drawn twice, an outline and a filled copy
  clipped to the earned fraction. No rating means no stars, and the rating
  filter hides itself when nothing is rated.
- **Cover art is optional.** Attach a poster or jacket with the Cover art field
  and it renders in place of the letter block. See
  [`public/posters/README.md`](./public/posters/README.md).
- **Both themes.** Dark is the default look and the site follows the operating
  system, but the toggle in the header lets a reader pick a side; the choice is
  stamped on `<html>` as `data-theme` and remembered in `localStorage`. An
  inline script in the layout applies it before first paint so there is no
  flash. Every colour is a token in [`app/globals.css`](./app/globals.css) and
  nothing in the components hardcodes a colour.
- **No cover images.** Each review's "cover" is a genre-tinted rectangle with
  the title's first letter set large in italic serif. Genres share one
  lightness/chroma and differ only in hue (Books 145, Film 255, Anime 15), so
  tags, covers and genre cards stay tonally consistent. Only the hue is fixed
  per genre; the lightness and chroma are theme tokens, which is what lets the
  same three hues work on a dark and a light ground.
- **Fonts** are Newsreader (serif: headings, titles, bylines, quotes) and
  Work Sans (sans: nav, labels, meta), loaded via `next/font/google`.
- **One type scale.** Six steps plus a display size, defined as `--text-*`
  tokens. No component uses an arbitrary pixel size; the only exceptions are
  the oversized cover initial and the review drop cap, which are drawings.
- **Header controls.** Back arrow (browser history), home icon (the landing
  page), search, the page links, and the theme toggle.
- **The header rule slides.** A single underline element moves between the nav
  items rather than each item owning a border, so nothing changes height when
  the active page changes. `scrollbar-gutter: stable` keeps short pages from
  shifting the layout sideways.
- Filtering and sorting on `/reviews` happens client-side: the page loads every
  review server-side and hands the list to a client component that filters and
  sorts in state. No API route involved. `/reviews?genre=film` (or `books` /
  `anime`) opens the archive with that pill preselected, so `/reviews` renders
  per request rather than as a static page.

## Project layout

```
app/
  (site)/               # "/", "/reviews", "/reviews/[slug]", "/about", "/contact"
  (keystatic)/keystatic # the dashboard (own root layout, no site styles)
  api/keystatic/        # Keystatic route handler
components/             # header, footer, review card, filter bar, stars, icons
lib/                    # Keystatic reader, content helpers, genre colours, fonts
content/                # the reviews, About and Contact pages
keystatic.config.ts     # CMS schema
```
