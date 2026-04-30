/**
 * Web Vitals Reporting
 * Sends Core Web Vitals to our API endpoint
 * Uses web-vitals library (MIT)
 */

'use client';

import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

export function reportWebVitals() {
  const sendToAPI = async (metric: any) => {
    try {
      await fetch('/api/vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: metric.name,
          value: metric.value,
          id: metric.id,
          delta: metric.delta,
          entries: metric.entries?.length || 0,
          navigationType: (performance as any).navigation?.type || 'navigate',
        }),
      });
    } catch (error) {
      console.error('Failed to send web vital:', error);
    }
  };

  // Measure all Core Web Vitals (FID replaced by INP in v5+)
  onCLS(sendToAPI);
  onFCP(sendToAPI);
  onINP(sendToAPI); // Interaction to Next Paint (replaces FID)
  onLCP(sendToAPI);
  onTTFB(sendToAPI);
}

export default reportWebVitals;
