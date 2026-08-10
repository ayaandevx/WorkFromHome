import type { JobProvider, NormalizedJob } from "../types";
import { bucketRegion, makeJobId, makeJobSlug, normalizeEmploymentType, stripHtml } from "../normalize";

/**
 * Arbeitnow Job Board API — https://www.arbeitnow.com/api/job-board-api
 * Free, no API key required, CORS enabled. We only import listings flagged
 * `remote: true` by the source, and always link back to the original
 * Arbeitnow listing URL (`url` field) for attribution and application.
 * Docs: https://www.arbeitnow.com/blog/job-board-api
 */

const ARBEITNOW_ENDPOINT = "https://www.arbeitnow.com/api/job-board-api";

interface ArbeitnowJob {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  url: string;
  tags: string[];
  job_types: string[];
  location: string;
  created_at: number; // unix seconds
}

interface ArbeitnowResponse {
  data: ArbeitnowJob[];
}

export const arbeitnowProvider: JobProvider = {
  name: "arbeitnow",
  displayName: "Arbeitnow",

  async fetchJobs(): Promise<NormalizedJob[]> {
    const res = await fetch(ARBEITNOW_ENDPOINT, {
      next: { revalidate: 1800 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Arbeitnow API error: ${res.status} ${res.statusText}`);
    }

    const data: ArbeitnowResponse = await res.json();
    const fetchedAt = new Date().toISOString();

    return data.data
      .filter((job) => job.remote)
      .map((job): NormalizedJob => {
        const providerJobId = job.slug;
        const location = job.location || "Worldwide";
        return {
          id: makeJobId("arbeitnow", providerJobId),
          slug: makeJobSlug(job.title, job.company_name, providerJobId),
          provider: "arbeitnow",
          providerJobId,
          sourceUrl: job.url,
          applyUrl: job.url,
          title: job.title,
          companyName: job.company_name,
          category: job.tags?.[0] || "General",
          tags: job.tags || [],
          employmentType: normalizeEmploymentType(job.job_types?.[0]),
          experienceLevel: "unspecified",
          salary: undefined,
          candidateRequiredLocation: location,
          region: bucketRegion(location),
          descriptionHtml: job.description,
          descriptionText: stripHtml(job.description),
          publishedAt: new Date(job.created_at * 1000).toISOString(),
          fetchedAt,
          isActive: true,
        };
      });
  },
};
