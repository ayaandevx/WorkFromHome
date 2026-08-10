// GROQ queries mapped directly into the app's content types (see src/types/content.ts).
// pt::text() flattens portable text to plain text for excerpts/reading time/plain-text search.

const authorProjection = `{
  "_id": _id,
  name,
  "slug": slug.current,
  role,
  "avatar": avatar{ "url": asset->url, alt },
  "bioPlain": pt::text(bio),
  website,
  twitter,
  linkedin
}`;

const categoryProjection = `{ "_id": _id, title, "slug": slug.current, description }`;
const topicProjection = `{ "_id": _id, title, "slug": slug.current, description, seoTitle, seoDescription }`;
const tagProjection = `{ "_id": _id, title, "slug": slug.current }`;

export const articleListQuery = `*[_type == "article" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
  "_id": _id,
  title,
  "slug": slug.current,
  excerpt,
  "author": author->${authorProjection},
  "categories": categories[]->${categoryProjection},
  "topics": topics[]->${topicProjection},
  "tags": tags[]->${tagProjection},
  "mainImage": mainImage{ "url": asset->url, alt },
  publishedAt,
  updatedAt,
  noIndex
}`;

export const articleBySlugQuery = `*[_type == "article" && slug.current == $slug][0]{
  "_id": _id,
  title,
  "slug": slug.current,
  excerpt,
  "author": author->${authorProjection},
  "categories": categories[]->${categoryProjection},
  "topics": topics[]->${topicProjection},
  "tags": tags[]->${tagProjection},
  "mainImage": mainImage{ "url": asset->url, alt },
  "bodyHtml": body,
  "bodyPlain": pt::text(body),
  "faqs": faqs[]->{ question, "answerPlain": pt::text(answer) },
  "relatedArticles": relatedArticles[]->{ title, "slug": slug.current, excerpt },
  "relatedTools": relatedTools[]->{ title, "slug": slug.current, summary },
  publishedAt,
  updatedAt,
  seoTitle,
  seoDescription,
  noIndex
}`;

export const toolListQuery = `*[_type == "tool"] | order(title asc) {
  "_id": _id, title, "slug": slug.current, summary, kind
}`;

export const toolBySlugQuery = `*[_type == "tool" && slug.current == $slug][0]{
  "_id": _id, title, "slug": slug.current, summary, kind,
  "introHtml": intro,
  "relatedArticles": relatedArticles[]->{ title, "slug": slug.current },
  seoTitle, seoDescription
}`;

export const resourceListQuery = `*[_type == "resource"] | order(title asc) {
  "_id": _id, title, "slug": slug.current, description, category
}`;

export const resourceBySlugQuery = `*[_type == "resource" && slug.current == $slug][0]{
  "_id": _id, title, "slug": slug.current, description, category,
  "bodyHtml": body, externalUrl, seoTitle, seoDescription
}`;

export const topicListQuery = `*[_type == "topic"] | order(title asc) ${topicProjection}`;
export const topicBySlugQuery = `*[_type == "topic" && slug.current == $slug][0]${topicProjection}`;

export const categoryListQuery = `*[_type == "category"] | order(title asc) ${categoryProjection}`;
export const categoryBySlugQuery = `*[_type == "category" && slug.current == $slug][0]${categoryProjection}`;

export const authorListQuery = `*[_type == "author"] | order(name asc) ${authorProjection}`;
export const authorBySlugQuery = `*[_type == "author" && slug.current == $slug][0]${authorProjection}`;

export const redirectsQuery = `*[_type == "redirect"]{ source, destination, permanent }`;
