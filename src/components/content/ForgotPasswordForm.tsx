"use client";

import { useState, type FormEvent } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase/client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const auth = getFirebaseAuth();
    if (!auth) {
      setError("Password reset isn't configured yet. See README for Firebase setup.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      await sendPasswordResetEmail(auth, email);
      setStatus("sent");
    } catch {
      setError("Couldn't send reset email. Double-check the address and try again.");
      setStatus("error");
    }
  }

  if (!isFirebaseConfigured) {
    return (
      <div className="rounded-lg border border-amber/40 bg-amber/5 p-4 text-sm text-text">
        Password reset isn&apos;t configured yet. See README.md &ldquo;Connecting Firebase Auth&rdquo;.
      </div>
    );
  }

  if (status === "sent") {
    return (
      <p role="status" className="rounded-lg border border-sage/40 bg-sage-light p-4 text-sage">
        If an account exists for that email, a reset link is on its way.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="reset-email" className="mb-1 block text-sm font-medium text-text">Email</label>
        <input id="reset-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-border bg-paper-raised px-3 py-2 text-sm" />
      </div>
      {status === "error" && <p role="alert" className="text-sm text-danger">{error}</p>}
      <button type="submit" disabled={status === "loading"} className="w-full rounded-md bg-ink py-2.5 text-sm font-semibold text-paper disabled:opacity-60">
        {status === "loading" ? "Sending…" : "Send reset link"}
      </button>
    </form>
  );
}
