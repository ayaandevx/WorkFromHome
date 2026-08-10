import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllCategories, getCategoryBySlug, getAllArticles } from "@/lib/content/service";
import { searchJobs } from "@/lib/jobs/service";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArticleCard } from "@/components/content/ArticleCard";
import { JobCard } from "@/components/jobs/JobCard";

export const revalidate = 1800;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return buildMetadata({ title: "Category not found", description: "", path: `/categories/${slug}`, noIndex: true });
  return buildMetadata({
    title: `${category.title} — Guides & Remote Jobs | WorkFrom.blog`,
    description: category.description || `Articles and remote jobs in ${category.title}.`,
    path: `/categories/${category.slug}`,
  });
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [allArticles, jobResult] = await Promise.all([
    getAllArticles(),
    searchJobs({ category: category.title, pageSize: 6 }),
  ]);
  const articles = allArticles.filter((a) => a.categories?.some((c) => c.slug === category.slug));

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Categories", path: "/articles" },
    { name: category.title, path: `/categories/${category.slug}` },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={breadcrumbItems} />
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink">{category.title}</h1>
      {category.description && <p className="mt-1 max-w-2xl text-text-muted">{category.description}</p>}

      {jobResult.jobs.length > 0 && (
        <div className="mt-8">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-xl font-semibold text-ink">Open remote roles</h2>
            <Link href={`/jobs?category=${encodeURIComponent(category.title)}`} className="text-sm font-medium text-amber hover:underline">
              View all →
            </Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobResult.jobs.slice(0, 3).map((j) => (
              <JobCard key={j.id} job={j} />
            ))}
          </div>
        </div>
      )}

      {articles.length > 0 && (
        <div className="mt-10 border-t border-border pt-8">
          <h2 className="font-display text-xl font-semibold text-ink">Guides</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </div>
      )}

      {articles.length === 0 && jobResult.jobs.length === 0 && (
        <p className="mt-8 text-text-muted">No content in this category yet.</p>
      )}
    </div>
  );
}
