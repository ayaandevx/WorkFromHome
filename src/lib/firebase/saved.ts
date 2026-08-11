"use client";

import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { getFirestoreDb } from "./client";

export type SavedContentType = "job" | "article" | "tool" | "resource";

export interface SavedItem {
  type: SavedContentType;
  refId: string; // job id or content slug
  title: string;
  href: string;
  savedAt?: string;
}

function savedCollection(uid: string) {
  const db = getFirestoreDb();
  if (!db) return null;
  return collection(db, "users", uid, "saved");
}

function docKey(type: SavedContentType, refId: string): string {
  return `${type}:${refId}`;
}

/** Maps Firestore's raw error codes to messages worth showing a user. */
export function friendlySaveError(err: unknown): string {
  const code = err && typeof err === "object" && "code" in err ? String((err as { code: string }).code) : "";
  if (code === "permission-denied") {
    return "Saving isn't available right now (permission denied). This usually means Firestore security rules haven't been deployed yet — see firestore.rules.";
  }
  if (code === "unavailable") {
    return "Couldn't reach the server. Check your connection and try again.";
  }
  return "Couldn't save that. Please try again.";
}

export async function saveItem(uid: string, item: SavedItem): Promise<void> {
  const col = savedCollection(uid);
  if (!col) throw new Error("Firestore is not configured.");
  await setDoc(doc(col, docKey(item.type, item.refId)), { ...item, savedAt: serverTimestamp() });
}

export async function unsaveItem(uid: string, type: SavedContentType, refId: string): Promise<void> {
  const col = savedCollection(uid);
  if (!col) throw new Error("Firestore is not configured.");
  await deleteDoc(doc(col, docKey(type, refId)));
}

/**
 * Subscribes to a user's saved items in real time. Replaces the old
 * pattern of every <SaveButton> independently calling getDocs() on mount,
 * which caused N reads per page and a race where an unrelated re-render
 * could refetch stale data and stomp on a just-completed save/unsave. A
 * single subscription shared via SavedItemsContext eliminates both.
 * Returns an unsubscribe function.
 */
export function subscribeSavedItems(
  uid: string,
  onChange: (items: SavedItem[]) => void,
  onError: (err: unknown) => void
): () => void {
  const col = savedCollection(uid);
  if (!col) {
    onChange([]);
    return () => {};
  }
  return onSnapshot(
    col,
    (snap) => onChange(snap.docs.map((d) => d.data() as SavedItem)),
    onError
  );
}