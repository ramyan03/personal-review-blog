import { config, fields, collection, singleton } from "@keystatic/core";

export default config({
  storage: { kind: "local" },
  ui: {
    brand: { name: "Ramyan Reviews" },
  },
  collections: {
    reviews: collection({
      label: "Reviews",
      slugField: "title",
      path: "content/reviews/*",
      format: { contentField: "body" },
      entryLayout: "content",
      columns: ["title", "genre", "date"],
      schema: {
        title: fields.slug({
          name: { label: "Title" },
          slug: { label: "URL slug" },
        }),
        subject: fields.text({
          label: "Author / Director",
          description: 'e.g. "Kazuo Ishiguro" or "dir. Wim Wenders"',
          validation: { isRequired: true },
        }),
        genre: fields.select({
          label: "Genre",
          options: [
            { label: "Books", value: "Books" },
            { label: "Film", value: "Film" },
            { label: "Anime", value: "Anime" },
          ],
          defaultValue: "Books",
        }),
        rating: fields.number({
          label: "Rating",
          description:
            "1 to 5 in half steps, so 4.5 is allowed. Leave blank and no stars are shown.",
          step: 0.5,
          validation: { isRequired: false, min: 1, max: 5 },
        }),
        date: fields.date({
          label: "Date",
          validation: { isRequired: true },
        }),
        cover: fields.image({
          label: "Cover art",
          description:
            "Poster or jacket. Optional: without one the review gets a tinted letter block.",
          directory: "public/posters",
          publicPath: "/posters/",
        }),
        excerpt: fields.text({
          label: "Excerpt",
          description: "Short teaser shown on the index grid",
          multiline: true,
          validation: { isRequired: true },
        }),
        body: fields.document({
          label: "Review",
          formatting: true,
          links: true,
          dividers: true,
          // Stills and artwork can sit between paragraphs. They land in the
          // same folder as the covers, so manifest.json stays the one record
          // of where every image on the site came from.
          images: {
            directory: "public/posters",
            publicPath: "/posters/",
          },
        }),
      },
    }),
  },
  singletons: {
    /*
     * The pull quote on the landing page, second panel. Kept as its own
     * singleton so swapping it is one field and a save, not a code change.
     */
    quote: singleton({
      label: "Landing quote",
      path: "content/quote",
      schema: {
        text: fields.text({
          label: "Quote",
          description:
            "A line from one of your reviews. No surrounding quote marks, the page adds those.",
          multiline: true,
          validation: { isRequired: true },
        }),
        review: fields.relationship({
          label: "From which review",
          description:
            "Sets the attribution line and where 'Read the full review' goes. Leave blank to show the quote on its own.",
          collection: "reviews",
        }),
      },
    }),
    contact: singleton({
      label: "Contact",
      path: "content/contact",
      format: { contentField: "content" },
      schema: {
        content: fields.document({
          label: "Contact page",
          formatting: true,
          links: true,
          dividers: true,
        }),
      },
    }),
    about: singleton({
      label: "About",
      path: "content/about",
      format: { contentField: "content" },
      schema: {
        content: fields.document({
          label: "About page",
          formatting: true,
          links: true,
          dividers: true,
        }),
      },
    }),
  },
});
