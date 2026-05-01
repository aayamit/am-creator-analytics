# A/B Testing Framework Plan (PM-22)

## 🎯 Overview
Build **A/B testing infrastructure** for campaigns:
- **Create A/B Test**: Split creators into Group A (control) and Group B (variant)
- **Track Metrics**: Engagement rate, conversions, ROI per group
- **Statistical Significance**: Calculate p-value (chi-square or t-test)
- **Winner Declaration**: Auto-declare winner when significance reached

## 📊 A/B Test Types
1. **Creative A/B**: Test two different creatives (image, video, caption)
2. **Audience A/B**: Test different audience segments
3. **Budget A/B**: Test different budget allocations
4. **Platform A/B**: Test Instagram vs YouTube vs TikTok

## 🛠️ Implementation Steps

### 1. Add ABTest Model to Prisma Schema
```prisma
model ABTest {
  id          String   @id @default(cuid())
  campaignId  String
  campaign    Campaign @relation(fields: [campaignId], references: [id])
  
  name        String
  description String?
  
  variantA     Json // Creative details (image, caption, etc.)
  variantB     Json // Creative details
  
  splitRatio   Float   @default(0.5) // 50-50 split
  startDate    DateTime
  endDate      DateTime?
  
  status       ABTestStatus @default:RUNNING
  winner      String?  // 'A' or 'B'
  confidence   Float?   // 0-1 (95% = 0.95)
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@map('ab_tests')
}

enum ABTestStatus {
  DRAFT
  RUNNING
  COMPLETED
  CANCELLED
}

// Add to Campaign model
model Campaign {
  // ... existing fields
  abTests ABTest[]
}
```

### 2. Create A/B Test API Routes
- **POST /api/campaigns/[id]/ab-tests** — Create new A/B test
- **GET /api/campaigns/[id]/ab-tests** — List all A/B tests for campaign
- **GET /api/ab-tests/[testId]** — Get single A/B test with results
- **POST /api/ab-tests/[testId]/declare-winner** — Manual winner declaration

### 3. Backend: Statistical Analysis
```typescript
// lib/ab-test-stats.ts
export function calculateSignificance(
  conversionsA: number, 
  visitorsA: number,
  conversionsB: number, 
  visitorsB: number
): { pValue: number; isSignificant: boolean; winner: 'A' | 'B' | null } {
  // Chi-square test for conversion rates
  const expectedA = (conversionsA + conversionsB) / (visitorsA + visitorsB) * visitorsA;
  const expectedB = (conversionsA + conversionsB) / (visitorsA + visitorsB) * visitorsB;
  
  const chiSquare = 
    Math.pow(conversionsA - expectedA, 2) / expectedA +
    Math.pow(conversionsB - expectedB, 2) / expectedB +
    // ... (similar for non-conversions)
  
  // Simplified: p-value < 0.05 means significant
  const pValue = chiSquare > 3.841 ? 0.05 : 0.5; // Simplified
  
  return {
    pValue,
    isSignificant: pValue < 0.05,
    winner: conversionsA / visitorsA > conversionsB / visitorsB ? 'A' : 'B',
  };
}
```

### 4. Create A/B Test UI Components
- **ABTestCreator** — Form to set up A/B test (variant A/B details)
- **ABTestResults** — Real-time dashboard showing:
  - Variant A metrics (impressions, engagement, conversions)
  - Variant B metrics
  - Confidence interval
  - Winner badge (if significant)
- **ABTestList** — List all A/B tests for a campaign

### 5. Integrate into Campaign Page
- Add "A/B Tests" tab to campaign detail page
- Show active A/B tests with live metrics
- Button to "Create A/B Test"

## ✅ Next Steps
1. Add ABTest model to Prisma schema
2. Run `npx prisma migrate dev`
3. Create API routes for A/B tests
4. Build ABTestCreator component
5. Build ABTestResults component
6. Integrate into campaign detail page
7. Test: Create A/B test, simulate results
8. Commit PM-22

## 💰 Cost Savings
- **A/B Testing**: Custom (free) vs Optimizely ($50k+/yr)
- **Stats Engine**: Custom chi-square (free) vs Mixpanel ($25k/yr)

**Total Savings**: ~₹62L/year (vs enterprise A/B testing platforms)
