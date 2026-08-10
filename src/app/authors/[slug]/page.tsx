import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllAuthors, getAuthorBySlug, getArticlesByAuthor } from "@/lib/content/service";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArticleCard } from "@/components/content/ArticleCard";

export const revalidate = 3600;

interface PageProps { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const authors = await getAllAuthors();
  return authors.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) return buildMetadata({ title: "Author not found", description: "", path: `/authors/${slug}`, noIndex: true });
  return buildMetadata({
    title: `${author.name} | WorkFrom.blog`,
    description: author.bioPlain || `Articles by ${author.name}`,
    path: `/authors/${author.slug}`,
  });
}

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) notFound();

  const articles = await getArticlesByAuthor(slug);

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Authors", path: "/articles" },
    { name: author.name, path: `/authors/${author.slug}` },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="mt-3 max-w-2xl">
        <h1 className="font-display text-3xl font-semibold text-ink">{author.name}</h1>
        {author.role && <p className="mt-1 text-text-muted">{author.role}</p>}
        {author.bioPlain && <p className="mt-3 text-text">{author.bioPlain}</p>}
        <div className="mt-3 flex gap-4 text-sm">
          {author.website && <a href={author.website} className="text-amber hover:underline">Website</a>}
          {author.linkedin && <a href={author.linkedin} className="text-amber hover:underline">LinkedIn</a>}
        </div>
      </div>

      {articles.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-xl font-semibold text-ink">Articles by {author.name}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => <ArticleCard key={a.slug} article={a} />)}
          </div>
        </div>
      )}
    </div>
  );
}
