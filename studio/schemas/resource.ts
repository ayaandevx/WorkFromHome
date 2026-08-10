import { defineField, defineType } from "sanity";

export default defineType({
  name: "resource",
  title: "Resource",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({
      name: "category",
      title: "Resource category",
      type: "string",
      options: {
        list: [
          { title: "Remote-job boards", value: "job-boards" },
          { title: "Scam prevention", value: "scam-prevention" },
          { title: "Productivity", value: "productivity" },
          { title: "Freelancing", value: "freelancing" },
          { title: "Career development", value: "career" },
        ],
      },
    }),
    defineField({ name: "body", title: "Body", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "externalUrl", title: "External link (optional)", type: "url" }),
    defineField({ name: "seoTitle", title: "SEO title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO description", type: "text", rows: 2 }),
  ],
  preview: { select: { title: "title", subtitle: "category" } },
});
