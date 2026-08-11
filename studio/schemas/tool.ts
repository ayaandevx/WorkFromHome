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
          { title: "can-i-work-this-job-remotely-checker", value: "can-i-work-this-job-remotely-checker" },
          { title: "job-application-roi-calculator", value: "job-application-roi-calculator" },
          { title: "home-office-deduction-expense-organizer", value: "home-office-deduction-expense-organizer" },
          { title: "meeting-overload-calculator", value: "meeting-overload-calculator" },
          { title: "remote-job-salary-reality-calculator", value: "remote-job-salary-reality-calculator" },
          { title: "remote-job-scam-risk-checker", value: "remote-job-scam-risk-checker" },
          { title: "remote-timezone-checker", value: "remote-timezone-checker" },
          { title: "remote-work-readiness-score", value: "remote-work-readiness-score" },
          { title: "remote-work-take-home-pay-calculator", value: "remote-work-take-home-pay-calculator" },
          { title: "wfh-electricity-cost-calculator", value: "wfh-electricity-cost-calculator" },
          { title: "wfh-internet-reliability-checker", value: "wfh-internet-reliability-checker" },
          { title: "wfh-productivity-cost-calculator", value: "wfh-productivity-cost-calculator" },
          { title: "other", value: "other" }
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
