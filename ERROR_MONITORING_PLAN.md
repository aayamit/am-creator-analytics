# Error Boundaries & Monitoring Plan (PM-6)

## 🎯 Overview
Add **production-grade error handling** + **observability**:
- **Global Error Boundary** (catch React rendering errors)
- **API Error Handling** (consistent error responses)
- **Sentry Integration** (already partially set up)
- **Health Check Endpoints** (monitoring)
- **Logging Middleware** (request/response logging)

## 📦 Open-Source Stack
- **Sentry** (free tier: 5K errors/month)
- **Next.js `error.tsx`** (built-in error boundaries)
- **Custom logging** (Winston/pino alternative: simple console.log wrapper)

## 💰 Cost Savings
- **LogRocket**: $99/month
- **TrackJS**: $72/month
- **Our Approach**: $0 (Sentry free tier + custom logging)

## 🛠️ Implementation Steps

### 1. Create Global Error Boundary (`error.tsx`)
```tsx
// app/error.tsx
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to Sentry
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F8F7F4',
          padding: '32px',
        }}>
          <Card style={{ maxWidth: '500px', width: '100%', border: '1px solid #92400e' }}>
            <CardContent style={{ padding: '32px', textAlign: 'center' }}>
              <h2 style={{ color: '#1a1a2e', marginBottom: '16px' }}>
                Something went wrong!
              </h2>
              <p style={{ color: '#92400e', marginBottom: '24px' }}>
                {error.message || 'An unexpected error occurred.'}
              </p>
              <Button
                onClick={reset}
                style={{
                  backgroundColor: '#1a1a2e',
                  color: '#F8F7F4',
                }}
              >
                Try again
              </Button>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  );
}
```

### 2. Create Health Check API (`/api/health/route.ts`)
```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'up',
        api: 'up',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
```

### 3. Add Request Logging Middleware (`middleware.ts`)
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const start = Date.now();
  const response = NextResponse.next();
  
  const duration = Date.now() - start;
  console.log(`[${request.method}] ${request.url} - ${duration}ms`);
  
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
```

### 4. Create `instrumentation.ts` (Sentry setup)
```typescript
import * as Sentry from '@sentry/nextjs';

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 1.0,
    });
  }
}
```

## ✅ Next Steps
1. Create `app/error.tsx` (global error boundary)
2. Create `app/api/health/route.ts` (health check)
3. Update `middleware.ts` (request logging)
4. Create `instrumentation.ts` (Sentry setup)
5. Add error tracking to API routes
6. Test build + commit PM-6