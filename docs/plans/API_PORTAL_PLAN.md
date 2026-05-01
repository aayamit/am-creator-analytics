# API Developer Portal Plan (PM-24)

## 🎯 Overview
Build **developer portal** for enterprise brands:
- **API Key Management**: Create, rotate, revoke keys
- **Usage Dashboard**: Requests/day, rate limits, errors
- **Interactive API Docs**: Swagger/OpenAPI spec
- **SDK Generators**: JavaScript, Python, cURL examples
- **Webhooks**: Subscribe to events (campaign.created, payout.sent)

## 📊 API Endpoints for Brands
```
GET  /api/v1/campaigns       # List campaigns
POST /api/v1/campaigns       # Create campaign
GET  /api/v1/campaigns/:id   # Get campaign
PUT  /api/v1/campaigns/:id   # Update campaign
GET  /api/v1/creators       # List creators
POST /api/v1/payouts        # Create payout
GET  /api/v1/analytics      # Get analytics
```

## 🛠️ Implementation Steps

### 1. Add ApiKey Model to Prisma
```prisma
model ApiKey {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  name        String   // "Production", "Staging", etc.
  key         String   @unique // Hashed API key
  prefix      String   // "am_" + 8 chars (for display)
  
  rateLimit   Int      @default(1000) // Requests per day
  usageCount  Int      @default(0)
  
  lastUsed    DateTime?
  expiresAt   DateTime?
  isActive    Boolean  @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map('api_keys')
}
```

### 2. Create API Key Management UI
- **/settings/api-keys** — List all keys, create new, revoke
- **"Create API Key"** — Name input, generates key (shown once!)
- **Usage Chart** — Requests over time
- **Rate Limit** — Progress bar (usage/total)

### 3. Create API Documentation Page
- **/developers** — Public developer portal
- **Swagger UI** — Interactive API explorer
- **Quickstart Guide** — cURL, JavaScript, Python examples
- **Error Codes** — 401, 429, 500, etc.

### 4. Add API Key Auth Middleware
```typescript
// lib/api-auth.ts
export async function validateApiKey(request: NextRequest) {
  const apiKey = request.headers.get('X-API-Key');
  if (!apiKey) return null;
  
  // Hash the key and compare
  const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');
  const keyRecord = await prisma.apiKey.findFirst({
    where: { key: hashedKey, isActive: true },
    include: { user: true },
  });
  
  if (!keyRecord) return null;
  
  // Check rate limit
  if (keyRecord.usageCount >= keyRecord.rateLimit) {
    return 'RATE_LIMITED';
  }
  
  // Increment usage
  await prisma.apiKey.update({
    where: { id: keyRecord.id },
    data: { usageCount: { increment: 1 }, lastUsed: new Date() },
  });
  
  return keyRecord.user;
}
```

### 5. Create Webhook Event System
- **Webhook Models**: WebhookEndpoint, WebhookEvent
- **Subscribe to Events**: campaign.created, payout.sent, creator.verified
- **Retry Logic**: 3 attempts with exponential backoff
- **Signature Verification**: HMAC-SHA256

### 6. Add SDK Examples
```javascript
// JavaScript SDK
const AM = require('am-creator-sdk');
const client = new AM('am_your_api_key');

// List campaigns
const campaigns = await client.campaigns.list();

// Create payout
const payout = await client.payouts.create({
  creatorId: 'creator_123',
  amount: 5000,
});
```

## ✅ Next Steps
1. Add ApiKey model to Prisma schema
2. Run `npx prisma migrate dev`
3. Create API key management UI
4. Create developer portal page (/developers)
5. Add API key auth middleware
6. Create webhook system
7. Test: Create API key, make request
8. Commit PM-24

## 💰 Cost Savings
- **API Management**: Custom (free) vs Postman/Insomnia Pro ($15-36/user/mo)
- **API Documentation**: Custom (free) vs ReadMe ($99/mo)
- **API Gateway**: Custom (free) vs Apigee ($500+/mo)

**Total Savings**: ~₹1.5L/month per brand
