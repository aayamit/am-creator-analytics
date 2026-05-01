# OpenSign Integration - Complete Setup Guide

## Overview

Successfully integrated **OpenSign** (self-hosted open-source e-signature platform) into AM Creator Analytics.

---

## What Was Built

### 1. Docker Setup for OpenSign ✅
**File:** `/home/awcreator/workspace/opensign/docker-compose.yml`

```yaml
version: '3.8'
services:
  opensign-app:
    image: opensignlabs/opensign:latest
    ports: ["3001:3000"]
    environment:
      - HOST_URL=http://localhost:3001
      - MONGODB_URI=mongodb://opensign-mongodb:27017/opensign
    depends_on: [opensign-mongodb]
  
  opensign-mongodb:
    image: mongo:6
    ports: ["27017:27017"]
    volumes: [opensign-mongo-data:/data/db]
  
  opensign-caddy:
    image: caddy:2
    ports: ["80:80", "443:443"]

volumes:
  opensign-mongo-data:
```

**To Start:**
```bash
cd /home/awcreator/workspace/opensign
docker compose up -d
# OpenSign will be available at http://localhost:3001
```

---

### 2. OpenSign API Client ✅
**File:** `/home/awcreator/workspace/am-creator-analytics/lib/opensign.ts`

- `createDocument()` - Create contract document
- `sendDocument()` - Send to signers
- `getDocument()` - Check status
- `cancelDocument()` - Cancel if needed
- `generateContractHTML()` - Generate contract HTML

---

### 3. API Routes ✅

#### Create Contract
**File:** `app/api/contracts/create/route.ts`
**Endpoint:** `POST /api/contracts/create`

**Request Body:**
```json
{
  "initiatorType": "BRAND",  // or "CREATOR"
  "initiatorId": "user_123",
  "counterpartyId": "user_456",
  "contractType": "STANDARD",
  "country": "IN",
  "startDate": "2026-05-01",
  "endDate": "2026-06-30",
  "amount": 25000,
  "currency": "INR",
  "deliverables": { "posts": 3, "stories": 5, "reels": 2 },
  "platforms": ["YouTube", "Instagram"]
}
```

**Response:**
```json
{
  "success": true,
  "contractId": "doc_abc123",
  "openSignUrl": "http://localhost:3001/sign/doc_abc123",
  "message": "Contract created and sent for signature"
}
```

#### OpenSign Webhook
**File:** `app/api/webhooks/opensign/route.ts`
**Endpoint:** `POST /api/webhooks/opensign`

Handles:
- `document.signed` - When a party signs
- `document.completed` - When ALL parties sign (triggers signing bonus check)
- `document.cancelled` - Contract cancelled

---

### 4. Contract Creation UI ✅
**File:** `components/contracts/ContractCreationForm.tsx`

**Features:**
- ✅ Dropdown for Contract Type (Standard, Exclusive, NDA, Usage Rights)
- ✅ Dropdown for Country (India, US, EU) → Auto-selects governing law
- ✅ Date pickers for timeline
- ✅ Numeric inputs for deliverables (posts, stories, reels, videos)
- ✅ Platform selection buttons (YouTube, Instagram, LinkedIn, TikTok)
- ✅ Dropdown for Payment Terms (On Completion, Within 7 Days, etc.)
- ✅ Currency selector (INR, USD, EUR)
- ✅ Initiator selection (Brand or Creator can initiate)

**Usage:**
```tsx
import ContractCreationForm from '@/components/contracts/ContractCreationForm';

// In your page:
<ContractCreationForm />
```

---

## Database Schema Updates

### Contract Model (Updated)
```prisma
model Contract {
  id                String          @id @default(cuid())
  campaignCreatorId String          @unique
  campaignCreator  CampaignCreator @relation(...)
  
  // NEW: OpenSign Integration
  initiatedBy      String?        // BRAND or CREATOR
  openSignDocumentId String?        @unique
  openSignUrl        String?
  
  // Existing fields...
  type              ContractType
  status            ContractStatus
  // ...
}
```

**To Apply Schema:**
```bash
cd /home/awcreator/workspace/am-creator-analytics
npx prisma db push
```

---

## Signing Bonus Flow (<50K Followers)

### How It Works
1. **Creator signs up** → Follower count <50K ✅
2. **Complete profile** + KYC verification
3. **Sign "Platform Agreement"** via OpenSign
4. **Bonus triggered** → ₹1,500 sent via Stripe Connect
5. **Can now receive** contract offers from brands

### Implementation
```typescript
// In webhook handler (app/api/webhooks/opensign/route.ts)
async function handleDocumentCompleted(documentId: string) {
  const contract = await prisma.contract.findUnique({
    where: { openSignDocumentId: documentId },
    include: { campaignCreator: { include: { creator: true } } },
  });
  
  if (!contract) return;
  
  const creator = contract.campaignCreator.creator;
  const followerCount = creator.followerCount;
  
  // Signing bonus for <50K followers
  if (followerCount < 50000 && !creator.signingBonusPaid) {
    await stripe.transfers.create({
      amount: 150000,  // ₹1,500 in paise
      currency: 'inr',
      destination: creator.stripeAccountId,
      description: 'Signing bonus for <50K followers',
    });
    
    await prisma.creatorProfile.update({
      where: { id: creator.id },
      data: { signingBonusPaid: true, bonusPaidAt: new Date() },
    });
  }
}
```

