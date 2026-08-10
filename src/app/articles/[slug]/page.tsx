import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllArticles, getArticleBySlug } from "@/lib/content/service";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/ui/JsonLd";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/jsonld";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { TableOfContents } from "@/components/ui/TableOfContents";
import { ArticleCard } from "@/components/content/ArticleCard";
import { ToolCard } from "@/components/content/ToolCard";
import { SaveButton } from "@/components/jobs/SaveButton";
import { sampleTools } from "@/lib/content/sample-data";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return buildMetadata({ title: "Article not found", description: "", path: `/articles/${slug}`, noIndex: true });

  return buildMetadata({
    title: article.seoTitle || `${article.title} | WorkFrom.blog`,
    description: article.seoDescription || article.excerpt,
    path: `/articles/${article.slug}`,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    authorName: article.author?.name,
    image: article.mainImage?.url,
    noIndex: article.noIndex,
  });
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const allArticles = await getAllArticles();
  const related =
    article.relatedArticles.length > 0
      ? article.relatedArticles
      : allArticles
          .filter((a) => a.slug !== article.slug && a.categories?.some((c) => article.categories?.some((ac) => ac.slug === c.slug)))
          .slice(0, 3)
          .map((a) => ({ title: a.title, slug: a.slug, excerpt: a.excerpt }));

  const relatedToolSlugs = article.relatedTools?.map((t) => t.slug) || [];
  const relatedToolObjs = sampleTools.filter((t) => relatedToolSlugs.includes(t.slug));

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Articles", path: "/articles" },
    { name: article.title, path: `/articles/${article.slug}` },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <JsonLd data={articleJsonLd(article)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      {article.faqs.length > 0 && <JsonLd data={faqJsonLd(article.faqs)} />}

      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_260px]">
        <article>
          <div className="flex flex-wrap gap-1.5">
            {article.categories?.map((c) => (
              <Link key={c.slug} href={`/categories/${c.slug}`} className="rounded-full bg-sage-light px-2.5 py-0.5 text-xs font-medium text-sage">
                {c.title}
              </Link>
            ))}
          </div>

          <div className="mt-3 flex items-start justify-between gap-4">
            <h1 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">{article.title}</h1>
            <SaveButton type="article" refId={article.slug} title={article.title} href={`/articles/${article.slug}`} />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-text-muted">
            <Link href={`/authors/${article.author?.slug}`} className="font-medium text-text hover:text-ink">
              {article.author?.name}
            </Link>
            <span aria-hidden="true">&middot;</span>
            <time dateTime={article.publishedAt}>
              Published {new Date(article.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </time>
            {article.updatedAt && (
              <>
                <span aria-hidden="true">&middot;</span>
                <time dateTime={article.updatedAt}>
                  Updated {new Date(article.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </time>
              </>
            )}
            <span aria-hidden="true">&middot;</span>
            <span>{article.readingTimeMinutes} min read</span>
          </div>

          <div id="article-body" className="prose-article mt-8" dangerouslySetInnerHTML={{ __html: article.bodyHtml }} />

          {article.faqs.length > 0 && (
            <div className="mt-10 border-t border-border pt-6">
              <h2 className="font-display text-xl font-semibold text-ink">Frequently asked questions</h2>
              <dl className="mt-4 space-y-5">
                {article.faqs.map((f) => (
                  <div key={f.question}>
                    <dt className="font-medium text-text">{f.question}</dt>
                    <dd className="mt-1 text-sm text-text-muted">{f.answerPlain}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {relatedToolObjs.length > 0 && (
            <div className="mt-10 border-t border-border pt-6">
              <h2 className="font-display text-xl font-semibold text-ink">Related tool</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {relatedToolObjs.map((t) => (
                  <ToolCard key={t.slug} tool={t} />
                ))}
              </div>
            </div>
          )}

          {related.length > 0 && (
            <div className="mt-10 border-t border-border pt-6">
              <h2 className="font-display text-xl font-semibold text-ink">Related reading</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {allArticles
                  .filter((a) => related.some((r) => r.slug === a.slug))
                  .map((a) => (
                    <ArticleCard key={a.slug} article={a} />
                  ))}
              </div>
            </div>
          )}
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-4">
            <TableOfContents containerId="article-body" />
            {article.author && (
              <div className="rounded-lg border border-border bg-paper-raised p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Written by</p>
                <Link href={`/authors/${article.author.slug}`} className="mt-1 block font-medium text-ink hover:text-amber">
                  {article.author.name}
                </Link>
                {article.author.role && <p className="text-sm text-text-muted">{article.author.role}</p>}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
