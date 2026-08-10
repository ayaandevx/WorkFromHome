"use client";

import type { NormalizedJob } from "@/lib/jobs/types";
import { track } from "@/lib/analytics";

export function ApplyButton({ job }: { job: NormalizedJob }) {
  return (
    <a
      href={job.applyUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      onClick={() =>
        track({
          name: "job_apply_click",
          jobId: job.id,
          jobTitle: job.title,
          provider: job.provider,
          destination: job.applyUrl,
        })
      }
      className="inline-flex items-center justify-center rounded-md bg-amber px-6 py-3 text-sm font-semibold text-white hover:bg-amber-light transition-colors"
    >
      Apply on {job.provider === "remotive" ? "Remotive" : "Arbeitnow"} →
    </a>
  );
}
