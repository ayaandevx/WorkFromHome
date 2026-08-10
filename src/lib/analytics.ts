"use client";

/**
 * Analytics event architecture. Provider-agnostic: swap the `dispatch`
 * implementation for GA4, PostHog, Plausible, etc. without touching call
 * sites. Until a provider is configured, events log to the console in dev
 * and no-op in production, so nothing breaks with no analytics wired up.
 */

export type AnalyticsEvent =
  | { name: "job_search"; query?: string; category?: string; region?: string }
  | { name: "job_view"; jobId: string; jobTitle: string; provider: string }
  | { name: "job_apply_click"; jobId: string; jobTitle: string; provider: string; destination: string }
  | { name: "tool_usage"; toolSlug: string; action: string }
  | { name: "article_view"; articleSlug: string; articleTitle: string }
  | { name: "newsletter_signup"; source: string }
  | { name: "account_created"; method: "email" | "google" }
  | { name: "content_saved"; contentType: "job" | "article" | "tool" | "resource"; refId: string };

declare global {
  interface Window {
    // Optional: set by a provider snippet (e.g. gtag, posthog) if/when connected.
    __workfromAnalyticsSink?: (event: AnalyticsEvent) => void;
  }
}

export function track(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;

  if (window.__workfromAnalyticsSink) {
    try {
      window.__workfromAnalyticsSink(event);
    } catch (err) {
      console.error("[analytics] sink error", err);
    }
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event.name, event);
  }
}
