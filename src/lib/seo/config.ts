export const siteConfig = {
  name: "WorkFrom.blog",
  title: "WorkFrom.blog — Remote Jobs, Career Guides & Tools",
  description:
    "Find remote work, build your career, and work better from anywhere. Verified remote job listings, resume and interview guides, freelancing advice, and free career tools.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://workfrom.blog",
  twitterHandle: "@workfromblog",
  locale: "en_US",
};

export function absoluteUrl(path: string): string {
  const base = siteConfig.url.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
