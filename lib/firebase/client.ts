import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported as isAnalyticsSupported, type Analytics } from 'firebase/analytics';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const hasFirebaseClientConfig = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.storageBucket &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId,
);

// Initialize Firebase only when public config exists.
const app: FirebaseApp | undefined = hasFirebaseClientConfig
  ? !getApps().length
    ? initializeApp(firebaseConfig)
    : getApp()
  : undefined;

// Client Services
export const db: Firestore | undefined = app ? getFirestore(app) : undefined;
export const auth: Auth | undefined = app ? getAuth(app) : undefined;
export const isFirebaseClientConfigured = hasFirebaseClientConfig;

let analytics: Analytics | undefined = undefined;
if (app && typeof window !== 'undefined' && firebaseConfig.measurementId) {
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, analytics };
