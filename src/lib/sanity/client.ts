import { createClient, type SanityClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const SANITY_API_VERSION = "2024-06-01";

/** True once a real Sanity project has been connected via env vars. */
export const isSanityConfigured = Boolean(SANITY_PROJECT_ID);

let _client: SanityClient | null = null;

/**
 * Lazily-created Sanity client. Returns null when no project has been
 * configured yet, so callers fall back to local sample content instead of
 * crashing the build. See README.md "Connecting Sanity CMS" for setup.
 */
export function getSanityClient(): SanityClient | null {
  if (!isSanityConfigured) return null;
  if (_client) return _client;

  _client = createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: SANITY_API_VERSION,
    useCdn: process.env.NODE_ENV === "production",
    perspective: "published",
  });

  return _client;
}

const imageBuilder = SANITY_PROJECT_ID
  ? imageUrlBuilder({ projectId: SANITY_PROJECT_ID, dataset: SANITY_DATASET })
  : null;

export function urlForImage(source: unknown) {
  if (!imageBuilder || !source) return undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return imageBuilder.image(source as any);
}
