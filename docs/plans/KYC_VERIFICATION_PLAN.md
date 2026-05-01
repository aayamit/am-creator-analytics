# Creator Verification & KYC Plan (PM-10)

## 🎯 Overview
Build **creator identity + bank verification** system:
- **ID Document Upload** (Aadhaar, PAN, Passport)
- **Bank Account Verification** (UPI, Bank details)
- **Video Selfie Verification** (liveness check)
- **Background Check** (optional, for premium brands)

## 📦 Open-Source Stack
- **MinIO**: Document storage (self-hosted S3)
- **Tesseract.js**: OCR for ID documents (MIT)
- **JIMP**: Image processing (MIT)
- **Bank API**: Razorpay/Stripe verification (API-only)

## 💰 Cost Savings
- **Stripe Identity**: $1.50/verification
- **Persona**: $1.00/verification
- **Our Approach**: $0 (self-hosted + OCR)

## 🛠️ Implementation Steps

### 1. Add Verification Models to Prisma
```prisma
model CreatorVerification {
  id             String   @id @default(cuid())
  creatorId     String   @unique
  creator       Creator  @relation(fields: [creatorId], references: [id])
  
  // ID Documents
  idType         String   // AADHAAR, PAN, PASSPORT
  idNumber       String   // Encrypted/masked
  idFrontUrl    String   // MinIO URL
  idBackUrl     String?  // For PAN/Aadhaar
  idVerified    Boolean  @default(false)
  
  // Bank Details
  bankName       String?
  accountNumber  String?  // Encrypted
  ifscCode       String?
  upiId          String?
  bankVerified   Boolean  @default(false)
  
  // Video Selfie
  videoUrl       String?  // MinIO URL
  videoVerified  Boolean  @default(false)
  
  // Status
  status         VerificationStatus @default(PENDING)
  verifiedAt     DateTime?
  notes          String?
  
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@map("creator_verification")
}

enum VerificationStatus {
  PENDING
  IN_REVIEW
  APPROVED
  REJECTED
}
```

### 2. Create Verification API Routes
```typescript
// app/api/creators/[id]/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { putObject } from "@/lib/minio";

export async function POST(request: NextRequest, { params }) {
  const { id } = params;
  const formData = await request.formData();
  
  // ID Document
  const idType = formData.get("idType") as string;
  const idNumber = formData.get("idNumber") as string;
  const idFront = formData.get("idFront") as File;
  const idBack = formData.get("idBack") as File | null;
  
  // Upload to MinIO
  const frontBuffer = Buffer.from(await idFront.arrayBuffer());
  const frontUrl = await putObject(`verification/${id}/id-front-${Date.now()}`, frontBuffer, idFront.type);
  
  let backUrl: string | null = null;
  if (idBack) {
    const backBuffer = Buffer.from(await idBack.arrayBuffer());
    backUrl = await putObject(`verification/${id}/id-back-${Date.now()}`, backBuffer, idBack.type);
  }
  
  // Save to DB
  const verification = await prisma.creatorVerification.upsert({
    where: { creatorId: id },
    update: {
      idType,
      idNumber: maskIdNumber(idNumber),
      idFrontUrl: frontUrl,
      idBackUrl: backUrl,
      status: "IN_REVIEW",
    },
    create: {
      creatorId: id,
      idType,
      idNumber: maskIdNumber(idNumber),
      idFrontUrl: frontUrl,
      idBackUrl: backUrl,
      status: "IN_REVIEW",
    },
  });
  
  return NextResponse.json(verification);
}

// Mask ID number (show last 4 digits)
function maskIdNumber(num: string): string {
  if (num.length <= 4) return num;
  return "X".repeat(num.length - 4) + num.slice(-4);
}
```

### 3. Create Verification Page (UI)
```tsx
// app/[tenantId]/dashboard/creators/[id]/verification/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function VerificationPage({ params }) {
  const { id } = params;
  
  return (
    <div>
      <h1>Creator Verification</h1>
      
      {/* ID Document Upload */}
      <Card>
        <CardHeader>
          <CardTitle>ID Document</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Document Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select ID type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AADHAAR">Aadhaar Card</SelectItem>
                <SelectItem value="PAN">PAN Card</SelectItem>
                <SelectItem value="PASSPORT">Passport</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div style={{ marginTop: '16px' }}>
            <Label>ID Number</Label>
            <Input placeholder="Enter ID number" />
          </div>
          
          <div style={{ marginTop: '16px' }}>
            <Label>Front Image</Label>
            <Input type="file" accept="image/*" />
          </div>
          
          <div style={{ marginTop: '16px' }}>
            <Label>Back Image (optional)</Label>
            <Input type="file" accept="image/*" />
          </div>
        </CardContent>
      </Card>
      
      {/* Bank Details */}
      <Card style={{ marginTop: '24px' }}>
        <CardHeader>
          <CardTitle>Bank Account</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Bank form fields */}
        </CardContent>
      </Card>
      
      <Button style={{ marginTop: '24px' }}>
        Submit for Verification
      </Button>
    </div>
  );
}
```

## ✅ Next Steps
1. Add `CreatorVerification` model to Prisma schema
2. Run `npx prisma migrate`
3. Create `app/api/creators/[id]/verify/route.ts`
4. Build `app/[tenantId]/dashboard/creators/[id]/verification/page.tsx`
5. Create MinIO bucket for verification docs
6. Add verification status badges to creator list

## 🎨 Bloomberg × McKinsey Design
- **Status badges**: Green (APPROVED), Yellow (PENDING), Red (REJECTED)
- **Document thumbnails**: Grid view with zoom
- **Progress stepper**: ID → Bank → Video → Complete
- **Security notice**: "Documents encrypted at rest"
