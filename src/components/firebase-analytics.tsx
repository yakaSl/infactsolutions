'use client';

import { useEffect } from 'react';
import { initAnalytics } from '@/lib/firebase-client';

/**
 * Mounts once in the root layout and initializes Firebase Analytics in the
 * browser. Renders nothing. All guards (SSR, missing config, unsupported
 * environment) live in initAnalytics.
 */
export default function FirebaseAnalytics() {
  useEffect(() => {
    void initAnalytics();
  }, []);

  return null;
}
