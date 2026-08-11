export interface SanityImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface Author {
  _id: string;
  name: string;
  slug: string;
  role?: string;
  avatar?: SanityImage;
  bioPlain?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
}

export interface Category {
  _id: string;
  title: string;
  slug: string;
  description?: string;
}

export interface Topic {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Tag {
  _id: string;
  title: string;
  slug: string;
}

export interface FAQItem {
  question: string;
  answerPlain: string;
}

export interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: Author;
  categories: Category[];
  topics: Topic[];
  tags: Tag[];
  mainImage?: SanityImage;
  bodyHtml: string;
  bodyPlain: string;
  faqs: FAQItem[];
  relatedArticles: { title: string; slug: string; excerpt?: string }[];
  relatedTools: { title: string; slug: string; summary?: string }[];
  publishedAt: string;
  updatedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  noIndex?: boolean;
  readingTimeMinutes: number;
}

export type ToolKind =
  | "resume-ats-checklist"
  | "readiness-checker"
  | "rate-calculator"
  | "timezone-calculator"
  | "can-i-work-this-job-remotely-checker"
  | "job-application-roi-calculator"
  | "home-office-deduction-expense-organizer"
  | "meeting-overload-calculator"
  | "remote-job-salary-reality-calculator"
  | "remote-job-scam-risk-checker"
  | "remote-timezone-checker"
  | "remote-work-readiness-score"
  | "remote-work-take-home-pay-calculator"
  | "wfh-electricity-cost-calculator"
  | "wfh-internet-reliability-checker"
  | "wfh-productivity-cost-calculator"
  | "other";

export interface Tool {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  kind: ToolKind;
  introHtml?: string;
  relatedArticles: { title: string; slug: string }[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface Resource {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  bodyHtml?: string;
  externalUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
}
