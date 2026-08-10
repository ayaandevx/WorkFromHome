import { defineField, defineType } from "sanity";

export default defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({ name: "question", title: "Question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", title: "Answer", type: "array", of: [{ type: "block" }], validation: (r) => r.required() }),
  ],
  preview: { select: { title: "question" } },
});
