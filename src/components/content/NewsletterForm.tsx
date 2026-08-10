"use client";

import { useState, type FormEvent } from "react";

export function NewsletterForm({ variant = "default" }: { variant?: "default" | "footer" }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong. Try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
      setEmail("");
    } catch {
      setErrorMsg("Network error. Try again.");
      setStatus("error");
    }
  }

  const isFooter = variant === "footer";

  if (status === "success") {
    return (
      <p className={isFooter ? "text-sm text-amber-light" : "text-sm text-sage"} role="status">
        You&apos;re subscribed. Check your inbox to confirm.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <label htmlFor={`newsletter-email-${variant}`} className={isFooter ? "text-sm text-paper/80" : "text-sm font-medium text-text"}>
        Get one useful remote-career email a week
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id={`newsletter-email-${variant}`}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={
            isFooter
              ? "w-full rounded-md border border-paper/25 bg-transparent px-3 py-2 text-sm text-paper placeholder:text-paper/40 focus:border-amber-light"
              : "w-full rounded-md border border-border bg-paper-raised px-3 py-2 text-sm text-text placeholder:text-text-muted"
          }
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-md bg-amber px-4 py-2 text-sm font-medium text-white hover:bg-amber-light disabled:opacity-60 transition-colors"
        >
          {status === "loading" ? "Joining…" : "Subscribe"}
        </button>
      </div>
      <label className={`mt-2 flex items-start gap-2 text-xs ${isFooter ? "text-paper/60" : "text-text-muted"}`}>
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5"
        />
        I agree to receive emails from WorkFrom.blog and can unsubscribe anytime.
      </label>
      {status === "error" && (
        <p className="mt-2 text-xs text-danger" role="alert">
          {errorMsg}
        </p>
      )}
    </form>
  );
}
