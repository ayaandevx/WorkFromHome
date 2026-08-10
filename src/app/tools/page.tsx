import type { Metadata } from "next";
import { getAllTools } from "@/lib/content/service";
import { ToolCard } from "@/components/content/ToolCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Free Remote Career Tools | WorkFrom.blog",
  description: "Resume/ATS checklist, remote-job readiness checker, freelance rate calculator, and timezone meeting calculator. No signup required.",
  path: "/tools",
});

export default async function ToolsPage() {
  const tools = await getAllTools();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Tools", path: "/tools" }]} />
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink">Free Career Tools</h1>
      <p className="mt-1 max-w-2xl text-text-muted">
        Practical, no-signup tools for finding and running a remote career — built from the frameworks in our guides.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
