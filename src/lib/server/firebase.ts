import { getApps, initializeApp, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let cachedApp: App | null = null;
let cachedDb: Firestore | null = null;
let warnedMissing = false;

function readServiceAccount(): Record<string, unknown> | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error('[firebase] FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON', err);
    return null;
  }
}

export function getFirestoreDb(): Firestore | null {
  if (cachedDb) return cachedDb;

  const credentials = readServiceAccount();
  if (!credentials) {
    if (!warnedMissing) {
      console.warn(
        '[firebase] FIREBASE_SERVICE_ACCOUNT_JSON not set — falling back to in-memory storage. ' +
        'Data will be lost on restart and not visible across instances.'
      );
      warnedMissing = true;
    }
    return null;
  }

  try {
    const existing = getApps()[0];
    cachedApp = existing ?? initializeApp({ credential: cert(credentials as never) });
    cachedDb = getFirestore(cachedApp);
    return cachedDb;
  } catch (err) {
    console.error('[firebase] failed to initialize admin SDK', err);
    return null;
  }
}
