"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/firebase/AuthContext";
import { useSavedItems } from "@/lib/firebase/SavedItemsContext";
import type { SavedContentType } from "@/lib/firebase/saved";
import { track } from "@/lib/analytics";

export function SaveButton({
  type,
  refId,
  title,
  href,
}: {
  type: SavedContentType;
  refId: string;
  title: string;
  href: string;
}) {
  const { user, loading } = useAuth();
  const { isSaved, toggle } = useSavedItems();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) return null;

  if (!user) {
    return (
      <Link
        href="/login"
        className="shrink-0 rounded-md border border-border p-1.5 text-text-muted hover:text-amber"
        aria-label="Log in to save"
        title="Log in to save"
      >
        <BookmarkIcon filled={false} />
      </Link>
    );
  }

  const saved = isSaved(type, refId);

  async function handleClick() {
    setBusy(true);
    setError(null);
    try {
      await toggle({ type, refId, title, href });
      track({ name: "content_saved", contentType: type, refId });
    } catch (err) {
      // Previously this failure was swallowed entirely — the button looked
      // broken with no indication anything went wrong. Now it's shown.
      setError(err instanceof Error ? err.message : "Couldn't save that. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        aria-pressed={saved}
        aria-label={saved ? "Remove from saved" : "Save"}
        title={saved ? "Remove from saved" : "Save"}
        className={`rounded-md border p-1.5 transition-colors disabled:opacity-60 ${
          saved ? "border-amber bg-amber/10 text-amber" : "border-border text-text-muted hover:text-amber"
        }`}
      >
        <BookmarkIcon filled={saved} />
      </button>
      {error && (
        <p role="alert" className="absolute right-0 top-full z-10 mt-1 w-56 rounded-md border border-danger/30 bg-paper-raised p-2 text-xs text-danger shadow-md">
          {error}
        </p>
      )}
    </div>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill={filled ? "currentColor" : "none"} aria-hidden="true">
      <path d="M3.5 2.5H12.5V13.5L8 10.8L3.5 13.5V2.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
