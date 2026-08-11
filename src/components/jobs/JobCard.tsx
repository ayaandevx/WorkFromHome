import Link from "next/link";
import type { NormalizedJob } from "@/lib/jobs/types";
import { SaveButton } from "./SaveButton";

const PROVIDER_LABELS: Record<string, string> = {
  remotive: "Remotive",
  arbeitnow: "Arbeitnow",
  jobicy: "Jobicy",
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? "s" : ""} ago`;
}

function formatSalary(job: NormalizedJob): string | null {
  if (!job.salary) return null;
  if (job.salary.min && job.salary.max) {
    const cur = job.salary.currency || "USD";
    return `${cur} ${Math.round(job.salary.min / 1000)}k–${Math.round(job.salary.max / 1000)}k`;
  }
  return job.salary.raw || null;
}

export function JobCard({ job }: { job: NormalizedJob }) {
  const salary = formatSalary(job);
  return (
    <article className="group relative rounded-lg border border-border bg-paper-raised p-4 transition-shadow hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <Link href={`/jobs/${job.slug}`} className="min-w-0 flex-1">
          <h3 className="truncate font-display text-lg font-semibold text-ink group-hover:text-amber">
            {job.title}
          </h3>
          <p className="mt-0.5 text-sm text-text-muted">{job.companyName}</p>
        </Link>
        <SaveButton type="job" refId={job.id} title={job.title} href={`/jobs/${job.slug}`} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
        <span className="rounded-full bg-sage-light px-2.5 py-1 font-medium text-sage">{job.category}</span>
        <span className="rounded-full border border-border px-2.5 py-1 text-text-muted">
          {job.candidateRequiredLocation}
        </span>
        {salary && (
          <span className="rounded-full border border-border px-2.5 py-1 font-mono text-text-muted">{salary}</span>
        )}
        <span className="rounded-full border border-border px-2.5 py-1 text-text-muted capitalize">
          {job.employmentType.replace("_", " ")}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-text-muted">
        <span>{timeAgo(job.publishedAt)}</span>
        <span>via {PROVIDER_LABELS[job.provider] || job.provider}</span>
      </div>
    </article>
  );
}
