import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';

const getRequiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const projectId = getRequiredEnv('FIREBASE_PROJECT_ID');
const clientEmail = getRequiredEnv('FIREBASE_CLIENT_EMAIL');
const rawPrivateKey = getRequiredEnv('FIREBASE_PRIVATE_KEY');
const privateKey = rawPrivateKey.replace(/\\n/g, '\n');

let adminApp: App;

if (!getApps().length) {
  adminApp = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
} else {
  adminApp = getApps()[0];
}

export const adminDb: Firestore = getFirestore(adminApp);
export const adminAuth: Auth = getAuth(adminApp);
export { adminApp };
