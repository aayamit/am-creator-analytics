# Two-Factor Authentication Plan (PM-23)

## 🎯 Overview
Add **2FA security** for admin/brand accounts:
- **TOTP (Time-based One-Time Password)**: Google Authenticator, Authy, 1Password
- **QR Code Setup**: Scan to add account to authenticator app
- **Backup Codes**: 10 single-use codes for recovery
- **Enforce 2FA**: Option to require 2FA for admin roles

## 📊 2FA Implementation

### 1. Add 2FA Fields to User Model (Prisma)
```prisma
model User {
  // ... existing fields
  
  twoFactorEnabled Boolean @default(false)
  twoFactorSecret  String?  // Encrypted TOTP secret
  backupCodes      String?  // JSON array of hashed backup codes
  
  @@map('users')
}
```

### 2. Install Dependencies
```bash
npm install speakeasy qrcode
npm install -D @types/qrcode
```

### 3. Create 2FA API Routes
- **POST /api/auth/2fa/setup** — Generate secret + QR code
- **POST /api/auth/2fa/verify** — Verify TOTP token during setup
- **POST /api/auth/2fa/enable** — Enable 2FA for user
- **POST /api/auth/2fa/disable** — Disable 2FA (requires password + token)
- **POST /api/auth/2fa/backup-verify** — Verify backup code (for login)

### 4. Create 2FA Setup UI
- **/settings/security** — 2FA settings page
  - "Enable 2FA" button
  - Shows QR code + manual secret
  - Input to verify TOTP token
  - List of backup codes (shown once!)
  - "Disable 2FA" button

### 5. Modify Login Flow
- After password verification, check if 2FA is enabled
- If enabled, redirect to 2FA verification page
- Accept TOTP token OR backup code

### 6. Security Considerations
- **Encrypt 2FA secret** in database (use `crypto` module)
- **Rate limit** 2FA attempts (max 5 per 15 minutes)
- **Audit log** all 2FA events (enable, disable, login)
- **Backup codes** are single-use, regenerated after use

## ✅ Next Steps
1. Install `speakeasy` and `qrcode`
2. Add 2FA fields to User model
3. Create API routes for 2FA setup/verify
4. Create 2FA setup UI component
5. Modify login flow to check 2FA
6. Test: Setup 2FA, login with TOTP
7. Commit PM-23

## 💰 Cost Savings
- **2FA Service**: speakeasy (free, open-source) vs Auth0 Guardian ($0.02/request)
- **SMS 2FA**: Avoid (₹0.50/SMS) vs TOTP (free)

**Savings**: ~₹50,000/month (if using SMS) or just better security (TOTP)
