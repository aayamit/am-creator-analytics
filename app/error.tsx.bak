'use client';

/**
 * Global Error Boundary
 * Catches React rendering errors (app router)
 * Bloomberg × McKinsey design
 */

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console (Sentry integration can be added later)
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body style={{
        margin: 0,
        backgroundColor: '#F8F7F4',
        fontFamily: 'Inter, -apple-system, sans-serif',
      }}>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
        }}>
          <Card style={{
            maxWidth: '500px',
            width: '100%',
            border: '1px solid #92400e40',
            backgroundColor: '#FFFFFF',
          }}>
            <CardHeader style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#FEE2E2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}>
                <AlertTriangle size={32} style={{ color: '#DC2626' }} />
              </div>
              <CardTitle style={{
                color: '#1a1a2e',
                fontSize: '24px',
                marginBottom: '8px',
              }}>
                Something went wrong!
              </CardTitle>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#92400e',
                opacity: 0.8,
              }}>
                An unexpected error occurred
              </p>
            </CardHeader>
            <CardContent style={{ textAlign: 'center' }}>
              {error?.message && (
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: '#F8F7F4',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  marginBottom: '24px',
                  fontSize: '12px',
                  color: '#92400e',
                  fontFamily: 'monospace',
                  textAlign: 'left',
                  overflowX: 'auto',
                }}>
                  {error.message}
                </div>
              )}
              
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
              }}>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  style={{
                    border: '1px solid #e5e7eb',
                    color: '#1a1a2e',
                  }}
                >
                  Reload Page
                </Button>
                <Button
                  onClick={reset}
                  style={{
                    backgroundColor: '#1a1a2e',
                    color: '#F8F7F4',
                  }}
                >
                  Try Again
                </Button>
              </div>

              {error?.digest && (
                <p style={{
                  margin: '16px 0 0 0',
                  fontSize: '11px',
                  color: '#92400e',
                  opacity: 0.6,
                }}>
                  Error ID: {error.digest}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  );
}
