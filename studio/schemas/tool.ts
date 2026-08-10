import { defineField, defineType } from "sanity";

export default defineType({
  name: "tool",
  title: "Tool",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "summary", title: "One-line summary", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "kind",
      title: "Tool kind",
      type: "string",
      options: {
        list: [
          { title: "Resume / ATS checklist", value: "resume-checklist" },
          { title: "Remote-job readiness checker", value: "readiness-checker" },
          { title: "Freelance rate calculator", value: "rate-calculator" },
          { title: "Timezone / meeting calculator", value: "timezone-calculator" },
          { title: "Other interactive tool", value: "other" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "intro", title: "Intro content", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "relatedArticles",
      title: "Related articles",
      type: "array",
      of: [{ type: "reference", to: [{ type: "article" }] }],
    }),
    defineField({ name: "seoTitle", title: "SEO title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO description", type: "text", rows: 2 }),
  ],
  preview: { select: { title: "title", subtitle: "summary" } },
});
