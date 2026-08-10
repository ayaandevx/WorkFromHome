import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getJobBySlug, searchJobs } from "@/lib/jobs/service";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbJsonLd, jobPostingJsonLd } from "@/lib/seo/jsonld";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JobCard } from "@/components/jobs/JobCard";
import { SaveButton } from "@/components/jobs/SaveButton";
import { ApplyButton } from "@/components/jobs/ApplyButton";

export const revalidate = 1800;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return buildMetadata({ title: "Job not found", description: "This listing is no longer available.", path: `/jobs/${slug}`, noIndex: true });

  return buildMetadata({
    title: `${job.title} at ${job.companyName} (Remote) | WorkFrom.blog`,
    description: `${job.title} — remote, ${job.candidateRequiredLocation}. ${job.descriptionText.slice(0, 140)}…`,
    path: `/jobs/${job.slug}`,
    type: "article",
    publishedTime: job.publishedAt,
  });
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();

  const related = await searchJobs({ category: job.category, pageSize: 4 });
  const relatedJobs = related.jobs.filter((j) => j.id !== job.id).slice(0, 3);

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Jobs", path: "/jobs" },
    { name: job.title, path: `/jobs/${job.slug}` },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jobPostingJsonLd(job)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-4 flex items-start justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">{job.title}</h1>
          <p className="mt-1 text-lg text-text-muted">{job.companyName}</p>
          <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
            <span className="rounded-full bg-sage-light px-2.5 py-1 font-medium text-sage">{job.category}</span>
            <span className="rounded-full border border-border px-2.5 py-1 text-text-muted">{job.candidateRequiredLocation}</span>
            <span className="rounded-full border border-border px-2.5 py-1 text-text-muted capitalize">
              {job.employmentType.replace("_", " ")}
            </span>
            {job.salary && (
              <span className="rounded-full border border-border px-2.5 py-1 font-mono text-text-muted">
                {job.salary.raw || `${job.salary.currency} ${job.salary.min}–${job.salary.max}`}
              </span>
            )}
          </div>
        </div>
        <SaveButton type="job" refId={job.id} title={job.title} href={`/jobs/${job.slug}`} />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <ApplyButton job={job} />
        <p className="text-xs text-text-muted">
          Posted {new Date(job.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} ·
          via{" "}
          <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">
            {job.provider === "remotive" ? "Remotive" : "Arbeitnow"}
          </a>
        </p>
      </div>

      <div
        className="prose-article mt-8 max-w-none text-text"
        dangerouslySetInnerHTML={{ __html: job.descriptionHtml }}
      />

      <div className="mt-10 rounded-lg border border-border bg-paper-raised p-5">
        <h2 className="font-display text-lg font-semibold text-ink">Before you apply</h2>
        <p className="mt-1 text-sm text-text-muted">
          Verify the company independently before sharing personal information. Legitimate employers never ask you
          to pay for equipment upfront or move the conversation to an unverifiable chat app.
        </p>
        <Link href="/resources/how-to-report-a-job-scam" className="mt-2 inline-block text-sm font-medium text-amber hover:underline">
          Read our scam-prevention guide →
        </Link>
      </div>

      {relatedJobs.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-xl font-semibold text-ink">More {job.category} roles</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedJobs.map((j) => (
              <JobCard key={j.id} job={j} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
