"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/firebase/AuthContext";
import { saveItem, unsaveItem, listSavedItems, type SavedContentType } from "@/lib/firebase/saved";

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
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    listSavedItems(user.uid).then((items) => {
      setSaved(items.some((i) => i.type === type && i.refId === refId));
    });
  }, [user, type, refId]);

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

  async function toggle() {
    if (!user) return;
    setBusy(true);
    try {
      if (saved) {
        await unsaveItem(user.uid, type, refId);
        setSaved(false);
      } else {
        await saveItem(user.uid, { type, refId, title, href });
        setSaved(true);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save"}
      title={saved ? "Remove from saved" : "Save"}
      className={`shrink-0 rounded-md border p-1.5 transition-colors ${
        saved ? "border-amber bg-amber/10 text-amber" : "border-border text-text-muted hover:text-amber"
      }`}
    >
      <BookmarkIcon filled={saved} />
    </button>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill={filled ? "currentColor" : "none"} aria-hidden="true">
      <path d="M3.5 2.5H12.5V13.5L8 10.8L3.5 13.5V2.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
