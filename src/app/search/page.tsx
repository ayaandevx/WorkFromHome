import type { Metadata } from "next";
import Link from "next/link";
import { searchJobs } from "@/lib/jobs/service";
import { getAllArticles, getAllTools, getAllResources } from "@/lib/content/service";
import { JobCard } from "@/components/jobs/JobCard";
import { ArticleCard } from "@/components/content/ArticleCard";
import { ToolCard } from "@/components/content/ToolCard";
import { ResourceCard } from "@/components/content/ResourceCard";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Search | WorkFrom.blog",
  description: "Search remote jobs, career guides, tools, and resources.",
  path: "/search",
  noIndex: true,
});

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = (q || "").trim();

  if (!query) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-3xl font-semibold text-ink">Search</h1>
        <form action="/search" className="mt-6 flex gap-2">
          <label htmlFor="search-q" className="sr-only">Search</label>
          <input
            id="search-q"
            name="q"
            type="search"
            placeholder="Search jobs, guides, tools, resources…"
            autoFocus
            className="w-full rounded-md border border-border bg-paper-raised px-4 py-3 text-sm"
          />
          <button type="submit" className="shrink-0 rounded-md bg-ink px-6 py-3 text-sm font-semibold text-paper">
            Search
          </button>
        </form>
      </div>
    );
  }

  const q2 = query.toLowerCase();
  const [jobResult, articles, tools, resources] = await Promise.all([
    searchJobs({ q: query, pageSize: 6 }),
    getAllArticles(),
    getAllTools(),
    getAllResources(),
  ]);

  const matchedArticles = articles.filter(
    (a) => a.title.toLowerCase().includes(q2) || a.excerpt.toLowerCase().includes(q2)
  ).slice(0, 6);
  const matchedTools = tools.filter((t) => t.title.toLowerCase().includes(q2) || t.summary.toLowerCase().includes(q2));
  const matchedResources = resources.filter(
    (r) => r.title.toLowerCase().includes(q2) || r.description.toLowerCase().includes(q2)
  );

  const totalResults = jobResult.total + matchedArticles.length + matchedTools.length + matchedResources.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <form action="/search" className="flex gap-2">
        <label htmlFor="search-q" className="sr-only">Search</label>
        <input
          id="search-q"
          name="q"
          type="search"
          defaultValue={query}
          className="w-full rounded-md border border-border bg-paper-raised px-4 py-3 text-sm"
        />
        <button type="submit" className="shrink-0 rounded-md bg-ink px-6 py-3 text-sm font-semibold text-paper">
          Search
        </button>
      </form>

      <p className="mt-4 text-text-muted">
        {totalResults} result{totalResults === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
      </p>

      {totalResults === 0 && (
        <div className="mt-8 rounded-lg border border-dashed border-border p-10 text-center">
          <p className="font-medium text-text">No results found</p>
          <p className="mt-1 text-sm text-text-muted">Try a broader keyword, or browse <Link href="/jobs" className="text-amber hover:underline">all jobs</Link>.</p>
        </div>
      )}

      {jobResult.jobs.length > 0 && (
        <Section title="Jobs" viewAllHref={`/jobs?q=${encodeURIComponent(query)}`} count={jobResult.total}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobResult.jobs.map((j) => <JobCard key={j.id} job={j} />)}
          </div>
        </Section>
      )}

      {matchedArticles.length > 0 && (
        <Section title="Guides & Articles" count={matchedArticles.length}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matchedArticles.map((a) => <ArticleCard key={a.slug} article={a} />)}
          </div>
        </Section>
      )}

      {matchedTools.length > 0 && (
        <Section title="Tools" count={matchedTools.length}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {matchedTools.map((t) => <ToolCard key={t.slug} tool={t} />)}
          </div>
        </Section>
      )}

      {matchedResources.length > 0 && (
        <Section title="Resources" count={matchedResources.length}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {matchedResources.map((r) => <ResourceCard key={r.slug} resource={r} />)}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  count,
  viewAllHref,
  children,
}: {
  title: string;
  count: number;
  viewAllHref?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-10">
      <div className="flex items-end justify-between">
        <h2 className="font-display text-xl font-semibold text-ink">
          {title} <span className="text-base font-normal text-text-muted">({count})</span>
        </h2>
        {viewAllHref && (
          <Link href={viewAllHref} className="text-sm font-medium text-amber hover:underline">
            View all →
          </Link>
        )}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}
