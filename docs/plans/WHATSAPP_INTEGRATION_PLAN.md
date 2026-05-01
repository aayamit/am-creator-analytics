# WhatsApp Business API Integration Plan (PM-13)

## 🎯 Overview
Integrate **WhatsApp notifications** for:
- **Payment Alerts** (payout sent to creator)
- **Campaign Updates** (new campaign, status change)
- **Verification OTP** (whatsApp-based login)
- **Invoice Sharing** (send GST invoice via WhatsApp)

## 💰 Cost Comparison
| Solution | Cost | Notes |
|----------|------|-------|
| **Twilio WhatsApp** | ₹1.5/message | Pay per message |
| **Meta Business API** | Free (approval needed) | Complex setup |
| **WhatsApp Gateway (Self-hosted)** | ₹0 | Use Android phone + WA gateway |
| **Our Approach: WhatsApp Web Scraper (Open-source)** | ₹0 | Use `whatsapp-web.js` library |

## 🛠️ Open-Source Stack
- **whatsapp-web.js** (npm package): Control WhatsApp Web via headless browser
- **QR Code Auth**: Scan QR to link WhatsApp Web
- **Self-hosted**: Run on same server as AM Creator Analytics

## 🎨 Bloomberg × McKinsey Design
- **WhatsApp Button**: Green (#25D366) with WhatsApp icon
- **Message Preview**: Minimalist card with message text
- **Status Indicator**: Green dot (connected), Red dot (disconnected)

## 📋 Implementation Steps

### 1. Install whatsapp-web.js
```bash
cd /home/awcreator/workspace/am-creator-analytics
npm install whatsapp-web.js
npm install qrcode-terminal # To display QR in terminal
```

### 2. Create WhatsApp Service (lib/whatsapp-service.ts)
```typescript
import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

let client: Client | null = null;
let isReady = false;

export function initWhatsApp() {
  if (client) return;

  client = new Client({
    authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  });

  client.on('qr', (qr) => {
    console.log('Scan this QR code with WhatsApp:');
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', () => {
    console.log('WhatsApp client is ready!');
    isReady = true;
  });

  client.on('disconnected', () => {
    console.log('WhatsApp disconnected');
    isReady = false;
  });

  client.initialize();
}

export async function sendWhatsAppMessage(to: string, message: string) {
  if (!client || !isReady) {
    throw new Error('WhatsApp client not ready');
  }

  // Format: "919876543210" (country code + number, no +)
  const chatId = to.includes('@c.us') ? to : `${to}@c.us`;
  
  try {
    await client.sendMessage(chatId, message);
    return { success: true };
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return { success: false, error };
  }
}

export async function sendInvoicePDF(to: string, pdfBuffer: Buffer, invoiceNumber: string) {
  if (!client || !isReady) {
    throw new Error('WhatsApp client not ready');
  }

  const chatId = to.includes('@c.us') ? to : `${to}@c.us`;
  
  try {
    await client.sendMessage(chatId, `📄 Invoice ${invoiceNumber} attached:`);
    await client.sendMessage(chatId, {
      body: pdfBuffer,
      filename: `invoice-${invoiceNumber}.pdf`,
      mimetype: 'application/pdf',
    });
    return { success: true };
  } catch (error) {
    console.error('WhatsApp PDF send error:', error);
    return { success: false, error };
  }
}
```

### 3. Create WhatsApp API Routes
```typescript
// app/api/whatsapp/send/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sendWhatsAppMessage } from "@/lib/whatsapp-service";

export async function POST(request: NextRequest) {
  try {
    const { to, message } = await request.json();

    if (!to || !message) {
      return NextResponse.json(
        { error: "to and message are required" },
        { status: 400 }
      );
    }

    const result = await sendWhatsAppMessage(to, message);

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("WhatsApp send error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

```typescript
// app/api/whatsapp/status/route.ts
import { NextResponse } from "next/server";
import { isReady } from "@/lib/whatsapp-service";

export async function GET() {
  return NextResponse.json({ ready: isReady });
}
```

### 4. Create WhatsApp UI Component (components/whatsapp-status.tsx)
```tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, CheckCircle, XCircle } from 'lucide-react';

export default function WhatsAppStatus() {
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/whatsapp/status')
      .then(res => res.json())
      .then(data => {
        setIsReady(data.ready);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Card style={{ maxWidth: '400px', margin: '20px auto' }}>
      <CardHeader>
        <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageCircle style={{ color: '#25D366' }} />
          WhatsApp Business
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isReady ? (
            <>
              <CheckCircle style={{ color: '#16a34a' }} />
              <span style={{ color: '#16a34a' }}>Connected</span>
            </>
          ) : (
            <>
              <XCircle style={{ color: '#dc2626' }} />
              <span style={{ color: '#dc2626' }}>Disconnected</span>
            </>
          )}
        </div>
        {!isReady && (
          <p style={{ marginTop: '12px', fontSize: '14px', color: '#6b7280' }}>
            Run `npm run whatsapp:init` to connect your WhatsApp.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
```

### 5. Add WhatsApp Notify to Payment Flow
```typescript
// In app/api/webhooks/opensign/route.ts (after payout sent)
import { sendWhatsAppMessage } from "@/lib/whatsapp-service";

// After successful payout:
await sendWhatsAppMessage(
  creatorPhone, // e.g., "919876543210"
  `🎉 Payout of ₹${amount} sent to your account!\nCampaign: ${campaignName}\nTransaction ID: ${txnId}`
);
```

### 6. Add Scripts to package.json
```json
{
  "scripts": {
    "whatsapp:init": "ts-node scripts/init-whatsapp.ts",
    "whatsapp:server": "node server/whatsapp-server.js"
  }
}
```

## ✅ Next Steps
1. Install `whatsapp-web.js` + `qrcode-terminal`
2. Create `lib/whatsapp-service.ts`
3. Create API routes (`/api/whatsapp/send`, `/api/whatsapp/status`)
4. Create `components/whatsapp-status.tsx`
5. Add "Notify via WhatsApp" button to payout pages
6. Test by sending a message to your own number
7. Add invoice PDF sharing via WhatsApp

## 📊 Success Metrics
- **Adoption**: 50% of creators opt-in to WhatsApp notifications
- **Cost Savings**: ₹0 vs ₹1.5/message (Twilio)
- **Engagement**: 90% open rate (WhatsApp vs 20% email)
- **Time Saved**: Instant notifications vs waiting for email

## 🚨 Important Notes
- **whatsapp-web.js** uses headless Chrome — needs ~500MB RAM
- **QR Code Auth**: Scan once, then it persists in `.wwebjs_auth/`
- **Meta Limits**: Unofficial WhatsApp Web API — respect rate limits (avoid spam)
- **Production**: Consider Meta Business API for high volume (free but approval needed)
