import "server-only";
import { getSanityClient, isSanityConfigured } from "@/lib/sanity/client";
import * as q from "@/lib/sanity/queries";
import type { Article, Author, Category, Resource, Tool, Topic } from "@/types/content";
import {
  sampleArticles,
  sampleAuthors,
  sampleCategories,
  sampleResources,
  sampleTools,
  sampleTopics,
} from "./sample-data";

function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// ---------- Articles ----------

export async function getAllArticles(): Promise<Article[]> {
  const client = getSanityClient();
  if (!client) return sampleArticles;

  const raw = await client.fetch(q.articleListQuery, {}, { next: { revalidate: 300 } } as never);
  return raw.map((a: Partial<Article> & { bodyPlain?: string }) => ({
    ...a,
    bodyHtml: "",
    bodyPlain: "",
    faqs: [],
    relatedArticles: [],
    relatedTools: [],
    readingTimeMinutes: 3,
  })) as Article[];
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const client = getSanityClient();
  if (!client) return sampleArticles.find((a) => a.slug === slug);

  const raw = await client.fetch(q.articleBySlugQuery, { slug }, { next: { revalidate: 300 } } as never);
  if (!raw) return undefined;
  return { ...raw, readingTimeMinutes: readingTime(raw.bodyPlain || "") } as Article;
}

export function isSanityBacked() {
  return isSanityConfigured;
}

// ---------- Tools ----------

export async function getAllTools(): Promise<Tool[]> {
  const client = getSanityClient();
  if (!client) return sampleTools;
  return client.fetch(q.toolListQuery, {}, { next: { revalidate: 3600 } } as never);
}

export async function getToolBySlug(slug: string): Promise<Tool | undefined> {
  const client = getSanityClient();
  if (!client) return sampleTools.find((t) => t.slug === slug);
  return client.fetch(q.toolBySlugQuery, { slug }, { next: { revalidate: 3600 } } as never);
}

// ---------- Resources ----------

export async function getAllResources(): Promise<Resource[]> {
  const client = getSanityClient();
  if (!client) return sampleResources;
  return client.fetch(q.resourceListQuery, {}, { next: { revalidate: 3600 } } as never);
}

export async function getResourceBySlug(slug: string): Promise<Resource | undefined> {
  const client = getSanityClient();
  if (!client) return sampleResources.find((r) => r.slug === slug);
  return client.fetch(q.resourceBySlugQuery, { slug }, { next: { revalidate: 3600 } } as never);
}

// ---------- Topics & Categories ----------

export async function getAllTopics(): Promise<Topic[]> {
  const client = getSanityClient();
  if (!client) return sampleTopics;
  return client.fetch(q.topicListQuery, {}, { next: { revalidate: 3600 } } as never);
}

export async function getTopicBySlug(slug: string): Promise<Topic | undefined> {
  const client = getSanityClient();
  if (!client) return sampleTopics.find((t) => t.slug === slug);
  return client.fetch(q.topicBySlugQuery, { slug }, { next: { revalidate: 3600 } } as never);
}

export async function getAllCategories(): Promise<Category[]> {
  const client = getSanityClient();
  if (!client) return sampleCategories;
  return client.fetch(q.categoryListQuery, {}, { next: { revalidate: 3600 } } as never);
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const client = getSanityClient();
  if (!client) return sampleCategories.find((c) => c.slug === slug);
  return client.fetch(q.categoryBySlugQuery, { slug }, { next: { revalidate: 3600 } } as never);
}

// ---------- Authors ----------

export async function getAllAuthors(): Promise<Author[]> {
  const client = getSanityClient();
  if (!client) return sampleAuthors;
  return client.fetch(q.authorListQuery, {}, { next: { revalidate: 3600 } } as never);
}

export async function getAuthorBySlug(slug: string): Promise<Author | undefined> {
  const client = getSanityClient();
  if (!client) return sampleAuthors.find((a) => a.slug === slug);
  return client.fetch(q.authorBySlugQuery, { slug }, { next: { revalidate: 3600 } } as never);
}

export async function getArticlesByAuthor(slug: string): Promise<Article[]> {
  const all = await getAllArticles();
  return all.filter((a) => a.author?.slug === slug);
}

// ---------- Redirects ----------

export async function getRedirects(): Promise<{ source: string; destination: string; permanent: boolean }[]> {
  const client = getSanityClient();
  if (!client) return [];
  return client.fetch(q.redirectsQuery, {}, { next: { revalidate: 3600 } } as never);
}
