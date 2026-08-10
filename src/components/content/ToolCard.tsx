import Link from "next/link";
import type { Tool } from "@/types/content";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="block rounded-lg border border-border bg-paper-raised p-5 transition-shadow hover:shadow-md"
    >
      <span className="inline-block rounded-full bg-amber/10 px-2.5 py-0.5 text-xs font-medium text-amber">
        Free tool
      </span>
      <h3 className="mt-2 font-display text-lg font-semibold text-ink">{tool.title}</h3>
      <p className="mt-1.5 text-sm text-text-muted">{tool.summary}</p>
    </Link>
  );
}
