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
          description: "1 to 5 stars",
          defaultValue: 4,
          validation: { isRequired: true, min: 1, max: 5 },
        }),
        date: fields.date({
          label: "Date",
          validation: { isRequired: true },
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
        }),
      },
    }),
  },
  singletons: {
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
