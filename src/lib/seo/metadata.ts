import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "./config";

interface PageMetaOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
}

export function buildMetadata(opts: PageMetaOptions): Metadata {
  const url = absoluteUrl(opts.path);
  const image = opts.image || absoluteUrl("/og-default.png");

  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    robots: opts.noIndex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: siteConfig.name,
      images: [{ url: image, width: 1200, height: 630, alt: opts.title }],
      locale: siteConfig.locale,
      type: opts.type || "website",
      ...(opts.type === "article" && {
        publishedTime: opts.publishedTime,
        modifiedTime: opts.modifiedTime,
        authors: opts.authorName ? [opts.authorName] : undefined,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [image],
      site: siteConfig.twitterHandle,
    },
  };
}
