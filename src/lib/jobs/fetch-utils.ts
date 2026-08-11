import "server-only";

/**
 * Many public job APIs sit behind Cloudflare or similar bot protection that
 * blocks requests with no User-Agent (Node's default fetch sends none, or
 * an opaque one like "node"), returning a 403 that looks identical to the
 * API being down. Identifying ourselves properly avoids that entirely — if
 * you deploy this under a different domain/contact, update the string below.
 */
const USER_AGENT = "WorkFromBlogBot/1.0 (+https://workfrom.blog; remote job aggregator)";

interface FetchJsonOptions {
  revalidateSeconds: number;
  retries?: number;
}

/**
 * Fetches and parses JSON with a real User-Agent and a short retry for
 * transient failures (network blips, momentary rate limiting). Throws on
 * final failure — callers (provider adapters) let that propagate up to
 * Promise.allSettled in the aggregation service, so one provider having a
 * bad moment never takes down the other providers' listings.
 */
export async function fetchJson<T>(url: string, { revalidateSeconds, retries = 1 }: FetchJsonOptions): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        next: { revalidate: revalidateSeconds },
        headers: {
          Accept: "application/json",
          "User-Agent": USER_AGENT,
        },
      });

      if (!res.ok) {
        throw new Error(`${url} responded ${res.status} ${res.statusText}`);
      }

      return (await res.json()) as T;
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
      }
    }
  }

  throw lastError;
}
