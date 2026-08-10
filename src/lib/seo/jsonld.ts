import { absoluteUrl, siteConfig } from "./config";
import type { Article } from "@/types/content";
import type { NormalizedJob } from "@/lib/jobs/types";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/logo.png"),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleJsonLd(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.mainImage?.url ? [article.mainImage.url] : undefined,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: { "@type": "Person", name: article.author?.name },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") },
    },
    mainEntityOfPage: absoluteUrl(`/articles/${article.slug}`),
  };
}

export function faqJsonLd(faqs: { question: string; answerPlain: string }[]) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answerPlain },
    })),
  };
}

/** Only rendered for jobs we can currently confirm as active from the source feed. */
export function jobPostingJsonLd(job: NormalizedJob) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.descriptionHtml,
    datePosted: job.publishedAt,
    validThrough: undefined,
    employmentType: job.employmentType.toUpperCase(),
    hiringOrganization: {
      "@type": "Organization",
      name: job.companyName,
      logo: job.companyLogo,
    },
    jobLocationType: "TELECOMMUTE",
    applicantLocationRequirements:
      job.region === "worldwide"
        ? undefined
        : { "@type": "Country", name: job.candidateRequiredLocation },
    baseSalary: job.salary?.min
      ? {
          "@type": "MonetaryAmount",
          currency: job.salary.currency || "USD",
          value: { "@type": "QuantitativeValue", minValue: job.salary.min, maxValue: job.salary.max, unitText: "YEAR" },
        }
      : undefined,
    directApply: false,
    url: absoluteUrl(`/jobs/${job.slug}`),
  };
}
