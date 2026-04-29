# Multi-language Support (i18n) Plan

## 🌐 Overview
Add **i18n (internationalization)** to support Indian languages:
- **Hindi** (हिन्दी) — 528M speakers
- **Tamil** (தமிழ்) — 78M speakers
- **Telugu** (తెలుగు) — 83M speakers
- **Bengali** (বাংলা) — 97M speakers
- **English** — 129M speakers (current)

**Impact**: Reach 70% more creators who prefer local languages!

## 🚀 Quick Setup

### 1. Install next-i18next
```bash
npm install next-i18next
npm install -D @types/i18next
```

### 2. Configure i18n
```typescript
// next-i18next.config.js
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'hi', 'ta', 'te', 'bn'],
    localeDetection: true,
  },
};
```

### 3. Update next.config.ts
```typescript
const nextConfig = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'hi', 'ta', 'te', 'bn'],
  },
  // ... rest of config
};
```

## 📁 Translation Files Structure
```
public/locales/
├── en/
│   ├── common.json
│   ├── dashboard.json
│   ├── campaigns.json
│   └── auth.json
├── hi/
│   ├── common.json
│   ├── dashboard.json
│   ├── campaigns.json
│   └── auth.json
├── ta/
│   └── ...
├── te/
│   └── ...
└── bn/
    └── ...
```

## 📝 Example Translation File

### `public/locales/en/common.json`
```json
{
  "welcome": "Welcome to AM Creator Analytics",
  "dashboard": "Dashboard",
  "campaigns": "Campaigns",
  "creators": "Creators",
  "settings": "Settings",
  "signOut": "Sign Out"
}
```

### `public/locales/hi/common.json`
```json
{
  "welcome": "AM क्रिएटर एनालिटिक्स में आपका स्वागत है",
  "dashboard": "डैशबोर्ड",
  "campaigns": "कैंपेन",
  "creators": "क्रिएटर्स",
  "settings": "सेटिंग्स",
  "signOut": "साइन आउट"
}
```

## 🧩 Use in Components

### Server Components (App Router)
```typescript
// app/[locale]/dashboard/page.tsx
import { serverSideTranslations } from 'next-i18next/server-side-translations';
import { useTranslation } from 'next-i18next';

export default function Dashboard({ params: { locale } }: { params: { locale: string } }) {
  const { t } = useTranslation('common');

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <nav>
        <a href="/dashboard">{t('dashboard')}</a>
        <a href="/campaigns">{t('campaigns')}</a>
      </nav>
    </div>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'dashboard'])),
    },
  };
}
```

### Client Components
```typescript
'use client';

import { useTranslation } from 'next-i18next';

export default function MyComponent() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button onClick={() => changeLanguage('hi')}>हिन्दी</button>
      <button onClick={() => changeLanguage('en')}>English</button>
    </div>
  );
}
```

## 🔗 Language Switcher Component

### `components/i18n/language-switcher.tsx`
```tsx
'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          border: '1px solid #ccc',
          borderRadius: '6px',
          background: 'white',
          cursor: 'pointer',
        }}
      >
        <span>{currentLang.flag}</span>
        <span>{currentLang.name}</span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: '4px',
          background: 'white',
          border: '1px solid #ccc',
          borderRadius: '6px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 1000,
        }}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                width: '100%',
                border: 'none',
                background: lang.code === i18n.language ? '#f0f0f0' : 'white',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

## 📊 Priority Pages for Translation

1. **Dashboard** (highest traffic)
2. **Campaigns** (core feature)
3. **Auth/Login** (first impression)
4. **Settings** (user preferences)
5. **Notifications** (engagement)

## 🚀 Build Order

1. **Install next-i18next**
2. **Configure next.config.ts** (locales)
3. **Create translation files** (en, hi, ta, te, bn)
4. **Add Language Switcher** to sidebar/header
5. **Wrap pages with useTranslation()**
6. **Test language switching**
7. **Add more languages** (Marathi, Gujarati, etc.)

## 🌍 Language Coverage

| Language | Speakers (M) | Priority |
|-----------|---------------|----------|
| English | 129 | ✅ Done |
| Hindi | 528 | 🔥 High |
| Bengali | 97 | 🔥 High |
| Telugu | 83 | 🔥 High |
| Tamil | 78 | 🔥 High |
| Marathi | 83 | Medium |
| Gujarati | 56 | Medium |
| Kannada | 44 | Low |
| Malayalam | 35 | Low |

**Total Reach**: 1.1+ Billion people (vs 129M with English only)

## 💰 Investment vs Return

- **Cost**: 0₹ (open-source, just translation files)
- **Time**: 2-3 days for initial 5 languages
- **Return**: 70% more creators can use platform
- **Revenue Impact**: +₹50K-1L/month (more signups)

## 📈 SEO Benefits

- **Hreflang tags** (search engines love this)
- **Local language search** (Google Hindi search, etc.)
- **Better rankings** in regional India

---

**Ready to translate? Say "translate now" and I'll start building!** 🌐
