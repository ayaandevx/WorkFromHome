import { NextResponse, type NextRequest } from "next/server";

/**
 * Handles editorial redirects (managed via the Sanity "redirect" schema)
 * and applies baseline security headers to every response.
 *
 * Redirects are fetched from Sanity's CDN API directly here (not through
 * the app's server-only content service, which can't run in the Edge
 * middleware runtime) and cached briefly in memory.
 */

let redirectCache: { map: Map<string, { destination: string; permanent: boolean }>; expiresAt: number } | null = null;

async function getRedirectMap(): Promise<Map<string, { destination: string; permanent: boolean }>> {
  if (redirectCache && redirectCache.expiresAt > Date.now()) return redirectCache.map;

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const map = new Map<string, { destination: string; permanent: boolean }>();

  if (projectId) {
    try {
      const query = encodeURIComponent(`*[_type == "redirect"]{ source, destination, permanent }`);
      const res = await fetch(`https://${projectId}.apicdn.sanity.io/v2024-06-01/data/query/${dataset}?query=${query}`, {
        next: { revalidate: 300 },
      });
      if (res.ok) {
        const { result } = await res.json();
        for (const r of result || []) {
          map.set(r.source, { destination: r.destination, permanent: r.permanent ?? true });
        }
      }
    } catch {
      // Fail open: no redirects rather than a broken request.
    }
  }

  redirectCache = { map, expiresAt: Date.now() + 300_000 };
  return map;
}

export async function proxy(req: NextRequest) {
  const redirects = await getRedirectMap();
  const match = redirects.get(req.nextUrl.pathname);

  if (match) {
    const url = req.nextUrl.clone();
    url.pathname = match.destination;
    return NextResponse.redirect(url, match.permanent ? 308 : 307);
  }

  const res = NextResponse.next();
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
