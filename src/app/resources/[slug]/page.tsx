import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllResources, getResourceBySlug } from "@/lib/content/service";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const revalidate = 3600;

interface PageProps { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const resources = await getAllResources();
  return resources.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);
  if (!resource) return buildMetadata({ title: "Resource not found", description: "", path: `/resources/${slug}`, noIndex: true });
  return buildMetadata({
    title: resource.seoTitle || `${resource.title} | WorkFrom.blog`,
    description: resource.seoDescription || resource.description,
    path: `/resources/${resource.slug}`,
  });
}

export default async function ResourceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);
  if (!resource) notFound();

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Resources", path: "/resources" },
    { name: resource.title, path: `/resources/${resource.slug}` },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={breadcrumbItems} />
      <span className="mt-3 inline-block text-xs font-medium uppercase tracking-wider text-sage">
        {resource.category.replace("-", " ")}
      </span>
      <h1 className="mt-1 font-display text-3xl font-semibold text-ink">{resource.title}</h1>
      <p className="mt-2 text-lg text-text-muted">{resource.description}</p>
      {resource.bodyHtml && (
        <div className="prose-article mt-6 max-w-none" dangerouslySetInnerHTML={{ __html: resource.bodyHtml }} />
      )}
      {resource.externalUrl && (
        <a
          href={resource.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper"
        >
          Visit resource →
        </a>
      )}
    </div>
  );
}
