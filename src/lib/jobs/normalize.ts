import type { EmploymentType, RegionBucket, SalaryRange } from "./types";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeEmploymentType(raw: string | undefined | null): EmploymentType {
  const v = (raw || "").toLowerCase().replace(/[\s-]/g, "_");
  if (v.includes("full")) return "full_time";
  if (v.includes("part")) return "part_time";
  if (v.includes("contract")) return "contract";
  if (v.includes("freelance")) return "freelance";
  if (v.includes("intern")) return "internship";
  return "unspecified";
}

export function bucketRegion(candidateRequiredLocation: string): RegionBucket {
  const v = candidateRequiredLocation.toLowerCase();
  if (!v || v.includes("worldwide") || v.includes("anywhere") || v.includes("global")) {
    return "worldwide";
  }
  const americas = ["us", "usa", "united states", "canada", "latam", "latin america", "brazil", "mexico", "argentina"];
  const emea = ["europe", "eu", "uk", "united kingdom", "germany", "france", "spain", "africa", "emea", "netherlands", "poland"];
  const apac = ["asia", "apac", "australia", "india", "japan", "singapore", "new zealand", "philippines"];
  if (americas.some((k) => v.includes(k))) return "americas";
  if (emea.some((k) => v.includes(k))) return "emea";
  if (apac.some((k) => v.includes(k))) return "apac";
  return "other";
}

/** Parses freeform salary strings like "$90,000 - $120,000" into a structured range. */
export function parseSalary(raw: string | undefined | null): SalaryRange | undefined {
  if (!raw) return undefined;
  const cleaned = raw.replace(/,/g, "");
  const numbers = Array.from(cleaned.matchAll(/(\d+(?:\.\d+)?)(k)?/gi)).map((m) => {
    const n = parseFloat(m[1]);
    return m[2] ? n * 1000 : n;
  });
  const currencyMatch = cleaned.match(/(USD|EUR|GBP|\$|€|£)/i);
  let currency: string | undefined;
  if (currencyMatch) {
    const sym = currencyMatch[1];
    currency = sym === "$" ? "USD" : sym === "€" ? "EUR" : sym === "£" ? "GBP" : sym.toUpperCase();
  }
  if (numbers.length === 0) return { raw };
  if (numbers.length === 1) return { min: numbers[0], max: numbers[0], currency, raw };
  return { min: Math.min(...numbers), max: Math.max(...numbers), currency, raw };
}

export function makeJobId(provider: string, providerJobId: string): string {
  return `${provider}:${providerJobId}`;
}

export function makeJobSlug(title: string, companyName: string, providerJobId: string): string {
  return `${slugify(title)}-at-${slugify(companyName)}-${providerJobId}`;
}
