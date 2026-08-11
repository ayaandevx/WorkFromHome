"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useAuth } from "@/lib/firebase/AuthContext";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { useSavedItems } from "@/lib/firebase/SavedItemsContext";

export function DashboardView() {
  const { user, loading, isFirebaseConfigured } = useAuth();
  const { items, ready, toggle } = useSavedItems();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (!isFirebaseConfigured) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="rounded-lg border border-amber/40 bg-amber/5 p-6 text-sm text-text">
          Accounts aren&apos;t configured in this environment yet. See README.md &ldquo;Connecting Firebase Auth&rdquo;
          to enable sign-in and saved content.
        </div>
      </div>
    );
  }

  if (loading || !user) {
    return <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 text-text-muted">Loading…</div>;
  }

  const grouped = {
    job: items.filter((s) => s.type === "job"),
    article: items.filter((s) => s.type === "article"),
    tool: items.filter((s) => s.type === "tool"),
    resource: items.filter((s) => s.type === "resource"),
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Dashboard</h1>
          <p className="mt-1 text-sm text-text-muted">{user.email}</p>
        </div>
        <button
          type="button"
          onClick={async () => {
            const auth = getFirebaseAuth();
            if (auth) await signOut(auth);
            router.push("/");
          }}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-sage-light"
        >
          Log out
        </button>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-xl font-semibold text-ink">Saved</h2>
        {!ready ? (
          <p className="mt-3 text-sm text-text-muted">Loading saved items…</p>
        ) : items.length === 0 ? (
          <p className="mt-3 text-sm text-text-muted">
            Nothing saved yet. Use the bookmark icon on any job or article to save it here.
          </p>
        ) : (
          <div className="mt-4 space-y-6">
            {Object.entries(grouped).map(([type, groupItems]) =>
              groupItems.length > 0 ? (
                <div key={type}>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">{type}s</h3>
                  <ul className="mt-2 space-y-2">
                    {groupItems.map((item) => (
                      <li key={`${item.type}:${item.refId}`} className="flex items-center justify-between rounded-lg border border-border bg-paper-raised p-3">
                        <Link href={item.href} className="text-sm font-medium text-ink hover:text-amber">
                          {item.title}
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggle(item).catch((err) => console.error(err))}
                          className="text-xs text-text-muted hover:text-danger"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
}
