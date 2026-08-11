/**
 * Internal normalized job schema.
 * Every provider adapter must map its raw response into this shape so the
 * rest of the app (UI, search, filters, sitemap, JSON-LD) never needs to
 * know which upstream source a job came from.
 */

export type EmploymentType =
  | "full_time"
  | "part_time"
  | "contract"
  | "freelance"
  | "internship"
  | "unspecified";

export type ExperienceLevel = "entry" | "mid" | "senior" | "lead" | "unspecified";

export interface SalaryRange {
  min?: number;
  max?: number;
  currency?: string;
  /** Raw string as given by the source, shown when we can't parse min/max. */
  raw?: string;
}

export interface NormalizedJob {
  /** Stable internal id: `${provider}:${providerJobId}` */
  id: string;
  /** URL-safe slug used for /jobs/[slug], derived from title + company + id. */
  slug: string;

  provider: string;
  providerJobId: string;
  /** The original listing URL on the provider's site — always preserved and linked. */
  sourceUrl: string;
  /** Where the candidate actually applies. Often the same as sourceUrl. */
  applyUrl: string;

  title: string;
  companyName: string;
  companyLogo?: string;

  category: string;
  tags: string[];

  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  salary?: SalaryRange;

  /** Free-text region/timezone restriction, e.g. "Worldwide", "US Only", "EU Timezones". */
  candidateRequiredLocation: string;
  /** Best-effort structured region for filtering, e.g. "worldwide" | "americas" | "emea" | "apac". */
  region: RegionBucket;

  descriptionHtml: string;
  descriptionText: string;

  publishedAt: string; // ISO date
  fetchedAt: string; // ISO date — when we last confirmed this listing from the source
  /**
   * Best-effort expiry for JobPosting structured data, since most source
   * feeds don't give us a real one. Computed by the provider adapter,
   * never fabricated as a specific claim beyond "assume gone after this".
   */
  validThrough: string;

  /**
   * Whether this listing may be surfaced via JobPosting JSON-LD (which
   * powers Google's Job Search / "Jobs" rich results and third-party job
   * aggregators that crawl schema.org data). Some providers' terms
   * explicitly prohibit redistributing their listings into Google Jobs or
   * similar aggregators — set this false for those providers so we only
   * ever show a normal web page for them, never job-rich-result markup.
   */
  richResultsEligible: boolean;

  /**
   * Whether the source currently lists this job as active. We only ever set
   * this from what the provider tells us — never assumed.
   */
  isActive: boolean;
}

export type RegionBucket = "worldwide" | "americas" | "emea" | "apac" | "other";

export interface JobSearchParams {
  q?: string;
  category?: string;
  tags?: string[];
  employmentType?: EmploymentType;
  experienceLevel?: ExperienceLevel;
  region?: RegionBucket;
  salaryMin?: number;
  page?: number;
  pageSize?: number;
  sort?: "newest" | "oldest" | "salary_desc" | "salary_asc";
}

export interface JobSearchResult {
  jobs: NormalizedJob[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Contract every job provider adapter must implement. */
export interface JobProvider {
  /** Short machine name, used as the provider prefix in ids, e.g. "remotive". */
  name: string;
  /** Human-readable name for attribution, e.g. "Remotive". */
  displayName: string;
  /** Fetches and normalizes the provider's current listings. */
  fetchJobs(): Promise<NormalizedJob[]>;
}
