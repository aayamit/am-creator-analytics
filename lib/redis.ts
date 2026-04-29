/**
 * Redis Client for Self-Hosted Caching
 * Saves ₹10K/month vs Redis Cloud
 */

import Redis from 'ioredis';

// Create Redis client
export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: 3,
  lazyConnect: true, // Don't connect immediately
});

// Cache wrapper with TTL
export async function cache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 300 // 5 minutes default
): Promise<T> {
  try {
    // Try cache first
    const cached = await redis.get(key);
    if (cached) {
      console.log(`⚡ Cache HIT: ${key}`);
      return JSON.parse(cached);
    }
  } catch (error) {
    console.error('Redis GET error:', error);
  }

  // Fetch fresh data
  console.log(`⚡ Cache MISS: ${key}`);
  const data = await fetcher();

  try {
    // Cache it
    await redis.setex(key, ttlSeconds, JSON.stringify(data));
  } catch (error) {
    console.error('Redis SET error:', error);
  }

  return data;
}

// Invalidate cache
export async function invalidateCache(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`⚡ Cache INVALIDATED: ${keys.length} keys matching "${pattern}"`);
    }
  } catch (error) {
    console.error('Redis DEL error:', error);
  }
}

// Clear all cache (use with caution!)
export async function clearCache(): Promise<void> {
  try {
    await redis.flushall();
    console.log('⚡ Cache CLEARED');
  } catch (error) {
    console.error('Redis FLUSHALL error:', error);
  }
}

// Example usage in API routes:
/*
import { cache, invalidateCache } from '@/lib/redis';

// GET with caching
export async function GET() {
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

// POST/PUT/DELETE - invalidate cache
export async function POST() {
  const campaign = await prisma.campaign.create({ data: {...} });
  
  // Invalidate campaigns cache for this tenant
  await invalidateCache(`campaigns:${tenantId}:*`);
  
  return NextResponse.json(campaign);
}
*/
