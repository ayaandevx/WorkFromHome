import type { Metadata } from "next";
import { getAllResources } from "@/lib/content/service";
import { ResourceCard } from "@/components/content/ResourceCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Remote Work Resources | WorkFrom.blog",
  description: "Curated resources for scam prevention, freelancing, productivity, and career development.",
  path: "/resources",
});

export default async function ResourcesPage() {
  const resources = await getAllResources();
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Resources", path: "/resources" }]} />
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink">Curated Resources</h1>
      <p className="mt-1 text-text-muted">Hand-picked, non-generic resources for remote work and job searching.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {resources.map((r) => <ResourceCard key={r.slug} resource={r} />)}
      </div>
    </div>
  );
}
