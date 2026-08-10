import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllTopics, getTopicBySlug, getAllArticles, getAllTools } from "@/lib/content/service";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArticleCard } from "@/components/content/ArticleCard";
import { ToolCard } from "@/components/content/ToolCard";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const topics = await getAllTopics();
  return topics.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);
  if (!topic) return buildMetadata({ title: "Topic not found", description: "", path: `/topics/${slug}`, noIndex: true });
  return buildMetadata({
    title: topic.seoTitle || `${topic.title} | WorkFrom.blog`,
    description: topic.seoDescription || topic.description || "",
    path: `/topics/${topic.slug}`,
  });
}

export default async function TopicPage({ params }: PageProps) {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);
  if (!topic) notFound();

  const [allArticles, allTools] = await Promise.all([getAllArticles(), getAllTools()]);
  const articles = allArticles.filter((a) => a.topics?.some((t) => t.slug === topic.slug));

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Topics", path: "/articles" },
    { name: topic.title, path: `/topics/${topic.slug}` },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="mt-3 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber">Pillar guide</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink sm:text-4xl">{topic.title}</h1>
        {topic.description && <p className="mt-2 text-lg text-text-muted">{topic.description}</p>}
      </div>

      {articles.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-xl font-semibold text-ink">Articles in this cluster</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </div>
      )}

      {allTools.length > 0 && (
        <div className="mt-10 border-t border-border pt-8">
          <h2 className="font-display text-xl font-semibold text-ink">Related tools</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {allTools.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
