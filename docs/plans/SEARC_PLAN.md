# Search Integration Plan

## 🔍 Overview
Add **MeiliSearch** for fast, typo-tolerant search across:
- Creators (by name, niche, platform)
- Campaigns (by name, brand, status)
- Contracts (by ID, status)

**Saves ₹15K/month** vs Algolia.

## 🚀 Quick Setup

### 1. Add MeiliSearch to docker-compose.yml
```yaml
meilisearch:
  image: getmeili/meilisearch:latest
  ports:
    - "7700:7700"
  environment:
    MEILI_MASTER_KEY: ${MEILI_MASTER_KEY:-my-master-key}
  volumes:
    - meili_data:/meili_data
```

### 2. Install MeiliSearch Client
```bash
npm install meilisearch
```

### 3. Initialize Indexes
```typescript
// lib/meilisearch.ts
import { MeiliSearch } from 'meilisearch';

export const meili = new MeiliSearch({
  host: 'http://localhost:7700',
  apiKey: process.env.MEILI_MASTER_KEY,
});

// Create indexes
export async function initMeiliSearch() {
  await meili.createIndex('creators', { primaryKey: 'id' });
  await meili.createIndex('campaigns', { primaryKey: 'id' });
  await meili.createIndex('contracts', { primaryKey: 'id' });
}
```

## 📂 Features to Build

1. **Search API** (`/api/search/route.ts`)
   - Universal search across all indexes
   - Filters (type, status, date range)

2. **Search Component** (`components/search/search-bar.tsx`)
   - Dropdown with real-time results
   - Keyboard navigation
   - Recent searches

3. **Indexing Logic**
   - Auto-index on create/update
   - Batch re-index endpoint

4. **Search Page** (`app/[tenantId]/dashboard/search/page.tsx`)
   - Full search results page
   - Filters sidebar
   - Sort options

## 💰 Cost Savings
- **MeiliSearch (self-hosted)**: FREE (only server costs)
- **Algolia**: ₹15K/month for similar volume
- **Savings**: **₹15K/month**

## 🔗 Integration Points
1. **On Creator Create**: Index new creator
2. **On Campaign Create**: Index new campaign
3. **On Contract Signed**: Update contract status
4. **In Search Bar**: Query across indexes

## 🚀 Build Order
1. **Add MeiliSearch to Docker**
2. **Create lib/meilisearch.ts**
3. **Create /api/search/route.ts**
4. **Create components/search/search-bar.tsx**
5. **Add search to sidebar**
6. **Create search results page**
