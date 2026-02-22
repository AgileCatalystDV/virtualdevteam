/**
 * Firebase Auth — SSO (Google, Facebook)
 * @Fede — Sprint 5
 *
 * Config via env: NEXT_PUBLIC_FIREBASE_* (zie FIREBASE_SECURE_SETUP.md)
 * NEXT_PUBLIC_AUTH_MODE=mock → Dev login zonder Firebase
 */

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

/** Mock token voor lokale dev (api-backend met AUTH_MODE=mock) */
export const MOCK_DEV_TOKEN = "mock-dev-token";

export function isAuthMockMode(): boolean {
  return process.env.NEXT_PUBLIC_AUTH_MODE === "mock";
}

function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined") return null;
  if (getApps().length > 0) return getApps()[0] as FirebaseApp;
  if (!firebaseConfig.apiKey) return null;
  return initializeApp(firebaseConfig);
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  return app ? getAuth(app) : null;
}

export const googleProvider = new GoogleAuthProvider();

/** Dev login — zet mock token (werkt met api-backend AUTH_MODE=mock) */
export function signInWithMock(): string {
  return MOCK_DEV_TOKEN;
}

export async function signInWithGoogle(): Promise<string | null> {
  const auth = getFirebaseAuth();
  if (!auth) return null;
  const { signInWithPopup } = await import("firebase/auth");
  const result = await signInWithPopup(auth, googleProvider);
  return result.user.getIdToken();
}

export async function signOut(): Promise<void> {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("auth_token");
  }
  const auth = getFirebaseAuth();
  if (auth) {
    const { signOut: fbSignOut } = await import("firebase/auth");
    await fbSignOut(auth);
  }
}
