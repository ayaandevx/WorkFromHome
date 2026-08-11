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

const GOOGLE_EMPLOYMENT_TYPE: Record<string, string> = {
  full_time: "FULL_TIME",
  part_time: "PART_TIME",
  contract: "CONTRACTOR",
  freelance: "CONTRACTOR",
  internship: "INTERN",
  unspecified: "OTHER",
};

/**
 * Google's JobPosting schema requires applicantLocationRequirements to be an
 * actual Country entity. Our source data gives freeform strings ("US Only",
 * "EMEA", "UK/EU") that don't reliably map to one — emitting a guess would
 * produce invalid structured data Search Console would flag. We only ever
 * assert a country when we're confident, and omit the field otherwise
 * (schema.org treats it as optional).
 */
const KNOWN_COUNTRY_LOCATIONS: Record<string, string[]> = {
  "us only": ["US"],
  usa: ["US"],
  "united states": ["US"],
  "us/canada": ["US", "CA"],
  canada: ["CA"],
  uk: ["GB"],
  "united kingdom": ["GB"],
  germany: ["DE"],
  france: ["FR"],
  spain: ["ES"],
  australia: ["AU"],
  india: ["IN"],
};

function resolveApplicantCountries(candidateRequiredLocation: string): string[] | undefined {
  const key = candidateRequiredLocation.trim().toLowerCase();
  return KNOWN_COUNTRY_LOCATIONS[key];
}

/** Only rendered for jobs whose source terms permit Google Jobs / third-party rich-result distribution. */
export function jobPostingJsonLd(job: NormalizedJob) {
  const countries = job.region === "worldwide" ? undefined : resolveApplicantCountries(job.candidateRequiredLocation);

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.descriptionHtml,
    identifier: {
      "@type": "PropertyValue",
      name: job.provider,
      value: job.providerJobId,
    },
    datePosted: job.publishedAt,
    validThrough: job.validThrough,
    employmentType: GOOGLE_EMPLOYMENT_TYPE[job.employmentType] || "OTHER",
    hiringOrganization: {
      "@type": "Organization",
      name: job.companyName,
      logo: job.companyLogo,
    },
    jobLocationType: "TELECOMMUTE",
    applicantLocationRequirements: countries
      ? countries.map((code) => ({ "@type": "Country", name: code }))
      : undefined,
    baseSalary: job.salary?.min
      ? {
          "@type": "MonetaryAmount",
          currency: job.salary.currency || "USD",
          value: { "@type": "QuantitativeValue", minValue: job.salary.min, maxValue: job.salary.max, unitText: "YEAR" },
        }
      : undefined,
    url: absoluteUrl(`/jobs/${job.slug}`),
  };
}
