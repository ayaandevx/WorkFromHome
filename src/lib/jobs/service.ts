import "server-only";
import type { JobProvider, JobSearchParams, JobSearchResult, NormalizedJob } from "./types";
import { remotiveProvider } from "./providers/remotive";
import { arbeitnowProvider } from "./providers/arbeitnow";
import { jobicyProvider } from "./providers/jobicy";

/**
 * Provider registry. Adding a new source is purely additive: build an
 * adapter that implements JobProvider (see providers/remotive.ts for the
 * reference shape) and push it here. Nothing else in the app changes.
 */
const PROVIDERS: JobProvider[] = [remotiveProvider, arbeitnowProvider, jobicyProvider];

// In-memory aggregate cache. Complements each provider's own fetch-level
// cache (next.revalidate) by avoiding repeated dedupe/merge work on every
// request within the same server instance.
let cache: { jobs: NormalizedJob[]; expiresAt: number } | null = null;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function dedupeKey(job: NormalizedJob): string {
  return `${job.title.trim().toLowerCase()}::${job.companyName.trim().toLowerCase()}`;
}

function dedupe(jobs: NormalizedJob[]): NormalizedJob[] {
  const seen = new Map<string, NormalizedJob>();
  for (const job of jobs) {
    const key = dedupeKey(job);
    const existing = seen.get(key);
    // Keep the most recently published copy when two providers list the same role.
    if (!existing || new Date(job.publishedAt) > new Date(existing.publishedAt)) {
      seen.set(key, job);
    }
  }
  return Array.from(seen.values());
}

export async function getAllJobs(): Promise<NormalizedJob[]> {
  if (cache && cache.expiresAt > Date.now()) {
    return cache.jobs;
  }

  const results = await Promise.allSettled(PROVIDERS.map((p) => p.fetchJobs()));
  const jobs: NormalizedJob[] = [];

  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      jobs.push(...result.value);
    } else {
      // A single provider outage should never take the whole board down.
      console.error(`[jobs] provider "${PROVIDERS[i].name}" failed:`, result.reason);
    }
  });

  const deduped = dedupe(jobs).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  cache = { jobs: deduped, expiresAt: Date.now() + CACHE_TTL_MS };
  return deduped;
}

export async function getJobBySlug(slug: string): Promise<NormalizedJob | undefined> {
  const jobs = await getAllJobs();
  return jobs.find((j) => j.slug === slug);
}

/**
 * Resolves a requested job slug against the *current* live feed. Job slugs
 * embed the provider's job id as a trailing segment (see makeJobSlug), so
 * even if a source tweaks a title's wording — changing the human-readable
 * part of the slug — we can still recognize the same job by id and send a
 * permanent redirect to its current canonical URL instead of 404ing a
 * previously-valid link.
 *
 * - "found": the exact slug matches a currently live job.
 * - "redirect": the id matches but the slug text has changed; the caller
 *   should issue a permanent redirect to `to`.
 * - "gone": no live job matches this id at all — the listing has expired
 *   or been pulled by its source. The caller should respond 404/410 so
 *   search engines drop the URL from their index instead of leaving a
 *   dead, indexed page live indefinitely.
 */
export type JobLookupResult =
  | { status: "found"; job: NormalizedJob }
  | { status: "redirect"; to: string }
  | { status: "gone" };

export async function resolveJobSlug(slug: string | undefined): Promise<JobLookupResult> {
  if (typeof slug !== "string" || !slug) { return { status: "gone" }; }


  const jobs = await getAllJobs();

  const exact = jobs.find((j) => j.slug === slug);
  if (exact) return { status: "found", job: exact };

  // Slugs end in `-{providerJobId}`; if that suffix matches a live job, the
  // job still exists but its human-readable slug text has drifted (e.g. a
  // provider tweaked the title). Match by suffix rather than splitting on
  // "-", since provider ids can themselves contain hyphens.

  const byId = jobs.find((j) => slug?.endsWith(`-${j.providerJobId}`));
  if (byId) return { status: "redirect", to: `/jobs/${byId.slug}` };

  return { status: "gone" };
}

export async function searchJobs(params: JobSearchParams): Promise<JobSearchResult> {
  let jobs = await getAllJobs();

  if (params.q) {
    const q = params.q.toLowerCase();
    jobs = jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.companyName.toLowerCase().includes(q) ||
        j.tags.some((t) => t.toLowerCase().includes(q)) ||
        j.descriptionText.toLowerCase().includes(q)
    );
  }
  if (params.category) {
    jobs = jobs.filter((j) => j.category.toLowerCase() === params.category!.toLowerCase());
  }
  if (params.tags?.length) {
    jobs = jobs.filter((j) =>
      params.tags!.every((tag) => j.tags.some((t) => t.toLowerCase() === tag.toLowerCase()))
    );
  }
  if (params.employmentType) {
    jobs = jobs.filter((j) => j.employmentType === params.employmentType);
  }
  if (params.experienceLevel) {
    jobs = jobs.filter((j) => j.experienceLevel === params.experienceLevel);
  }
  if (params.region) {
    jobs = jobs.filter((j) => j.region === params.region);
  }
  if (params.salaryMin) {
    jobs = jobs.filter((j) => (j.salary?.max ?? j.salary?.min ?? 0) >= params.salaryMin!);
  }

  switch (params.sort) {
    case "oldest":
      jobs = [...jobs].sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
      break;
    case "salary_desc":
      jobs = [...jobs].sort((a, b) => (b.salary?.max ?? 0) - (a.salary?.max ?? 0));
      break;
    case "salary_asc":
      jobs = [...jobs].sort((a, b) => (a.salary?.min ?? 0) - (b.salary?.min ?? 0));
      break;
    case "newest":
    default:
      jobs = [...jobs].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(50, params.pageSize ?? 20);
  const total = jobs.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const pageJobs = jobs.slice(start, start + pageSize);

  return { jobs: pageJobs, total, page, pageSize, totalPages };
}

export async function getJobCategories(): Promise<{ category: string; count: number }[]> {
  const jobs = await getAllJobs();
  const counts = new Map<string, number>();
  for (const job of jobs) {
    counts.set(job.category, (counts.get(job.category) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}