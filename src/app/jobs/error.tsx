"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Couldn&apos;t load jobs</h1>
      <p className="mt-2 text-text-muted">Our job providers may be temporarily unavailable. Please try again.</p>
      <button type="button" onClick={reset} className="mt-6 rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper">
        Try again
      </button>
    </div>
  );
}
