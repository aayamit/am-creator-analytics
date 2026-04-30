/**
 * Dynamic Sitemap Generator
 * Generates sitemap.xml with static + dynamic pages
 * Safe: returns static pages if DB unavailable (build-time safe)
 */

import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://amcreator.com';

  // Static pages only (safe for build time)
  const staticPages = [
    {
      url: `${baseUrl}` as URL,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about` as URL,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing` as URL,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
  ];

  // Skip DB call at build time — dynamic pages added at runtime via API
  // To add creator profiles dynamically, use client-side sitemap generation
  // or an API route that fetches and returns the sitemap XML

  return staticPages;
}
