import Link from "next/link";
import { searchJobs } from "@/lib/jobs/service";
import { getAllArticles, getAllTools, getAllResources } from "@/lib/content/service";
import { JobCard } from "@/components/jobs/JobCard";
import { ArticleCard } from "@/components/content/ArticleCard";
import { ToolCard } from "@/components/content/ToolCard";
import { ResourceCard } from "@/components/content/ResourceCard";
import { NewsletterForm } from "@/components/content/NewsletterForm";

export const revalidate = 1800;

export default async function HomePage() {
  const [{ jobs, total }, articles, tools, resources] = await Promise.all([
    searchJobs({ page: 1, pageSize: 6, sort: "newest" }),
    getAllArticles(),
    getAllTools(),
    getAllResources(),
  ]);

  const scamResource = resources.find((r) => r.category === "scam-prevention") || resources[0];

  return (
    <>
     {/* Hero */}
<section className="relative overflow-hidden border-b border-border bg-paper">
  <div className="pointer-events-none absolute inset-0">
    <div
      className="absolute inset-0 opacity-[0.3]"
      style={{
        backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
        backgroundSize: "20px 20px",
        color: "var(--color-border, #000)",
      }}
    />
    <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber/20 blur-3xl sm:h-96 sm:w-96 sm:-right-32 sm:-top-32 xl:h-128 xl:w-lg" />
    <div className="absolute -bottom-14 -left-14 h-40 w-40 rounded-full bg-ink/5 blur-3xl sm:h-72 sm:w-72 sm:-bottom-24 sm:-left-24 xl:h-96 xl:w-96" />
  </div>

  <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-20 lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:py-28 lg:px-8 xl:py-32">
    {/* Left: copy + search */}
    <div>
      <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-amber/30 bg-amber/10 px-2.5 py-1 shadow-sm">
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber" />
        </span>
        <p className="truncate font-mono text-[10px] uppercase tracking-widest text-amber sm:text-xs">
          UTC−12 → UTC+14 · every timezone welcome
        </p>
      </div>

      <h1 className="mt-4 max-w-3xl font-display text-2xl font-semibold leading-[1.15] tracking-tight text-ink sm:text-4xl sm:leading-tight lg:text-5xl xl:text-6xl">
        Find remote work.{" "}
        <span className="relative inline-block">
          Build your career.
          <svg
            className="absolute -bottom-0.5 left-0 w-full text-amber sm:-bottom-1 lg:-bottom-1.5"
            viewBox="0 0 200 8"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0,5 Q50,0 100,5 T200,5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </span>{" "}
        Work better from anywhere.
      </h1>

      <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-muted sm:mt-4 sm:text-lg lg:text-xl">
        <span className="font-semibold text-ink">{total.toLocaleString()}+</span>{" "}
        verified remote listings, plus the guides, tools, and scam-prevention know-how to actually land one.
      </p>

      <form
        action="/jobs"
        className="mt-6 flex max-w-xl flex-col gap-2 rounded-xl border border-border bg-paper-raised/70 p-1.5 shadow-sm backdrop-blur transition-shadow focus-within:shadow-md focus-within:ring-2 focus-within:ring-amber/30 sm:mt-8 sm:flex-row sm:items-center lg:max-w-lg"
      >
        <label htmlFor="hero-search" className="sr-only">Search remote jobs</label>
        <div className="flex flex-1 items-center gap-2 px-2.5 sm:px-3">
          <svg className="h-4 w-4 shrink-0 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="hero-search"
            name="q"
            type="search"
            placeholder="Job title, company, or skill…"
            className="w-full bg-transparent py-2.5 text-sm text-ink placeholder:text-text-muted focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-all duration-200 hover:bg-ink-2 hover:shadow-md active:scale-[0.98] sm:px-6"
        >
          Search jobs
        </button>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs sm:mt-4 sm:gap-2">
        <span className="text-text-muted">Popular:</span>
        {["software-dev", "design", "marketing", "customer-service"].map((c) => (
          <Link
            key={c}
            href={`/jobs?category=${c}`}
            className="rounded-full border border-border bg-paper-raised px-2.5 py-1 capitalize text-text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/40 hover:bg-amber/10 hover:text-ink hover:shadow-sm"
          >
            {c.replace("-", " ")}
          </Link>
        ))}
      </div>
    </div>

    {/* Right: stats panel — desktop only, fills the empty right column */}
    <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-border pt-5 sm:mt-10 sm:grid-cols-4 sm:gap-6 sm:pt-6 lg:mt-0 lg:grid-cols-2 lg:content-center lg:gap-5 lg:border-t-0 lg:border-l lg:pl-10 lg:pt-0">
      {[
        { label: "Live listings", value: `${total.toLocaleString()}+` },
        { label: "Timezones covered", value: "24" },
        { label: "Avg. time to apply", value: "< 3 min" },
        { label: "Scam checks run", value: "Daily" },
      ].map((stat) => (
        <div key={stat.label} className="lg:rounded-xl lg:border lg:border-border lg:bg-paper-raised/50 lg:p-4">
          <p className="font-display text-lg font-semibold text-ink sm:text-2xl lg:text-3xl">{stat.value}</p>
          <p className="mt-0.5 text-[11px] text-text-muted sm:text-xs">{stat.label}</p>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Latest jobs */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-ink">Latest remote jobs</h2>
          <Link href="/jobs" className="text-sm font-medium text-amber hover:underline">View all jobs →</Link>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => <JobCard key={job.id} job={job} />)}
        </div>
      </section>

      {/* Tools */}
      <section className="border-y border-border bg-sage-light/40">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-ink">Free career tools</h2>
          <p className="mt-1 text-text-muted">Practical calculators and checklists — no signup required.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
          </div>
        </div>
      </section>

      {/* Guides */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-ink">Popular guides</h2>
          <Link href="/articles" className="text-sm font-medium text-amber hover:underline">All articles →</Link>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 6).map((a) => <ArticleCard key={a.slug} article={a} />)}
        </div>
      </section>

      {/* Scam prevention callout */}
      {scamResource && (
        <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
          <div className="flex flex-col items-start gap-4 rounded-lg border border-danger/30 bg-danger/5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-danger">Stay safe</p>
              <h3 className="mt-1 font-display text-xl font-semibold text-ink">
                Remote job postings are a common scam target
              </h3>
              <p className="mt-1 max-w-xl text-sm text-text-muted">
                Learn the concrete red flags before you apply, interview, or share any personal information.
              </p>
            </div>
            <Link
              href={`/resources/${scamResource.slug}`}
              className="shrink-0 rounded-md bg-danger px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Read the scam guide
            </Link>
          </div>
        </section>
      )}

      {/* Resources grid */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-ink">Curated resources</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {resources.map((r) => <ResourceCard key={r.slug} resource={r} />)}
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-border bg-ink-2">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold text-paper">The Remote Dispatch</h2>
              <p className="mt-1 max-w-md text-sm text-paper/70">
                New remote roles, one practical career tip, and nothing else — every Thursday.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
