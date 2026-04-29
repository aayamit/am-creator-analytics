# Email Notification System

## ✉️ Overview
Integrate email notifications using **Resend** (has free tier) + **React Email** for beautiful templates.

## 🚀 Quick Setup

### 1. Resend API Key
Already in `.env.example`:
```
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM=AM Creator Analytics <noreply@amcreatoranalytics.com>
```

### 2. Email Templates (React Email)
Create in `emails/` directory:
- `welcome.tsx` - Welcome email for new users
- `contract-signed.tsx` - Contract signing notification
- `payout-sent.tsx` - Payout confirmation
- `campaign-invite.tsx` - Campaign invitation

### 3. Integration Points
Update `lib/notification.ts` to send emails when creating notifications.

## 📧 Email Templates to Build

1. **Welcome Email** (`emails/welcome.tsx`)
   - Personalized greeting
   - Quick start guide
   - Links to dashboard

2. **Contract Signed** (`emails/contract-signed.tsx`)
   - Contract details
   - Signing bonus (₹1,500)
   - Next steps

3. **Payout Sent** (`emails/payout-sent.tsx`)
   - Amount
   - Payment method
   - Transaction ID

4. **Campaign Invite** (`emails/campaign-invite.tsx`)
   - Campaign details
   - Creator list
   - Accept/Reject links

## 💰 Cost
- **Resend**: FREE for 3,000 emails/month
- **SendGrid**: ₹8K/month for same volume
- **Savings**: **₹8K/month**

## 🔗 Integration
Update `lib/notification.ts`:
```typescript
import { sendEmail } from '@/lib/email';

export async function createNotification(params) {
  // ... existing code ...
  
  // Send email
  if (shouldSendEmail(params.type)) {
    await sendEmail({
      to: user.email,
      template: getTemplateForType(params.type),
      data: params,
    });
  }
}
```
