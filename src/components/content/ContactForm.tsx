"use client";

import { useState, type FormEvent } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error || "Something went wrong. Try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setErrorMsg("Network error. Try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p role="status" className="rounded-lg border border-sage/40 bg-sage-light p-4 text-sage">
        Thanks — we&apos;ve received your message and will respond soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="contact-name" className="mb-1 block text-sm font-medium text-text">Name</label>
        <input id="contact-name" name="name" type="text" required className="w-full rounded-md border border-border bg-paper-raised px-3 py-2 text-sm" />
      </div>
      <div>
        <label htmlFor="contact-email" className="mb-1 block text-sm font-medium text-text">Email</label>
        <input id="contact-email" name="email" type="email" required className="w-full rounded-md border border-border bg-paper-raised px-3 py-2 text-sm" />
      </div>
      <div>
        <label htmlFor="contact-topic" className="mb-1 block text-sm font-medium text-text">Topic</label>
        <select id="contact-topic" name="topic" className="w-full rounded-md border border-border bg-paper-raised px-3 py-2 text-sm">
          <option value="general">General question</option>
          <option value="job-scam">Report a job scam</option>
          <option value="correction">Content correction</option>
          <option value="partnership">Partnership</option>
        </select>
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-1 block text-sm font-medium text-text">Message</label>
        <textarea id="contact-message" name="message" required rows={5} className="w-full rounded-md border border-border bg-paper-raised px-3 py-2 text-sm" />
      </div>
      {status === "error" && <p role="alert" className="text-sm text-danger">{errorMsg}</p>}
      <button type="submit" disabled={status === "loading"} className="rounded-md bg-ink px-6 py-2.5 text-sm font-semibold text-paper disabled:opacity-60">
        {status === "loading" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
