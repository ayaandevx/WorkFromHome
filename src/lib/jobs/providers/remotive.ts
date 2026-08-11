import type { JobProvider, NormalizedJob, ExperienceLevel } from "../types";
import { bucketRegion, makeJobId, makeJobSlug, normalizeEmploymentType, parseSalary, stripHtml } from "../normalize";
import { cleanText, sanitizeDescriptionHtml, isPublishableJob } from "../clean";

/**
 * Remotive Public API — https://remotive.com/api/remote-jobs
 * Free, no API key required. Terms require attribution and a link back to
 * the original remotive.com listing URL, both of which we always preserve
 * (see sourceUrl below and the "via Remotive" attribution rendered on job
 * detail pages). We never resubmit these listings to third-party boards.
 * Docs: https://github.com/remotive-com/remote-jobs-api
 */

const REMOTIVE_ENDPOINT = "https://remotive.com/api/remote-jobs";

interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo?: string;
  category: string;
  tags: string[];
  job_type?: string;
  publication_date: string;
  candidate_required_location: string;
  salary?: string;
  description: string;
}

interface RemotiveResponse {
  "job-count": number;
  jobs: RemotiveJob[];
}

function guessExperienceLevel(title: string, tags: string[]): ExperienceLevel {
  const haystack = `${title} ${tags.join(" ")}`.toLowerCase();
  if (/(lead|principal|staff|head of|director)/.test(haystack)) return "lead";
  if (/(senior|sr\.|sr )/.test(haystack)) return "senior";
  if (/(junior|jr\.|entry|intern|graduate)/.test(haystack)) return "entry";
  if (/(mid[- ]level|mid level)/.test(haystack)) return "mid";
  return "unspecified";
}

export const remotiveProvider: JobProvider = {
  name: "remotive",
  displayName: "Remotive",

  async fetchJobs(): Promise<NormalizedJob[]> {
    const res = await fetch(REMOTIVE_ENDPOINT, {
      // ISR-friendly: revalidate the upstream job feed every 30 minutes.
      next: { revalidate: 1800 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Remotive API error: ${res.status} ${res.statusText}`);
    }

    const data: RemotiveResponse = await res.json();
    const fetchedAt = new Date().toISOString();

    const jobs = data.jobs.map((job): NormalizedJob => {
      const providerJobId = String(job.id);
      const title = cleanText(job.title);
      const companyName = cleanText(job.company_name);
      const descriptionHtml = sanitizeDescriptionHtml(job.description);
      const descriptionText = stripHtml(descriptionHtml);
      const publishedAt = job.publication_date;

      return {
        id: makeJobId("remotive", providerJobId),
        slug: makeJobSlug(title, companyName, providerJobId),
        provider: "remotive",
        providerJobId,
        sourceUrl: job.url,
        applyUrl: job.url,
        title,
        companyName,
        companyLogo: job.company_logo || undefined,
        category: cleanText(job.category),
        tags: (job.tags || []).map((t) => cleanText(t).toLowerCase()).filter(Boolean),
        employmentType: normalizeEmploymentType(job.job_type),
        experienceLevel: guessExperienceLevel(title, job.tags || []),
        salary: parseSalary(job.salary),
        candidateRequiredLocation: cleanText(job.candidate_required_location) || "Worldwide",
        region: bucketRegion(job.candidate_required_location || "Worldwide"),
        descriptionHtml,
        descriptionText,
        publishedAt,
        fetchedAt,
        // Remotive's own feed doesn't return an expiry; assume gone after 45
        // days so JobPosting rich results self-expire instead of lingering.
        validThrough: new Date(new Date(publishedAt).getTime() + 45 * 86400000).toISOString(),
        richResultsEligible: true,
        isActive: true, // Remotive's feed only returns currently-listed jobs.
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
