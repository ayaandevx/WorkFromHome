import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validation/schemas";
import { rateLimit, getClientKey } from "@/lib/rate-limit";

/**
 * Newsletter signup endpoint. Provider-agnostic: this stores nothing on its
 * own. Wire NEWSLETTER_PROVIDER_API_KEY / NEWSLETTER_PROVIDER_LIST_ID to
 * your ESP (Mailchimp, ConvertKit, Resend Audiences, Buttondown, etc.) —
 * see the TODO below and README.md "Connecting the newsletter provider".
 */
export async function POST(req: Request) {
  const key = getClientKey(req);
  const { allowed } = rateLimit(`newsletter:${key}`, 5, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input." }, { status: 400 });
  }

  const { email, source } = parsed.data;

  const apiKey = process.env.NEWSLETTER_PROVIDER_API_KEY;
  if (!apiKey) {
    // No ESP connected yet — accept the signup so the UI flow can be tested,
    // but make the missing integration visible in server logs.
    console.warn(`[newsletter] No provider configured. Would subscribe: ${email} (source: ${source || "unknown"})`);
    return NextResponse.json({ ok: true, note: "Provider not configured; signup logged only." });
  }

  // TODO: call your ESP's API here, e.g.:
  // await fetch("https://api.youresp.com/v3/lists/{list_id}/members", {
  //   method: "POST",
  //   headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
  //   body: JSON.stringify({ email_address: email, status: "pending" }), // double opt-in
  // });

  return NextResponse.json({ ok: true });
}
