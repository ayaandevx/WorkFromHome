"use client";

import Link from "next/link";
import { useAuth } from "@/lib/firebase/AuthContext";

export function AccountMenu() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="h-8 w-20 rounded-md bg-border/60 animate-pulse" aria-hidden="true" />;
  }

  if (user) {
    return (
      <Link
        href="/dashboard"
        className="rounded-md bg-ink px-3 py-1.5 text-sm font-medium text-paper hover:bg-ink-2 transition-colors"
      >
        Dashboard
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/login" className="text-sm font-medium text-text hover:text-ink transition-colors">
        Log in
      </Link>
      <Link
        href="/signup"
        className="rounded-md bg-ink px-3 py-1.5 text-sm font-medium text-paper hover:bg-ink-2 transition-colors"
      >
        Sign up
      </Link>
    </div>
  );
}
