import type { JobProvider, NormalizedJob } from "../types";
import { bucketRegion, makeJobId, makeJobSlug, normalizeEmploymentType, stripHtml } from "../normalize";
import { cleanText, sanitizeDescriptionHtml, isPublishableJob } from "../clean";
import { fetchJson } from "../fetch-utils";

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
    const data = await fetchJson<ArbeitnowResponse>(ARBEITNOW_ENDPOINT, { revalidateSeconds: 1800, retries: 1 });
    const fetchedAt = new Date().toISOString();

    const jobs = data.data
      .filter((job) => job.remote)
      .map((job): NormalizedJob => {
        const providerJobId = job.slug;
        const location = cleanText(job.location) || "Worldwide";
        const title = cleanText(job.title);
        const companyName = cleanText(job.company_name);
        const descriptionHtml = sanitizeDescriptionHtml(job.description);
        const publishedAt = new Date(job.created_at * 1000).toISOString();

        return {
          id: makeJobId("arbeitnow", providerJobId),
          slug: makeJobSlug(title, companyName, providerJobId),
          provider: "arbeitnow",
          providerJobId,
          sourceUrl: job.url,
          applyUrl: job.url,
          title,
          companyName,
          category: cleanText(job.tags?.[0]) || "General",
          tags: (job.tags || []).map((t) => cleanText(t).toLowerCase()).filter(Boolean),
          employmentType: normalizeEmploymentType(job.job_types?.[0]),
          experienceLevel: "unspecified",
          salary: undefined,
          candidateRequiredLocation: location,
          region: bucketRegion(location),
          descriptionHtml,
          descriptionText: stripHtml(descriptionHtml),
          publishedAt,
          fetchedAt,
          validThrough: new Date(new Date(publishedAt).getTime() + 45 * 86400000).toISOString(),
          richResultsEligible: true,
          isActive: true,
        };
      });

    return jobs.filter((job) =>
      isPublishableJob({
        title: job.title,
        companyName: job.companyName,
        descriptionText: job.descriptionText,
        applyUrl: job.applyUrl,
      })
    );
  },
};
