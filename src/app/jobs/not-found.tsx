import type { Metadata } from "next";
import Link from "next/link";

// Next.js doesn't index 404 pages by default, but we set this explicitly so
// intent is unambiguous to both crawlers and future maintainers — this page
// renders with an HTTP 404 status via the notFound() call in page.tsx.
export const metadata: Metadata = {
  title: "Job no longer available | WorkFrom.blog",
  robots: { index: false, follow: true },
};

export default function JobNotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="font-mono text-sm text-amber">410</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink">This job is no longer available</h1>
      <p className="mt-2 text-text-muted">
        It may have been filled, expired, or removed by the employer. Here are current openings instead.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/jobs" className="rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper">
          Browse open roles
        </Link>
        <Link href="/" className="rounded-md border border-border px-5 py-2.5 text-sm font-medium">
          Go home
        </Link>
      </div>
    </div>
  );
}
