"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import {
  saveItem,
  unsaveItem,
  subscribeSavedItems,
  friendlySaveError,
  type SavedItem,
  type SavedContentType,
} from "./saved";

interface SavedItemsContextValue {
  /** True once the initial snapshot has loaded (or immediately, if logged out). */
  ready: boolean;
  items: SavedItem[];
  isSaved: (type: SavedContentType, refId: string) => boolean;
  /** Optimistically toggles save state; throws a friendly error message on failure so callers can surface it. */
  toggle: (item: SavedItem) => Promise<void>;
}

const SavedItemsContext = createContext<SavedItemsContextValue>({
  ready: true,
  items: [],
  isSaved: () => false,
  toggle: async () => {},
});

export function SavedItemsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<SavedItem[]>([]);
  const [ready, setReady] = useState(false);
  // Tracks keys we've just optimistically changed locally, so an in-flight
  // snapshot update from before our write lands doesn't briefly flicker
  // the UI back to the old state.
  const pendingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      setItems([]);
      setReady(true);
      return;
    }
    setReady(false);
    const unsubscribe = subscribeSavedItems(
      user.uid,
      (nextItems) => {
        setItems(nextItems);
        setReady(true);
      },
      (err) => {
        console.error("[saved-items] subscription error:", friendlySaveError(err), err);
        setReady(true);
      }
    );
    return unsubscribe;
  }, [user]);

  const isSaved = useCallback(
    (type: SavedContentType, refId: string) => items.some((i) => i.type === type && i.refId === refId),
    [items]
  );

  const toggle = useCallback(
    async (item: SavedItem) => {
      if (!user) throw new Error("You need to be logged in to save items.");
      const key = `${item.type}:${item.refId}`;
      const currentlySaved = isSaved(item.type, item.refId);

      // Optimistic update so the button responds instantly rather than
      // waiting on a network round-trip.
      pendingRef.current.add(key);
      setItems((prev) =>
        currentlySaved ? prev.filter((i) => !(i.type === item.type && i.refId === item.refId)) : [...prev, item]
      );

      try {
        if (currentlySaved) {
          await unsaveItem(user.uid, item.type, item.refId);
        } else {
          await saveItem(user.uid, item);
        }
      } catch (err) {
        // Revert the optimistic change and surface a real error instead of
        // failing silently — this was the actual cause of "save doesn't work".
        setItems((prev) =>
          currentlySaved
            ? [...prev, item]
            : prev.filter((i) => !(i.type === item.type && i.refId === item.refId))
        );
        throw new Error(friendlySaveError(err));
      } finally {
        pendingRef.current.delete(key);
      }
    },
    [user, isSaved]
  );

  return (
    <SavedItemsContext.Provider value={{ ready, items, isSaved, toggle }}>{children}</SavedItemsContext.Provider>
  );
}

export function useSavedItems() {
  return useContext(SavedItemsContext);
}
