import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';

const requiredKeys = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'] as const;
const missingKeys = requiredKeys.filter((key) => !process.env[key]);

let initError: string | undefined;

const createUnavailableProxy = <T>(serviceName: string): T => {
  return new Proxy(
    {},
    {
      get() {
        if (missingKeys.length) {
          throw new Error(
            `${serviceName} unavailable: missing Firebase Admin env vars (${missingKeys.join(', ')}).`,
          );
        }
        throw new Error(
          `${serviceName} unavailable: Firebase Admin SDK failed to initialize (${initError || 'Unknown error'}).`,
        );
      },
    },
  ) as T;
};

let adminApp: App | undefined;
let adminDbInstance: Firestore | undefined;
let adminAuthInstance: Auth | undefined;

if (!missingKeys.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID as string;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL as string;
    const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY as string;
    const privateKey = rawPrivateKey
      .trim()
      .replace(/^["']|["']$/g, '')
      .replace(/\\n/g, '\n');

    adminApp = !getApps().length
      ? initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        })
      : getApps()[0];

    adminDbInstance = getFirestore(adminApp);
    adminAuthInstance = getAuth(adminApp);
  } catch (error: any) {
    initError = error?.message || String(error);
    console.error('Firebase Admin initialization failed:', error);
  }
}

export const adminDb: Firestore = adminDbInstance || createUnavailableProxy<Firestore>('Firestore');
export const adminAuth: Auth = adminAuthInstance || createUnavailableProxy<Auth>('Auth');
export const isFirebaseAdminConfigured = Boolean(adminApp && adminDbInstance && adminAuthInstance);
export { adminApp };

