import sanitizeHtml from "sanitize-html";

/**
 * Cleans raw HTML job descriptions from third-party providers before they're
 * ever stored, rendered, or sent to search engines. Providers occasionally
 * return trackers, inline event handlers, absolute-positioned junk, or
 * unclosed tags — none of that belongs in a `dangerouslySetInnerHTML` sink.
 */
export function sanitizeDescriptionHtml(rawHtml: string): string {
  const cleaned = sanitizeHtml(rawHtml, {
    allowedTags: [
      "p", "br", "strong", "em", "b", "i", "u",
      "ul", "ol", "li",
      "h2", "h3", "h4",
      "a", "blockquote", "code", "pre", "hr", "span",
    ],
    allowedAttributes: {
      a: ["href", "rel", "target"],
    },
    // Force safe outbound link behavior regardless of what the provider sent.
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer nofollow", target: "_blank" }),
    },
    allowedSchemes: ["http", "https", "mailto"],
    // Strip tracking pixels / iframes / scripts / styles entirely (default-safe,
    // but listed explicitly so the intent is obvious and future-proof).
    disallowedTagsMode: "discard",
    exclusiveFilter: (frame) => frame.tag === "img" || frame.tag === "iframe" || frame.tag === "script" || frame.tag === "style",
  });

  return collapseWhitespace(cleaned);
}

function collapseWhitespace(html: string): string {
  return html
    .replace(/(<p>(\s|&nbsp;)*<\/p>)+/gi, "") // drop empty paragraphs providers sometimes leave behind
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Trims and collapses whitespace in short text fields (title, company name). */
export function cleanText(input: string | undefined | null): string {
  return (input || "").replace(/\s+/g, " ").trim();
}

export interface JobQualityCheckable {
  title: string;
  companyName: string;
  descriptionText: string;
  applyUrl: string;
}

/**
 * Filters out listings too broken or thin to publish: missing essentials,
 * placeholder/test content, or a description too short to be a real job ad.
 * Keeps the aggregation resilient to malformed rows from any one provider
 * without a human having to notice and patch it after the fact.
 */
export function isPublishableJob(job: JobQualityCheckable): boolean {
  if (!job.title || job.title.length < 3) return false;
  if (!job.companyName || job.companyName.length < 2) return false;
  if (!job.applyUrl || !/^https?:\/\//i.test(job.applyUrl)) return false;
  if (!job.descriptionText || job.descriptionText.length < 80) return false;

  const lowerTitle = job.title.toLowerCase();
  const testMarkers = ["test job", "do not apply", "[test]", "placeholder"];
  if (testMarkers.some((marker) => lowerTitle.includes(marker))) return false;

  return true;
}
