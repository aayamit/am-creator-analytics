# Mobile App Plan (React Native + Expo)

## 📱 Overview
Build a React Native mobile app for creators to:
- Check earnings on-the-go
- Accept/reject campaign invites
- Upload content (photos/videos)
- Receive push notifications
- Biometric login (FaceID/Fingerprint)

**Competitive advantage** — most competitors are web-only.

## 🚀 Quick Setup

### 1. Initialize Expo Project
```bash
npx create-expo-app@latest am-creator-mobile
cd am-creator-mobile
npx expo install expo-router react-native-safe-area-context
```

### 2. Key Dependencies
```bash
npx expo install \
  @react-navigation/native \
  @react-navigation/bottom-tabs \
  expo-notifications \
  expo-local-authentication \
  react-native-mmkv \
  react-query
```

### 3. Project Structure
```
am-creator-mobile/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Dashboard
│   │   ├── campaigns.tsx     # Campaigns
│   │   ├── earnings.tsx      # Earnings
│   │   └── profile.tsx      # Profile
│   ├── auth/
│   │   ├── login.tsx
│   │   └── biometric.tsx
│   └── _layout.tsx
├── components/
│   ├── EarningsCard.tsx
│   ├── CampaignCard.tsx
│   └── NotificationBell.tsx
├── lib/
│   ├── api.ts               # API client
│   └── storage.ts           # MMKV storage
└── app.json
```

## 📱 Features to Build

### Phase 1: Auth & Dashboard
1. **Login Screen** (`app/auth/login.tsx`)
   - Email + password
   - Biometric login (FaceID/Fingerprint)
   - Deep linking from web

2. **Dashboard** (`app/(tabs)/index.tsx`)
   - Total earnings
   - Active campaigns
   - Recent notifications

### Phase 2: Campaigns & Earnings
3. **Campaigns List** (`app/(tabs)/campaigns.tsx`)
   - Browse available campaigns
   - Accept/reject invites
   - View details

4. **Earnings** (`app/(tabs)/earnings.tsx`)
   - Earnings history
   - Payout status
   - Stripe Connect setup

### Phase 3: Content & Notifications
5. **Upload Content** (`app/(tabs)/upload.tsx`)
   - Photo/video upload
   - Camera integration
   - Progress tracking

6. **Push Notifications**
   - Campaign invites
   - Payout confirmation
   - Contract ready

## 🎨 Design
- **Same Bloomberg × McKinsey aesthetics** as web
- Colors: `#F8F7F4` (bg), `#1a1a2e` (primary), `#92400e` (accent)
- Typography: Inter (same as web)

## 🔗 Integration with Web
- **Shared API**: Same Next.js backend
- **Shared Auth**: NextAuth.js sessions
- **Shared Notifications**: SSE stream works on mobile too

## 💰 Cost
- **All open-source** (Expo, React Native)
- **Saves ₹25K/month** vs buying a custom app

## 🚀 Build Order
1. **Initialize Expo project**
2. **Login + Biometric auth**
3. **Dashboard screen**
4. **Campaigns screen**
5. **Earnings screen**
6. **Push notifications**
7. **Content upload**

## 📊 Expected Impact
- **User Engagement**: +40% (push notifications)
- **Competitive Advantage**: Only platform with mobile app
- **Premium Justification**: Elite plan includes mobile access
