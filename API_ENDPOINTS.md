# AM Creator Analytics - API Endpoints (Phase 2)

All endpoints follow RESTful conventions. Authentication uses NextAuth.js session tokens. Role-based access control (RBAC) enforced per endpoint.

---

## 1. Authentication Endpoints
| Method | Path | Description | Auth Required | Allowed Roles |
|--------|------|-------------|---------------|---------------|
| GET/POST | `/api/auth/[...nextauth]` | NextAuth.js handler (signin, signout, session) | No | All |

---

## 2. Creator Endpoints
| Method | Path | Description | Auth Required | Allowed Roles |
|--------|------|-------------|---------------|---------------|
| GET | `/api/creators` | List creators (filter by niche, demographics, platform) | Yes | BRAND only |
| GET | `/api/creators/:id` | Get creator profile by ID | Yes | BRAND, CREATOR (own profile) |
| PUT | `/api/creators/:id` | Update creator profile | Yes | CREATOR (own profile) |
| GET | `/api/creators/:id/analytics` | Get creator analytics (90d, 6m, 1yr trends) | Yes | CREATOR (own), BRAND (with permission) |
| POST | `/api/creators/:id/social-accounts` | Connect OAuth social account (YouTube, LinkedIn, etc.) | Yes | CREATOR (own) |
| DELETE | `/api/creators/:id/social-accounts/:platform` | Disconnect social account | Yes | CREATOR (own) |
| GET | `/api/creators/:id/media-kit` | Get dynamic media kit | Conditional | Public if `isPublic=true`, else CREATOR (own) or BRAND (with permission) |
| PUT | `/api/creators/:id/media-kit` | Update media kit settings | Yes | CREATOR (own) |

---

## 3. Brand Endpoints
| Method | Path | Description | Auth Required | Allowed Roles |
|--------|------|-------------|---------------|---------------|
| GET | `/api/brands` | List brands (admin only) | Yes | ADMIN only |
| GET | `/api/brands/:id` | Get brand profile by ID | Yes | BRAND (own), ADMIN |
| PUT | `/api/brands/:id` | Update brand profile | Yes | BRAND (own) |
| GET | `/api/brands/:id/campaigns` | List brand's campaigns | Yes | BRAND (own), ADMIN |

---

## 4. Campaign Endpoints
| Method | Path | Description | Auth Required | Allowed Roles |
|--------|------|-------------|---------------|---------------|
| POST | `/api/campaigns` | Create new campaign | Yes | BRAND only |
| GET | `/api/campaigns` | List campaigns (filter by status, date) | Yes | BRAND (own), CREATOR (invited), ADMIN |
| GET | `/api/campaigns/:id` | Get campaign details | Yes | BRAND (owner), CREATOR (invited) |
| PUT | `/api/campaigns/:id` | Update campaign (budget, dates, status) | Yes | BRAND (owner) |
| POST | `/api/campaigns/:id/invite` | Invite creator to campaign | Yes | BRAND (owner) |
| GET | `/api/campaigns/:id/creators` | List campaign creators | Yes | BRAND (owner), CREATOR (invited) |
| POST | `/api/campaigns/:id/creators/:creatorId` | Add creator to campaign | Yes | BRAND (owner) |
| DELETE | `/api/campaigns/:id/creators/:creatorId` | Remove creator from campaign | Yes | BRAND (owner) |

---

## 5. Analytics Endpoints
| Method | Path | Description | Auth Required | Allowed Roles |
|--------|------|-------------|---------------|---------------|
| GET | `/api/analytics/creator/:id` | Get creator cross-platform analytics | Yes | CREATOR (own), BRAND (with permission) |
| GET | `/api/analytics/campaign/:id` | Get campaign performance (ROI, CPV, conversions) | Yes | BRAND (owner), CREATOR (invited) |
| GET | `/api/analytics/audience/:id` | Get audience demographics breakdown | Yes | CREATOR (own), BRAND (with permission) |

---

## 6. Media Kit Endpoints
| Method | Path | Description | Auth Required | Allowed Roles |
|--------|------|-------------|---------------|---------------|
| GET | `/api/media-kits/:slug` | Get public media kit by slug | No (public) | All |
| PUT | `/api/media-kits/:id` | Update media kit content/settings | Yes | CREATOR (own) |

---

## 7. Invoice/Payment Endpoints
| Method | Path | Description | Auth Required | Allowed Roles |
|--------|------|-------------|---------------|---------------|
| GET | `/api/invoices/:id` | Get invoice details | Yes | BRAND/CREATOR (related to campaign) |
| PUT | `/api/invoices/:id` | Update invoice status (mark as paid) | Yes | BRAND (owner) |
| GET | `/api/invoices/campaign/:id` | List campaign invoices | Yes | BRAND (owner), CREATOR (invited) |

---

## 8. Webhook Endpoints (Public, verify signature)
| Method | Path | Description | Auth Required | Allowed Roles |
|--------|------|-------------|---------------|---------------|
| POST | `/api/webhooks/youtube` | YouTube Data API push notifications | No (signature verified) | System |
| POST | `/api/webhooks/meta` | Meta Graph API webhooks (IG/FB) | No (signature verified) | System |
| POST | `/api/webhooks/tiktok` | TikTok for Business webhooks | No (signature verified) | System |

---

## 9. Audit Log Endpoints (Admin Only)
| Method | Path | Description | Auth Required | Allowed Roles |
|--------|------|-------------|---------------|---------------|
| GET | `/api/audit-logs` | List all audit logs (filter by user, action, date) | Yes | ADMIN only |
| GET | `/api/audit-logs/user/:id` | Get audit logs for specific user | Yes | ADMIN only |

---

## Query Parameters (Common Filters)
- `?niche=tech,finance` - Filter by creator niche
- `?platform=youtube,linkedin` - Filter by connected platforms
- `?min_followers=10000` - Minimum follower count
- `?start_date=2026-01-01&end_date=2026-04-01` - Date range filters
- `?status=active` - Filter by campaign status
- `?page=1&limit=20` - Pagination
