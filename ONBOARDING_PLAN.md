# Advanced Creator Onboarding Plan (PM-5)

## 🎯 Overview
Build a **multi-step onboarding wizard** with video intros:
- **Step 1**: Welcome + Video intro (self-hosted)
- **Step 2**: Profile setup (social handles, niche)
- **Step 3**: Audience demographics (age, location, interests)
- **Step 4**: Portfolio walkthrough (past campaigns)
- **Step 5**: Verification (identity + bank details)
- **Step 6**: Welcome bonus + first campaign suggestion

## 📹 Video Integration (Self-Hosted)
- Host videos on **MinIO** (saves vs Vimeo/Wistia)
- Use **HTML5 `<video>`** or **react-player** (open-source)
- Formats: MP4 (H.264), WebM (VP9)
- Thumbnails generated via **FFmpeg** (server-side)

## 💰 Cost Savings
- **Vimeo Pro**: $75/month
- **Wistia**: $99/month
- **Our Approach**: $0 (MinIO + react-player)

## 🎨 Bloomberg × McKinsey Design
- **Progress bar**: Navy (#1a1a2e) with cream (#F8F7F4) background
- **Step indicators**: Numbered circles with checkmarks
- **Video player**: Custom controls with brand colors
- **Form fields**: Minimalist, large touch targets

## 🛠️ Implementation Steps

### 1. Install Dependencies
```bash
npm install react-player
```

### 2. Create Onboarding Wizard Component
```tsx
// components/onboarding/creator-wizard.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Welcome', video: '/videos/onboarding/welcome.mp4' },
  { id: 2, title: 'Profile', video: '/videos/onboarding/profile.mp4' },
  { id: 3, title: 'Audience', video: '/videos/onboarding/audience.mp4' },
  { id: 4, title: 'Portfolio', video: '/videos/onboarding/portfolio.mp4' },
  { id: 5, title: 'Verification', video: '/videos/onboarding/verification.mp4' },
  { id: 6, title: 'Complete!', video: null },
];

export default function CreatorOnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const progress = (completedSteps.length / STEPS.length) * 100;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px' }}>
      {/* Progress Bar */}
      <div style={{ marginBottom: '32px' }}>
        <Progress value={progress} style={{ height: '8px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          {STEPS.map((step) => (
            <div key={step.id} style={{ textAlign: 'center' }}>
              {completedSteps.includes(step.id) ? (
                <CheckCircle size={20} style={{ color: '#16a34a' }} />
              ) : (
                <Circle size={20} style={{ color: '#e5e7eb' }} />
              )}
              <p style={{ fontSize: '12px', color: '#92400e', margin: '4px 0 0 0' }}>
                {step.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <Card style={{ backgroundColor: '#FFFFFF', border: '1px solid #e5e7eb' }}>
        <CardHeader>
          <CardTitle style={{ color: '#1a1a2e' }}>
            {STEPS[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Video (if available) */}
          {STEPS[currentStep - 1].video && (
            <div style={{ marginBottom: '24px' }}>
              <video
                controls
                width="100%"
                style={{ borderRadius: '8px' }}
              >
                <source src={STEPS[currentStep - 1].video} type="video/mp4" />
              </video>
            </div>
          )}

          {/* Form fields would go here */}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
            <Button
              disabled={currentStep === 1}
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Back
            </Button>
            <Button
              onClick={() => {
                setCompletedSteps([...completedSteps, currentStep]);
                setCurrentStep(Math.min(currentStep + 1, STEPS.length));
              }}
            >
              {currentStep === STEPS.length ? 'Finish' : 'Continue'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 3. Create API Route for Onboarding Progress
```typescript
// app/api/onboarding/progress/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const { userId, step, completed } = await request.json();

  const progress = await prisma.onboardingProgress.upsert({
    where: { userId },
    update: {
      step,
      completedSteps: completed,
      updatedAt: new Date(),
    },
    create: {
      userId,
      step,
      completedSteps: completed,
    },
  });

  return NextResponse.json(progress);
}
```

### 4. Add OnboardingProgress Model to Prisma
```prisma
model OnboardingProgress {
  id             String   @id @default(cuid())
  userId         String   @unique
  user           User     @relation(fields: [userId], references: [id])
  step           Int      @default(1)
  completedSteps Int[]
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@map("onboarding_progress")
}
```

## ✅ Next Steps
1. Install react-player
2. Create onboarding wizard component
3. Add Prisma model for progress tracking
4. Create API routes for progress persistence
5. Integrate into signup flow
6. Host sample onboarding videos on MinIO