import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth }      from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage }   from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const hasFirebaseClientConfig = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.storageBucket &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId,
);

const shouldEnableAnalytics = process.env.NEXT_PUBLIC_ENABLE_FIREBASE_ANALYTICS === 'true';

// Initialize Firebase (singleton — safe for Next.js hot reload)
const app = hasFirebaseClientConfig
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : undefined;

export const auth      = app ? getAuth(app) : undefined;
export const db        = app ? getFirestore(app) : undefined;
export const storage   = app ? getStorage(app) : undefined;

// Analytics only runs on the client
export async function getAnalyticsInstance() {
  if (app && shouldEnableAnalytics && firebaseConfig.measurementId && await isSupported()) {
    return getAnalytics(app);
  }
  return null;
}

export default app;
