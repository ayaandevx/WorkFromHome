import { defineField, defineType } from "sanity";

/** Editorial-managed redirects, read by middleware.ts to return proper 301/302s. */
export default defineType({
  name: "redirect",
  title: "Redirect",
  type: "document",
  fields: [
    defineField({ name: "source", title: "Source path", type: "string", description: "e.g. /old-article", validation: (r) => r.required() }),
    defineField({ name: "destination", title: "Destination path", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "permanent",
      title: "Permanent (301)",
      type: "boolean",
      initialValue: true,
      description: "Off = temporary 302 redirect",
    }),
  ],
  preview: { select: { title: "source", subtitle: "destination" } },
});
