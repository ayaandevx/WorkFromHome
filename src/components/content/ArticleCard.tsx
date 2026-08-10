import Link from "next/link";
import type { Article } from "@/types/content";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="rounded-lg border border-border bg-paper-raised p-4 transition-shadow hover:shadow-md sm:p-5">
      <div className="flex flex-wrap gap-1.5">
        {article.categories?.slice(0, 2).map((c) => (
          <Link
            key={c.slug}
            href={`/categories/${c.slug}`}
            className="rounded-full bg-sage-light px-2.5 py-0.5 text-xs font-medium text-sage"
          >
            {c.title}
          </Link>
        ))}
      </div>
      <Link href={`/articles/${article.slug}`}>
        <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-ink hover:text-amber">
          {article.title}
        </h3>
      </Link>
      <p className="mt-1.5 line-clamp-2 text-sm text-text-muted">{article.excerpt}</p>
      <div className="mt-3 flex items-center gap-2 text-xs text-text-muted">
        <span>{article.author?.name}</span>
        <span aria-hidden="true">&middot;</span>
        <time dateTime={article.publishedAt}>
          {new Date(article.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </time>
        {article.readingTimeMinutes && (
          <>
            <span aria-hidden="true">&middot;</span>
            <span>{article.readingTimeMinutes} min read</span>
          </>
        )}
      </div>
    </article>
  );
}
