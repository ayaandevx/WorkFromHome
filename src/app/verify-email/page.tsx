"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  reload,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";

export default function VerifyEmailPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const auth = getFirebaseAuth();

    if (!auth?.currentUser) {
      router.replace("/login");
      return;
    }

    setEmail(auth.currentUser.email ?? "");
  }, [router]);

  async function handleCheckVerification() {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const auth = getFirebaseAuth();

      if (!auth?.currentUser) {
        router.replace("/login");
        return;
      }

      await reload(auth.currentUser);

      if (auth.currentUser.emailVerified) {
        router.replace("/dashboard");
        return;
      }

      setError(
        "Your email hasn't been verified yet. Please click the link in your email and try again."
      );
    } catch {
      setError("Unable to check verification status. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const auth = getFirebaseAuth();

      if (!auth?.currentUser) {
        router.replace("/login");
        return;
      }

      await sendEmailVerification(auth.currentUser);

      setMessage("Verification email sent. Please check your inbox.");
    } catch {
      setError("Unable to send the verification email. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    const auth = getFirebaseAuth();

    if (auth) {
      await signOut(auth);
    }

    router.replace("/login");
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-paper-raised p-6">
        <h1 className="text-xl font-semibold text-text">
          Verify your email
        </h1>

        <p className="mt-2 text-sm text-text-muted">
          We sent a verification link to:
        </p>

        <p className="mt-1 font-medium text-text">
          {email}
        </p>

        <p className="mt-4 text-sm text-text-muted">
          Open the email and click the verification link. Once verified,
          return here and click the button below.
        </p>

        {message && (
          <p className="mt-4 text-sm text-green-600">
            {message}
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="mt-4 text-sm text-danger"
          >
            {error}
          </p>
        )}

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={handleCheckVerification}
            disabled={loading}
            className="w-full rounded-md bg-ink py-2.5 text-sm font-semibold text-paper disabled:opacity-60"
          >
            {loading
              ? "Checking…"
              : "I've verified my email"}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={loading}
            className="w-full rounded-md border border-border bg-paper py-2.5 text-sm font-semibold text-text disabled:opacity-60"
          >
            Resend verification email
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2 text-sm text-text-muted hover:text-text"
          >
            Use a different account
          </button>
        </div>
      </div>
    </main>
  );
}
