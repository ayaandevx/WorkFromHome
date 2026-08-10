export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="h-9 w-64 animate-pulse rounded bg-border/60" />
      <div className="mt-3 h-5 w-96 animate-pulse rounded bg-border/40" />
      <div className="mt-6 h-32 animate-pulse rounded-lg border border-border bg-paper-raised" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-lg border border-border bg-paper-raised" />
        ))}
      </div>
    </div>
  );
}
