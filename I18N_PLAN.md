# Internationalization Plan (PM-26)

## 🎯 Overview
Add **multi-language support** for Indian market:
- **Languages**: English, Hindi (हिंदी), Tamil (தமிழ்), Telugu (తెలుగు), Bengali (বাংলা)
- **Next.js i18n**: Built-in support (no extra deps)
- **Translation Files**: JSON files in `public/locales/`
- **Locale Switcher**: Dropdown in header

## 📊 Implementation Steps

### 1. Configure Next.js i18n (next.config.ts)
```typescript
// next.config.ts
module.exports = {
  i18n: {
    locales: ['en', 'hi', 'ta', 'te', 'bn'],
    defaultLocale: 'en',
  },
}
```

### 2. Create Translation Files
```
public/
  locales/
    en/
      common.json
      dashboard.json
      campaigns.json
    hi/
      common.json (हिंदी)
      dashboard.json
      campaigns.json
    ta/
      common.json (தமிழ்)
    ...
```

### 3. Create useTranslation Hook
```typescript
// hooks/use-translation.ts
import { useRouter } from 'next/router';

export function useTranslation() {
  const router = useRouter();
  const { locale, pathname, asPath, query } = router;
  
  // Load translation file
  const translations = require(`@/public/locales/${locale}/common.json`);
  
  const t = (key: string) => {
    return translations[key] || key;
  };
  
  return { t, locale };
}
```

### 4. Update Layout (app/layout.tsx)
```typescript
// Add locale to HTML lang attribute
<html lang={params.locale || 'en'}>
```

### 5. Create Locale Switcher Component
```typescript
// components/LocaleSwitcher.tsx
'use client';

import { useRouter } from 'next/navigation';

const locales = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'bn', name: 'বাংলা' },
];

export default function LocaleSwitcher() {
  const router = useRouter();
  
  return (
    <select onChange={(e) => router.push(router.pathname, undefined, { locale: e.target.value })}>
      {locales.map((locale) => (
        <option key={locale.code} value={locale.code}>
          {locale.name}
        </option>
      ))}
    </select>
  );
}
```

### 6. Update Pages to Use Translations
```typescript
// app/[tenantId]/dashboard/page.tsx
import { useTranslation } from '@/hooks/use-translation';

export default function DashboardPage() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('dashboard')}</h1>
      <p>{t('welcome_message')}</p>
    </div>
  );
}
```

## ✅ Next Steps
1. Update `next.config.ts` with i18n config
2. Create `public/locales/` directory structure
3. Create translation JSON files (start with English)
4. Create `useTranslation` hook
5. Create `LocaleSwitcher` component
6. Update layout to pass locale
7. Add locale switcher to header
8. Test: Switch between languages
9. Commit PM-26

## 💰 Cost Savings
- **i18n Platform**: Next.js built-in (free) vs Lokalise ($24/month)
- **Translation**: Manual (free) vs Google Translate API ($20/1M chars)

**Savings**: ~₹40,000/year
