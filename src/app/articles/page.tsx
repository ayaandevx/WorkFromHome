import type { Metadata } from "next";
import { getAllArticles } from "@/lib/content/service";
import { ArticleCard } from "@/components/content/ArticleCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: "Career Guides & Articles | WorkFrom.blog",
  description: "Practical guides on remote job hunting, resumes, interviews, freelancing, and productivity.",
  path: "/articles",
});

export default async function ArticlesPage() {
  const articles = await getAllArticles();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Articles", path: "/articles" }]} />
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink">Career Guides & Articles</h1>
      <p className="mt-1 text-text-muted">{articles.length} guides on remote work, careers, and job hunting.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
    </div>
  );
}
