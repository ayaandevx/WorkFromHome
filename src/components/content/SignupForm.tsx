// "use client";

// import { useState, type FormEvent } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase/client";
// import { track } from "@/lib/analytics";

// function friendlyError(code: string): string {
//   if (code.includes("email-already-in-use")) return "An account with that email already exists.";
//   if (code.includes("weak-password")) return "Password should be at least 6 characters.";
//   if (code.includes("invalid-email")) return "Enter a valid email address.";
//   return "Something went wrong. Please try again.";
// }

// export function SignupForm() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function handleSubmit(e: FormEvent) {
//     e.preventDefault();
//     setError("");
//     const auth = getFirebaseAuth();
//     if (!auth) {
//       setError("Sign-up isn't configured yet. See README for Firebase setup.");
//       return;
//     }
//     setLoading(true);
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       track({ name: "account_created", method: "email" });
//       router.push("/dashboard");
//     } catch (err) {
//       const code = err instanceof Error ? err.message : "";
//       setError(friendlyError(code));
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (!isFirebaseConfigured) {
//     return (
//       <div className="rounded-lg border border-amber/40 bg-amber/5 p-4 text-sm text-text">
//         Sign-up isn&apos;t configured in this environment yet. Public content and job browsing don&apos;t require an
//         account — see README.md &ldquo;Connecting Firebase Auth&rdquo; to enable accounts.
//       </div>
//     );
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <label htmlFor="signup-email" className="mb-1 block text-sm font-medium text-text">Email</label>
//         <input id="signup-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-border bg-paper-raised px-3 py-2 text-sm" />
//       </div>
//       <div>
//         <label htmlFor="signup-password" className="mb-1 block text-sm font-medium text-text">Password</label>
//         <input id="signup-password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border border-border bg-paper-raised px-3 py-2 text-sm" />
//         <p className="mt-1 text-xs text-text-muted">At least 6 characters.</p>
//       </div>
//       {error && <p role="alert" className="text-sm text-danger">{error}</p>}
//       <button type="submit" disabled={loading} className="w-full rounded-md bg-ink py-2.5 text-sm font-semibold text-paper disabled:opacity-60">
//         {loading ? "Creating account…" : "Sign up"}
//       </button>
//       <p className="text-center text-sm text-text-muted">
//         Already have an account? <Link href="/login" className="text-amber hover:underline">Log in</Link>
//       </p>
//     </form>
//   );
// }

"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase/client";
import { track } from "@/lib/analytics";

function friendlyError(code: string): string {
  if (code.includes("email-already-in-use")) return "An account with that email already exists.";
  if (code.includes("weak-password")) return "Password should be at least 6 characters.";
  if (code.includes("invalid-email")) return "Enter a valid email address.";
  if (code.includes("popup-closed-by-user")) return "Sign-up was cancelled.";
  if (code.includes("account-exists-with-different-credential"))
    return "An account already exists with this email using a different sign-in method.";
  return "Something went wrong. Please try again.";
}

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const auth = getFirebaseAuth();
    if (!auth) {
      setError("Sign-up isn't configured yet. See README for Firebase setup.");
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      track({ name: "account_created", method: "email" });
      router.push("/dashboard");
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      setError(friendlyError(code));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignup() {
    setError("");
    const auth = getFirebaseAuth();
    if (!auth) {
      setError("Sign-up isn't configured yet. See README for Firebase setup.");
      return;
    }
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      track({ name: "account_created", method: "google" });
      router.push("/dashboard");
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      setError(friendlyError(code));
    } finally {
      setGoogleLoading(false);
    }
  }

  if (!isFirebaseConfigured) {
    return (
      <div className="rounded-lg border border-amber/40 bg-amber/5 p-4 text-sm text-text">
        Sign-up isn&apos;t configured in this environment yet. Public content and job browsing don&apos;t require an
        account — see README.md &ldquo;Connecting Firebase Auth&rdquo; to enable accounts.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={handleGoogleSignup}
        disabled={googleLoading || loading}
        className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-paper-raised py-2.5 text-sm font-semibold text-text disabled:opacity-60"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z" />
          <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.94v2.33A9 9 0 0 0 9 18z" />
          <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.94A9 9 0 0 0 0 9c0 1.45.35 2.83.94 4.03l3.01-2.33z" />
          <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .94 4.97l3.01 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
        </svg>
        {googleLoading ? "Signing up…" : "Continue with Google"}
      </button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-text-muted">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="signup-email" className="mb-1 block text-sm font-medium text-text">Email</label>
          <input id="signup-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-border bg-paper-raised px-3 py-2 text-sm" />
        </div>
        <div>
          <label htmlFor="signup-password" className="mb-1 block text-sm font-medium text-text">Password</label>
          <input id="signup-password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border border-border bg-paper-raised px-3 py-2 text-sm" />
          <p className="mt-1 text-xs text-text-muted">At least 6 characters.</p>
        </div>
        {error && <p role="alert" className="text-sm text-danger">{error}</p>}
        <button type="submit" disabled={loading || googleLoading} className="w-full rounded-md bg-ink py-2.5 text-sm font-semibold text-paper disabled:opacity-60">
          {loading ? "Creating account…" : "Sign up"}
        </button>
        <p className="text-center text-sm text-text-muted">
          Already have an account? <Link href="/login" className="text-amber hover:underline">Log in</Link>
        </p>
      </form>
    </div>
  );
}