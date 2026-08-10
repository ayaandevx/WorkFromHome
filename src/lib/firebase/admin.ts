import "server-only";
import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getAuth as getAdminAuth, type Auth as AdminAuth } from "firebase-admin/auth";

/**
 * Firebase Admin, used server-side (API routes) to verify ID tokens sent
 * from the client before trusting a request as authenticated — e.g. when
 * saving a job or article to a user's account.
 *
 * Requires FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
 * from a Firebase service account JSON. See README.md for setup.
 */

let adminApp: App | null = null;

export const isFirebaseAdminConfigured = Boolean(
  process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY
);

function getAdminApp(): App | null {
  if (!isFirebaseAdminConfigured) return null;
  if (adminApp) return adminApp;
  if (getApps().length) {
    adminApp = getApps()[0]!;
    return adminApp;
  }
  adminApp = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Escaped newlines in env vars must be restored.
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
  return adminApp;
}

export function getAdminAuthInstance(): AdminAuth | null {
  const app = getAdminApp();
  if (!app) return null;
  return getAdminAuth(app);
}

/** Verifies a Firebase ID token from an Authorization: Bearer header. Returns the uid or null. */
export async function verifyIdToken(token: string | undefined | null): Promise<string | null> {
  if (!token) return null;
  const auth = getAdminAuthInstance();
  if (!auth) return null;
  try {
    const decoded = await auth.verifyIdToken(token);
    return decoded.uid;
  } catch {
    return null;
  }
}
