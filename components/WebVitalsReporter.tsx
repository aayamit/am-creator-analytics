/**
 * Web Vitals Reporter Component
 * Client component that reports Core Web Vitals
 * Added to root layout (app/layout.tsx)
 */

'use client';

import { useEffect } from 'react';
import { reportWebVitals } from '@/lib/web-vitals';

export default function WebVitalsReporter() {
  useEffect(() => {
    // Start reporting Web Vitals
    reportWebVitals();
  }, []);

  // This component renders nothing (invisible)
  return null;
}
