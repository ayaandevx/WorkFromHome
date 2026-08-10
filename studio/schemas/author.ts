import { defineField, defineType } from "sanity";

export default defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "avatar", title: "Avatar", type: "image", options: { hotspot: true } }),
    defineField({ name: "role", title: "Role / title", type: "string" }),
    defineField({ name: "bio", title: "Bio", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "website", title: "Website", type: "url" }),
    defineField({ name: "twitter", title: "Twitter / X handle", type: "string" }),
    defineField({ name: "linkedin", title: "LinkedIn URL", type: "url" }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "avatar" } },
});
