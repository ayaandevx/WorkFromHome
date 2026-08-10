import { defineField, defineType } from "sanity";

/** Pillar pages sit at the top of each topic cluster: Pillar -> Subtopic -> Article -> Tool/Resource. */
export default defineType({
  name: "topic",
  title: "Topic (Pillar)",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "intro", title: "Pillar intro content", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "seoTitle", title: "SEO title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO description", type: "text", rows: 2 }),
  ],
  preview: { select: { title: "title" } },
});
