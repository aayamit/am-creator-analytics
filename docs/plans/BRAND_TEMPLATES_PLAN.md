# Brand Campaign Templates Plan (PM-18)

## 🎯 Overview
Build **reusable campaign templates** for brands:
- **Save Campaign as Template** (with budget, requirements, deliverables)
- **Browse Templates** (public library + brand-specific)
- **Create Campaign from Template** (pre-fill form)
- **Template Categories** (Fashion, Tech, Food, Travel, etc.)

## 💰 Cost Comparison
| Solution | Cost | Notes |
|----------|------|-------|
| **HubSpot Templates** | $50/month | Marketing templates |
| **Notion Templates** | $10/month | Customizable |
| **Our Approach: Self-built** | ₹0 | Open-source, customizable |

## 🛠️ Implementation Steps

### 1. Add CampaignTemplate Model to Prisma
```prisma
model CampaignTemplate {
  id          String   @id @default(cuid())
  name        String
  description String?  @db.Text
  
  // Template Details
  category    String   // Fashion, Tech, Food, Travel, etc.
  budget      Decimal  @db.Decimal(10, 2)
  duration    Int      // Days
  
  // Requirements (JSON)
  requirements Json?    // Deliverables, guidelines
  
  // Creator Criteria
  niche       String?  // Target creator niche
  minFollowers Int      @default(0)
  minEngagement Decimal @default(0) @db.Decimal(5, 2)
  
  // Ownership
  brandId     String?
  brand       BrandProfile? @relation(fields: [brandId], references: [id])
  isPublic    Boolean  @default(false) // Public template or brand-only
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("campaign_templates")
}
```

### 2. Create API Routes
- `POST /api/brands/[brandId]/templates` — Create template from campaign
- `GET /api/templates` — List public templates
- `GET /api/brands/[brandId]/templates` — List brand's templates
- `POST /api/campaigns/from-template` — Create campaign from template

### 3. Create UI Components
- `components/campaigns/template-gallery.tsx` — Browse templates
- `components/campaigns/template-form.tsx` — Create/edit template
- Update `campaigns/new/page.tsx` — Add "From Template" option

## ✅ Next Steps
1. Add CampaignTemplate model to Prisma schema
2. Run `npx prisma generate`
3. Create API routes
4. Create UI components
5. Test: Create template → Use template → Create campaign
6. Commit PM-18

## 📊 Success Metrics
- **Template Adoption**: 60% of new campaigns use templates
- **Time Saved**: 15 minutes/campaign (vs building from scratch)
- **Brand Satisfaction**: 4.5/5 stars for template feature
- **Cost Savings**: ₹50/month vs HubSpot
