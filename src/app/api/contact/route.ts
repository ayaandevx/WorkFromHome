import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/schemas";
import { rateLimit, getClientKey } from "@/lib/rate-limit";

/**
 * Contact form endpoint. Wire CONTACT_NOTIFY_EMAIL / an email-sending
 * provider (Resend, SendGrid, Postmark) to actually deliver messages — see
 * the TODO below. Until then, submissions are validated and logged.
 */
export async function POST(req: Request) {
  const key = getClientKey(req);
  const { allowed } = rateLimit(`contact:${key}`, 3, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input." }, { status: 400 });
  }

  const emailApiKey = process.env.EMAIL_PROVIDER_API_KEY;
  if (!emailApiKey) {
    console.warn("[contact] No email provider configured. Message:", parsed.data);
    return NextResponse.json({ ok: true, note: "Email provider not configured; message logged only." });
  }

  // TODO: send via your email provider here, e.g. Resend:
  // await fetch("https://api.resend.com/emails", {
  //   method: "POST",
  //   headers: { Authorization: `Bearer ${emailApiKey}`, "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     from: "WorkFrom.blog <noreply@workfrom.blog>",
  //     to: process.env.CONTACT_NOTIFY_EMAIL,
  //     subject: `[${parsed.data.topic}] Message from ${parsed.data.name}`,
  //     text: parsed.data.message,
  //     reply_to: parsed.data.email,
  //   }),
  // });

  return NextResponse.json({ ok: true });
}
