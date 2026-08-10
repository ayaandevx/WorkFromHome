import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="font-mono text-sm text-amber">404</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Page not found</h1>
      <p className="mt-2 text-text-muted">
        The page you&apos;re looking for may have moved or the listing may no longer be active.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/jobs" className="rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper">
          Browse remote jobs
        </Link>
        <Link href="/" className="rounded-md border border-border px-5 py-2.5 text-sm font-medium">
          Go home
        </Link>
      </div>
    </div>
  );
}
