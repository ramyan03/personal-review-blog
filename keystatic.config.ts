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
        }),
      },
    }),
  },
  singletons: {
    contact: singleton({
      label: "Contact",
      path: "content/contact",
      format: { contentField: "content" },
      schema: {
        email: fields.text({
          label: "Email address",
          description: "Shown as a mailto link. Leave blank to hide it.",
        }),
        links: fields.array(
          fields.object({
            label: fields.text({
              label: "Label",
              description: 'e.g. "Letterboxd"',
              validation: { isRequired: true },
            }),
            handle: fields.text({
              label: "Handle",
              description: 'Shown under the label, e.g. "@ramyan"',
            }),
            url: fields.url({
              label: "URL",
              validation: { isRequired: true },
            }),
          }),
          {
            label: "Elsewhere",
            description:
              "Letterboxd, AniList, Goodreads, GitHub, anywhere worth linking.",
            itemLabel: (props) => props.fields.label.value || "Link",
          },
        ),
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
