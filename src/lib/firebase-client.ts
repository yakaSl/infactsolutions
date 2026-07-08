import { getApps, getApp, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

// Client-side Firebase Web config. These are NEXT_PUBLIC_ values inlined at
// build time and are safe to expose in the browser (Firebase Web API keys are
// public identifiers, not secrets). Values come from Firebase console:
// Project settings -> General -> Your apps -> Web app -> SDK setup.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

function hasRequiredConfig(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.appId && firebaseConfig.projectId);
}

export function getFirebaseApp(): FirebaseApp | null {
  if (!hasRequiredConfig()) return null;
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

let analyticsInstance: Analytics | null = null;

/**
 * Initialize Firebase Analytics in the browser. No-ops on the server, when the
 * config is missing, or when the environment doesn't support Analytics (e.g.
 * some in-app browsers, cookies disabled). Safe to call more than once.
 */
export async function initAnalytics(): Promise<Analytics | null> {
  if (typeof window === 'undefined') return null;
  if (analyticsInstance) return analyticsInstance;
  if (!firebaseConfig.measurementId) return null;

  const app = getFirebaseApp();
  if (!app) return null;

  try {
    if (!(await isSupported())) return null;
    analyticsInstance = getAnalytics(app);
    return analyticsInstance;
  } catch (err) {
    console.error('[firebase] failed to initialize Analytics', err);
    return null;
  }
}
