import { getDatabase, type Database } from 'firebase/database';
import { app } from './client';

const RTDB_URL =
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
  'https://dev-zite-default-rtdb.asia-southeast1.firebasedatabase.app';

// Firebase Realtime Database instance (client-side)
let rtdb: Database | undefined = undefined;

if (app) {
  rtdb = getDatabase(app, RTDB_URL);
}

export { rtdb };
export const isRtdbConfigured = Boolean(rtdb);
