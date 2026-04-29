# Performance Optimization Plan

## ⚡ Overview
Optimize AM Creator Analytics for **Core Web Vitals** and **SEO**:
- **Caching**: Redis (self-hosted) for API responses
- **Image Optimization**: Next.js Image + WebP/AVIF
- **Code Splitting**: Dynamic imports for large components
- **Database Optimization**: Indexes, query optimization

## 🚀 Quick Wins

### 1. Redis Caching (Self-Hosted)
**Saves ₹10K/month** vs Redis Cloud

```yaml
# docker-compose.yml
redis:
  image: redis:alpine
  restart: unless-stopped
  ports:
    - "6379:6379"
  volumes:
    - redis_data:/data
  command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru

volumes:
  redis_data:
```

### 2. Install Redis Client
```bash
npm install ioredis
npm install -D @types/ioredis
```

### 3. Create Redis Client
```typescript
// lib/redis.ts
import Redis from 'ioredis';

export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: 3,
});

// Cache wrapper
export async function cache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 300
): Promise<T> {
  // Try cache first
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }

  // Fetch fresh data
  const data = await fetcher();
  
  // Cache it
  await redis.setex(key, ttlSeconds, JSON.stringify(data));
  
  return data;
}
```

### 4. Use in API Routes
```typescript
// app/api/campaigns/route.ts
import { cache } from '@/lib/redis';

export async function GET(request: NextRequest) {
  const tenantId = getTenantId(request);
  
  const campaigns = await cache(
    `campaigns:${tenantId}`,
    async () => {
      return await prisma.campaign.findMany({
        where: { tenantId },
      });
    },
    60 // cache for 60 seconds
  );

  return NextResponse.json(campaigns);
}
```

## 🖼️ Image Optimization

### 1. Use Next.js Image Component
```tsx
import Image from 'next/image';

// Before (slow):
<img src="/creator.jpg" alt="Creator" width={100} height={100} />

// After (fast):
<Image
  src="/creator.jpg"
  alt="Creator"
  width={100}
  height={100}
  quality={85}
  placeholder="blur"
  blurDataURL="data:image/..."
/>
```

### 2. Optimize Uploads (MinIO)
```typescript
// lib/image-optimization.ts
import sharp from 'sharp';

export async function optimizeImage(
  buffer: Buffer,
  options: { width?: number; height?: number; quality?: number } = {}
): Promise<Buffer> {
  const { width = 800, height, quality = 85 } = options;

  return await sharp(buffer)
    .resize(width, height, { fit: 'inside' })
    .webp({ quality })
    .toBuffer();
}
```

## 📦 Code Splitting

### 1. Dynamic Imports
```tsx
import dynamic from 'next/dynamic';

// Heavy component - load only when needed
const AdvancedChart = dynamic(
  () => import('@/components/analytics/advanced-chart'),
  {
    loading: () => <p>Loading chart...</p>,
    ssr: false, // Disable server-side rendering
  }
);

export default function AnalyticsPage() {
  return (
    <div>
      <h1>Analytics</h1>
      <AdvancedChart /> {/* Loads on client-side only */}
    </div>
  );
}
```

### 2. Lazy Load Components
```tsx
// components/lazy-loader.tsx
'use client';

import { lazy, Suspense } from 'react';

export function LazyComponent({ componentPath, ...props }: { componentPath: string; [key: string]: any }) {
  const Component = lazy(() => import(componentPath));
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component {...props} />
    </Suspense>
  );
}
```

## 🗄️ Database Optimization

### 1. Add Indexes
```prisma
// prisma/schema.prisma
model Campaign {
  id          String   @id @default(cuid())
  name        String
  tenantId    String
  status      CampaignStatus

  @@index([tenantId, status]) // Add index for common queries
  @@index([createdAt]) // Add index for sorting
}

model Contract {
  id          String   @id @default(cuid())
  campaignId  String
  creatorId   String
  status      ContractStatus

  @@index([campaignId, status])
  @@index([creatorId, status])
}
```

### 2. Optimize Queries
```typescript
// Before (N+1 problem):
const campaigns = await prisma.campaign.findMany();
for (const campaign of campaigns) {
  campaign.creatorCount = await prisma.creator.count({
    where: { campaigns: { some: { id: campaign.id } } },
  });
}

// After (single query with include):
const campaigns = await prisma.campaign.findMany({
  include: {
    _count: {
      select: { creators: true },
    },
  },
});
```

## 📊 Monitoring

### 1. Add Performance Monitoring
```typescript
// lib/performance.ts
export function measurePerformance(name: string, fn: () => Promise<any>) {
  const start = performance.now();
  return fn().then((result) => {
    const duration = performance.now() - start;
    console.log(`⚡ ${name}: ${duration.toFixed(2)}ms`);
    return result;
  });
}

// Use in API routes:
export async function GET() {
  return await measurePerformance('Fetch Campaigns', async () => {
    return await prisma.campaign.findMany();
  });
}
```

## 🎯 Build Order
1. **Add Redis to Docker** (caching)
2. **Create lib/redis.ts** (Redis client)
3. **Update API routes** to use caching
4. **Optimize images** (sharp + Next.js Image)
5. **Add dynamic imports** for heavy components
6. **Add database indexes** (Prisma)
7. **Monitor performance** (console logs)

## 💰 Cost Savings
- **Redis (self-hosted)**: FREE (just server costs)
- **Redis Cloud**: ₹10K/month for similar memory
- **Savings**: **₹10K/month**

## 📈 Expected Improvements
- **API Response Time**: 200ms → 50ms (with caching)
- **Image Load Time**: 2s → 500ms (with optimization)
- **First Contentful Paint**: 1.5s → 0.8s (with code splitting)
- **Lighthouse Score**: 70 → 95+

---

**Ready to optimize? Say "optimize now" and I'll start building!** ⚡
