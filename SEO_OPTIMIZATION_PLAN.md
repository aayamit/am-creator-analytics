# SEO Optimization Plan (PM-19)

## 🎯 Overview
Optimize **search engine visibility** for AM Creator Analytics:
- **Dynamic Sitemap** (sitemap.xml)
- **Robots.txt** (crawler instructions)
- **Metadata API** (title, description, OG tags)
- **Structured Data** (JSON-LD for rich snippets)
- **Performance Optimization** (Core Web Vitals)

## 📊 SEO Targets
- **Primary Keywords**: "creator platform India", "influencer marketing tools", "UPI payments creators"
- **Secondary Keywords**: "GST invoice generator", "KYC verification creators", "WhatsApp notifications"
- **Local SEO**: Target Indian cities (Mumbai, Delhi, Bangalore, Hyderabad)

## 🛠️ Implementation Steps

### 1. Create Dynamic Sitemap (app/sitemap.ts)
```typescript
import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages = [
    { url: 'https://amcreator.com', lastModified: new Date() },
    { url: 'https://amcreator.com/about', lastModified: new Date() },
    { url: 'https://amcreator.com/pricing', lastModified: new Date() },
  ];

  // Dynamic pages - Creator Profiles
  const creators = await prisma.creatorProfile.findMany({
    select: { id: true, updatedAt: true },
  });

  const creatorPages = creators.map((creator) => ({
    url: `https://amcreator.com/creators/${creator.id}`,
    lastModified: creator.updatedAt,
  }));

  return [...staticPages, ...creatorPages];
}
```

### 2. Create Robots.txt (app/robots.ts)
```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/', '/_next/'],
    },
    sitemap: 'https://amcreator.com/sitemap.xml',
  };
}
```

### 3. Add Metadata to Key Pages
- **Landing Page**: "AM Creator Analytics — Creator Economy OS"
- **Pricing**: "Pricing Plans — Save ₹80K/month vs Competitors"
- **Creator Profiles**: Dynamic based on creator name + niche

### 4. Add Structured Data (JSON-LD)
```typescript
// app/[tenantId]/dashboard/analytics/page.tsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'AM Creator Analytics',
  description: 'Creator economy platform with GST invoices, UPI payments, WhatsApp notifications',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
  },
};
```

### 5. Performance Optimization
- **Image Optimization**: Use `next/image` for all images
- **Font Optimization**: Use `next/font/google` (Inter font)
- **Code Splitting**: Dynamic imports for heavy components
- **Caching**: SWR/React Query for API data

## ✅ Next Steps
1. Create `app/sitemap.ts` (dynamic sitemap)
2. Create `app/robots.ts` (robots.txt)
3. Update layout.tsx with global metadata
4. Add JSON-LD to key pages
5. Test: `curl https://localhost:3000/sitemap.xml`
6. Test: `curl https://localhost:3000/robots.txt`
7. Validate with Google Search Console
8. Commit PM-19

## 📊 Success Metrics
- **Indexed Pages**: 100+ (creators + static pages)
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- **Organic Traffic**: 1,000 visits/month within 3 months
- **Keyword Rankings**: Top 10 for "creator platform India"
