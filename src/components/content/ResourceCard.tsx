import Link from "next/link";
import type { Resource } from "@/types/content";

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Link
      href={`/resources/${resource.slug}`}
      className="block rounded-lg border border-border bg-paper-raised p-5 transition-shadow hover:shadow-md"
    >
      <span className="text-xs font-medium uppercase tracking-wider text-sage">
        {resource.category.replace("-", " ")}
      </span>
      <h3 className="mt-1.5 font-display text-lg font-semibold text-ink">{resource.title}</h3>
      <p className="mt-1.5 text-sm text-text-muted">{resource.description}</p>
    </Link>
  );
}
