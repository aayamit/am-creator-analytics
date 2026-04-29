# Testing Suite Setup

## 🧪 Overview
Add comprehensive testing to AM Creator Analytics using open-source tools:
- **Jest** - Unit testing
- **React Testing Library** - Component testing
- **Playwright** - E2E testing

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
npm install -D @playwright/test
npx playwright install
```

### 2. Jest Configuration
Create `jest.config.ts`:
```typescript
import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterSetup: ['<rootDir>/jest.setup.ts'],
};

export default config;
```

### 3. Test Structure
```
__tests__/
├── unit/
│   ├── lib/
│   │   ├── minio.test.ts
│   │   ├── stripe-connect.test.ts
│   │   └── nango.test.ts
│   └── utils/
│       └── format.test.ts
├── integration/
│   ├── api/
│   │   ├── contracts.test.ts
│   │   ├── upload.test.ts
│   │   └── payouts.test.ts
│   └── pages/
│       ├── dashboard.test.tsx
│       └── auth.test.tsx
└── e2e/
    ├── auth.spec.ts
    ├── contract-creation.spec.ts
    └── payout-flow.spec.ts
```

## 📝 Tests to Write

### Priority 1: Critical Paths
1. **Contract Creation Flow**
   - Create contract API
   - OpenSign integration
   - Webhook handling

2. **Payout Flow**
   - Stripe Connect onboarding
   - ₹1,500 bonus payout
   - Webhook verification

3. **File Upload**
   - MinIO upload
   - File type validation
   - Size limits

### Priority 2: Components
1. **Dashboard Pages**
   - Render without crashing
   - Display correct data
   - Handle loading states

2. **Forms**
   - Campaign creation
   - Contract sending
   - File uploads

## 🎯 Coverage Targets
- **API Routes**: 80% coverage
- **Critical Components**: 90% coverage
- **Utility Functions**: 100% coverage

## 💰 Cost
- **All open-source** (Jest, RTL, Playwright)
- **Saves ₹15K/month** vs Cypress Cloud
