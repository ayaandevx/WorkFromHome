import type { JobProvider, NormalizedJob } from "../types";
import { bucketRegion, makeJobId, makeJobSlug, normalizeEmploymentType, stripHtml } from "../normalize";
import { cleanText, sanitizeDescriptionHtml, isPublishableJob } from "../clean";

/**
 * Jobicy Remote Jobs API — https://jobicy.com/api/v2/remote-jobs
 * Free, no API key required. Jobicy's usage guidelines ask that their
 * listings not be redistributed to Google Jobs, LinkedIn, or similar
 * third-party job aggregators — see richResultsEligible below, which we
 * honor by never emitting JobPosting JSON-LD for jobs from this provider.
 * We still show them as normal indexable web pages with full attribution
 * and a link back to the original Jobicy listing.
 * Docs: https://jobicy.com/jobs-rss-feed
 */

const JOBICY_ENDPOINT = "https://jobicy.com/api/v2/remote-jobs?count=100";

interface JobicyJob {
  id: number;
  url: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  jobIndustry?: string[];
  jobType?: string[];
  jobGeo?: string;
  jobDescription: string;
  pubDate: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
}

interface JobicyResponse {
  jobCount: number;
  jobs: JobicyJob[];
}

export const jobicyProvider: JobProvider = {
  name: "jobicy",
  displayName: "Jobicy",

  async fetchJobs(): Promise<NormalizedJob[]> {
    const res = await fetch(JOBICY_ENDPOINT, {
      next: { revalidate: 1800 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Jobicy API error: ${res.status} ${res.statusText}`);
    }

    const data: JobicyResponse = await res.json();
    const fetchedAt = new Date().toISOString();

    const jobs = data.jobs.map((job): NormalizedJob => {
      const providerJobId = String(job.id);
      const title = cleanText(job.jobTitle);
      const companyName = cleanText(job.companyName);
      const descriptionHtml = sanitizeDescriptionHtml(job.jobDescription);
      const location = cleanText(job.jobGeo) || "Worldwide";
      const publishedAt = new Date(job.pubDate).toISOString();

      return {
        id: makeJobId("jobicy", providerJobId),
        slug: makeJobSlug(title, companyName, providerJobId),
        provider: "jobicy",
        providerJobId,
        sourceUrl: job.url,
        applyUrl: job.url,
        title,
        companyName,
        companyLogo: job.companyLogo || undefined,
        category: cleanText(job.jobIndustry?.[0]) || "General",
        tags: (job.jobIndustry || []).map((t) => cleanText(t).toLowerCase()).filter(Boolean),
        employmentType: normalizeEmploymentType(job.jobType?.[0]),
        experienceLevel: "unspecified",
        salary:
          job.salaryMin || job.salaryMax
            ? { min: job.salaryMin, max: job.salaryMax, currency: job.salaryCurrency }
            : undefined,
        candidateRequiredLocation: location,
        region: bucketRegion(location),
        descriptionHtml,
        descriptionText: stripHtml(descriptionHtml),
        publishedAt,
        fetchedAt,
        validThrough: new Date(new Date(publishedAt).getTime() + 45 * 86400000).toISOString(),
        richResultsEligible: false,
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