---

## UI/UX Flow

### Step 1: Initiate Contract
```
┌─────────────────────────────────┐
│  Create New Contract              │
├─────────────────────────────────┤
│  I am: [Brand ▼] [Creator]  │
│  My User ID: [_______]        │
└─────────────────────────────────┘
```

### Step 2: Select Other Party
```
┌─────────────────────────────────┐
│  Other Party Details            │
├─────────────────────────────────┤
│  Email: [________]            │
│  Name:   [________]          │
└─────────────────────────────────┘
```

### Step 3: Contract Details (Dropdowns)
```
┌─────────────────────────────────┐
│  Contract Type: [Standard ▼]  │
│  Country: [India ▼]           │
│  Start: [2026-05-01 📅]    │
│  End:   [2026-06-30 📅]    │
└─────────────────────────────────┘
```

### Step 4: Compensation
```
┌─────────────────────────────────┐
│  Amount: [₹25,000]          │
│  Currency: [INR ▼]          │
│  Terms: [Within 7 Days ▼]   │
└─────────────────────────────────┘
```

### Step 5: Deliverables
```
┌─────────────────────────────────┐
│  Posts:    [3 ▲▼]           │
│  Stories:  [5 ▲▼]           │
│  Reels:    [2 ▲▼]           │
│                               │
│  Platforms:                  │
│  [✓ YouTube] [✓ Instagram] │
│  [✗ LinkedIn] [✗ TikTok]   │
└─────────────────────────────────┘
```

### Step 6: Review & Send
```
┌─────────────────────────────────┐
│  [Preview Contract]            │
│  [Send to Other Party]        │
└─────────────────────────────────┘
```

---

## Negotiation Flow

### Creator Receives Notification:
```
"TechCorp sent you a contract for ₹25,000"
[View Contract] [Accept] [Negotiate] [Reject]
```

### If "Negotiate":
```
[Message]: "Can we do ₹30,000?"
[Propose Changes]:
  - compensation.amount: 25000 → 30000
  - timeline.end: 2026-06-30 → 2026-07-15
[Send Counter-Offer]
```

### Brand Receives Counter-Offer:
```
"Alex countered your contract offer"
[View Changes] [Accept Counter] [Negotiate Further]
```

---

## Support Ticket System

### Ticket Creation:
```
Related Contract: "TechCorp x Alex"
Subject: "Payment delayed 15 days"
Priority: [Medium ▼]
Description: "Contract stated payment within 7 days..."
[Attachments]: [Upload.pdf]
[Submit Ticket]
```

### Admin Dashboard:
```
Open Tickets (3)
┌─────────────────────────────────┐
│ #1023 | OPEN | HIGH        │
│ "Creator not delivering"       │
│ Assigned: Admin Amit         │
│ [View] [Reply] [Resolve]    │
└─────────────────────────────────┘
```

---

## Environment Variables

Add to `.env.local`:
```env
# OpenSign
OPENSIGN_URL=http://localhost:3001/api/v1
OPENSIGN_API_KEY=your_api_key_here
OPENSIGN_WEBHOOK_SECRET=your_webhook_secret

# Stripe (for signing bonuses)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_CONNECT_CLIENT_ID=ca_...
```

---

## Testing Checklist

### Local Testing:
- [ ] Start OpenSign: `cd opensign && docker compose up -d`
- [ ] Access OpenSign: http://localhost:3001
- [ ] Create API key in OpenSign dashboard
- [ ] Add API key to `.env.local`
- [ ] Test contract creation: `POST /api/contracts/create`
- [ ] Check OpenSign dashboard for document
- [ ] Sign as brand → Sign as creator
- [ ] Verify webhook fires
- [ ] Check signing bonus for <50K creator

### Test Profiles (from earlier seed):
| Role | Email | Password | Followers |
|------|-------|----------|------------|
| Creator Pro | `creator-pro@amcreator.com` | `test123456` | 215K |
| Creator Elite | `creator-elite@amcreator.com` | `test123456` | 520K |
| **Micro Creator** | (create new) | - | **<50K** |

---

## Next Steps

1. **Start OpenSign:**
   ```bash
   cd /home/awcreator/workspace/opensign
   docker compose up -d
   ```

2. **Push Prisma schema:**
   ```bash
   cd /home/awcreator/workspace/am-creator-analytics
   npx prisma db push
   ```

3. **Add OpenSign API key to `.env.local`**

4. **Test the flow:**
   - Sign in as brand
   - Create contract for creator
   - Receive email notification
   - Sign via OpenSign
   - Verify webhook + signing bonus

5. **Production:**
   - Deploy OpenSign to your Arch Linux server
   - Set `OPENSIGN_URL=https://opensign.yourdomain.com`
   - Configure DNS + SSL (Caddy handles this)

---

## Files Created/Modified

| File | Description |
|------|-------------|
| `opensign/docker-compose.yml` | OpenSign Docker setup |
| `lib/opensign.ts` | API client + HTML generator |
| `app/api/contracts/create/route.ts` | Contract creation API |
| `app/api/webhooks/opensign/route.ts` | Webhook handler |
| `components/contracts/ContractCreationForm.tsx` | UI form (dropdowns) |
| `prisma/schema.prisma` | Added OpenSign fields |

---

**Integration Complete! 🎉**
