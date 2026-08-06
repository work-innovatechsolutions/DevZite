import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported as isAnalyticsSupported, type Analytics } from 'firebase/analytics';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

const getPublicEnv = (key: string, fallback: string): string => {
  const value = process.env[key];
  return value || fallback;
};

const firebaseConfig = {
  apiKey: getPublicEnv('NEXT_PUBLIC_FIREBASE_API_KEY', 'missing-api-key'),
  authDomain: getPublicEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 'missing-project.firebaseapp.com'),
  projectId: getPublicEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID', 'missing-project-id'),
  storageBucket: getPublicEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', 'missing-project.appspot.com'),
  messagingSenderId: getPublicEnv('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', '000000000000'),
  appId: getPublicEnv('NEXT_PUBLIC_FIREBASE_APP_ID', '1:000000000000:web:missingappid'),
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase App (Singleton Pattern)
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Client Services
export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);

let analytics: Analytics | undefined = undefined;
if (typeof window !== 'undefined') {
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, analytics };
