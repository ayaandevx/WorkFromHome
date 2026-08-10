"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
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

export async function saveItem(uid: string, item: SavedItem): Promise<void> {
  const col = savedCollection(uid);
  if (!col) throw new Error("Firestore is not configured.");
  const id = `${item.type}:${item.refId}`;
  await setDoc(doc(col, id), { ...item, savedAt: serverTimestamp() });
}

export async function unsaveItem(uid: string, type: SavedContentType, refId: string): Promise<void> {
  const col = savedCollection(uid);
  if (!col) throw new Error("Firestore is not configured.");
  await deleteDoc(doc(col, `${type}:${refId}`));
}

export async function listSavedItems(uid: string): Promise<SavedItem[]> {
  const col = savedCollection(uid);
  if (!col) return [];
  const snap = await getDocs(col);
  return snap.docs.map((d) => d.data() as SavedItem);
}
