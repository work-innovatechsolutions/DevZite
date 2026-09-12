import type { FirebaseApp } from 'firebase/app';
import type { Analytics } from 'firebase/analytics';
import type { Firestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const hasFirebaseClientConfig = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.storageBucket &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId,
);

export const isFirebaseClientConfigured = hasFirebaseClientConfig;
const shouldEnableAnalytics = process.env.NEXT_PUBLIC_ENABLE_FIREBASE_ANALYTICS === 'true';

let appPromise: Promise<FirebaseApp | undefined> | null = null;
export async function getFirebaseApp(): Promise<FirebaseApp | undefined> {
  if (typeof window === 'undefined' || !hasFirebaseClientConfig) return undefined;
  if (!appPromise) {
    appPromise = (async () => {
      const { initializeApp, getApps, getApp } = await import('firebase/app');
      return !getApps().length ? initializeApp(firebaseConfig) : getApp();
    })();
  }
  return appPromise;
}

let authPromise: Promise<Auth | undefined> | null = null;
export async function getFirebaseAuth(): Promise<Auth | undefined> {
  if (typeof window === 'undefined' || !hasFirebaseClientConfig) return undefined;
  if (!authPromise) {
    authPromise = (async () => {
      const app = await getFirebaseApp();
      if (!app) return undefined;
      const { getAuth } = await import('firebase/auth');
      return getAuth(app);
    })();
  }
  return authPromise;
}

let dbPromise: Promise<Firestore | undefined> | null = null;
export async function getFirebaseDb(): Promise<Firestore | undefined> {
  if (typeof window === 'undefined' || !hasFirebaseClientConfig) return undefined;
  if (!dbPromise) {
    dbPromise = (async () => {
      const app = await getFirebaseApp();
      if (!app) return undefined;
      const { getFirestore } = await import('firebase/firestore');
      return getFirestore(app);
    })();
  }
  return dbPromise;
}

let analyticsPromise: Promise<Analytics | undefined> | null = null;
export async function getFirebaseAnalytics(): Promise<Analytics | undefined> {
  if (typeof window === 'undefined' || !hasFirebaseClientConfig || !shouldEnableAnalytics || !firebaseConfig.measurementId) {
    return undefined;
  }
  if (!analyticsPromise) {
    analyticsPromise = (async () => {
      const app = await getFirebaseApp();
      if (!app) return undefined;
      const { getAnalytics, isSupported } = await import('firebase/analytics');
      const supported = await isSupported();
      return supported ? getAnalytics(app) : undefined;
    })();
  }
  return analyticsPromise;
}

// Backward-compatible placeholders for typing
export const app: FirebaseApp | undefined = undefined;
export const auth: Auth | undefined = undefined;
export const db: Firestore | undefined = undefined;
export const analytics: Analytics | undefined = undefined;
