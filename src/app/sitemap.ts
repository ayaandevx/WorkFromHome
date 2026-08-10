import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/config";
import { getAllArticles, getAllTools, getAllResources, getAllTopics, getAllCategories, getAllAuthors } from "@/lib/content/service";
import { getAllJobs } from "@/lib/jobs/service";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/jobs`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/articles`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/tools`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/resources`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/search`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/about`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/disclosure`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const [jobs, articles, tools, resources, topics, categories, authors] = await Promise.all([
    getAllJobs().catch(() => []),
    getAllArticles(),
    getAllTools(),
    getAllResources(),
    getAllTopics(),
    getAllCategories(),
    getAllAuthors(),
  ]);

  return [
    ...staticRoutes,
    ...jobs.map((j) => ({ url: `${base}/jobs/${j.slug}`, lastModified: j.fetchedAt, changeFrequency: "daily" as const, priority: 0.7 })),
    ...articles
      .filter((a) => !a.noIndex)
      .map((a) => ({ url: `${base}/articles/${a.slug}`, lastModified: a.updatedAt || a.publishedAt, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...tools.map((t) => ({ url: `${base}/tools/${t.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...resources.map((r) => ({ url: `${base}/resources/${r.slug}`, changeFrequency: "monthly" as const, priority: 0.5 })),
    ...topics.map((t) => ({ url: `${base}/topics/${t.slug}`, changeFrequency: "weekly" as const, priority: 0.6 })),
    ...categories.map((c) => ({ url: `${base}/categories/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.5 })),
    ...authors.map((a) => ({ url: `${base}/authors/${a.slug}`, changeFrequency: "monthly" as const, priority: 0.4 })),
  ];
}
