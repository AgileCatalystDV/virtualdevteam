/**
 * Firebase Auth — SSO (Google, Facebook)
 * @Fede — Sprint 5
 *
 * Config via env: NEXT_PUBLIC_FIREBASE_* (zie FIREBASE_SECURE_SETUP.md)
 */

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

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

export async function signInWithGoogle(): Promise<string | null> {
  const auth = getFirebaseAuth();
  if (!auth) return null;
  const { signInWithPopup } = await import("firebase/auth");
  const result = await signInWithPopup(auth, googleProvider);
  return result.user.getIdToken();
}

export async function signOut(): Promise<void> {
  const auth = getFirebaseAuth();
  if (auth) {
    const { signOut: fbSignOut } = await import("firebase/auth");
    await fbSignOut(auth);
  }
}
