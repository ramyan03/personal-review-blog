# Cover art

Drop poster and jacket images in this folder and attach them to a review with
the **Cover art** field in `/keystatic`. Keystatic writes the filename into the
review's frontmatter as `cover: /posters/<name>`.

A review without cover art falls back to a genre-tinted block with the title's
first letter, so the grid stays aligned whether or not everything has an image.

## What to use

- Roughly 3:4, around 600x800. The grid never renders one larger than about
  400px wide, so anything bigger is wasted bytes.
- Prefer `.webp` or `.jpg`. Keep each file under ~150 KB.
- Name the file after the review slug, for example `psycho.jpg`, so it is
  obvious which review an image belongs to.

## Where to get them

TMDB (film), AniList (anime) and OpenLibrary (books) all publish artwork
through documented APIs whose terms permit displaying it with attribution.
That is firmer ground than pulling images off a search engine.

Displaying cover art next to genuine criticism is the textbook fair dealing
case in Canada, but fair dealing for "criticism or review" requires crediting
the source, so keep the footer attribution line if artwork is in use, and keep
the images at thumbnail resolution.

## manifest.json

Records where every image came from: slug, filename, source, and the API URL it
was fetched from. Entries with `"file": null` have no artwork yet and fall back
to the letter block. Keep it up to date when adding images, since it is the
record backing the attribution line.
