"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase/client";

function friendlyError(code: string): string {
  if (code.includes("wrong-password") || code.includes("invalid-credential")) return "Incorrect email or password.";
  if (code.includes("user-not-found")) return "No account found with that email.";
  if (code.includes("too-many-requests")) return "Too many attempts. Try again later.";
  return "Something went wrong. Please try again.";
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const auth = getFirebaseAuth();
    if (!auth) {
      setError("Sign-in isn't configured yet. See README for Firebase setup.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      setError(friendlyError(code));
    } finally {
      setLoading(false);
    }
  }

  if (!isFirebaseConfigured) {
    return (
      <div className="rounded-lg border border-amber/40 bg-amber/5 p-4 text-sm text-text">
        Sign-in isn&apos;t configured in this environment yet. Public content and job browsing don&apos;t require an
        account — see README.md &ldquo;Connecting Firebase Auth&rdquo; to enable accounts.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="login-email" className="mb-1 block text-sm font-medium text-text">Email</label>
        <input id="login-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-border bg-paper-raised px-3 py-2 text-sm" />
      </div>
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label htmlFor="login-password" className="text-sm font-medium text-text">Password</label>
          <Link href="/forgot-password" className="text-xs text-amber hover:underline">Forgot password?</Link>
        </div>
        <input id="login-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border border-border bg-paper-raised px-3 py-2 text-sm" />
      </div>
      {error && <p role="alert" className="text-sm text-danger">{error}</p>}
      <button type="submit" disabled={loading} className="w-full rounded-md bg-ink py-2.5 text-sm font-semibold text-paper disabled:opacity-60">
        {loading ? "Logging in…" : "Log in"}
      </button>
      <p className="text-center text-sm text-text-muted">
        No account? <Link href="/signup" className="text-amber hover:underline">Sign up</Link>
      </p>
    </form>
  );
}
