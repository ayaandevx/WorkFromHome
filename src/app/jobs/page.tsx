import type { Metadata } from "next";
import { Suspense } from "react";
import { searchJobs, getJobCategories } from "@/lib/jobs/service";
import type { EmploymentType, RegionBucket } from "@/lib/jobs/types";
import { JobCard } from "@/components/jobs/JobCard";
import { JobFilters } from "@/components/jobs/JobFilters";
import { Pagination } from "@/components/ui/Pagination";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 1800;

export const metadata: Metadata = buildMetadata({
  title: "Remote Jobs — Verified Listings Updated Daily | WorkFrom.blog",
  description:
    "Search remote jobs by keyword, category, employment type, region, and salary. Every listing links back to the original source.",
  path: "/jobs",
});

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function JobsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const [result, categories] = await Promise.all([
    searchJobs({
      q: params.q,
      category: params.category,
      employmentType: params.employmentType as EmploymentType | undefined,
      region: params.region as RegionBucket | undefined,
      sort: (params.sort as "newest" | "oldest" | "salary_desc" | "salary_asc") || "newest",
      page,
      pageSize: 20,
    }),
    getJobCategories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Jobs", path: "/jobs" }]} />

      <div className="mt-3 flex flex-col gap-1">
        <h1 className="font-display text-3xl font-semibold text-ink">Remote Jobs</h1>
        <p className="text-text-muted">
          {result.total.toLocaleString()} open remote roles, aggregated with full source attribution.
        </p>
      </div>

      <div className="mt-6">
        <Suspense fallback={<div className="h-32 rounded-lg border border-border bg-paper-raised" />}>
          <JobFilters categories={categories} />
        </Suspense>
      </div>

      <div className="mt-6">
        {result.jobs.length === 0 ? (
          <EmptyState hasFilters={Boolean(params.q || params.category || params.employmentType || params.region)} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>

      <Pagination page={result.page} totalPages={result.totalPages} basePath="/jobs" searchParams={params} />
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-paper-raised p-10 text-center">
      <h2 className="font-display text-lg font-semibold text-ink">
        {hasFilters ? "No jobs match those filters" : "No jobs available right now"}
      </h2>
      <p className="mt-1 text-sm text-text-muted">
        {hasFilters
          ? "Try widening your search — remove a filter or search a broader keyword."
          : "Our job providers may be temporarily unavailable. Check back shortly."}
      </p>
    </div>
  );
}
