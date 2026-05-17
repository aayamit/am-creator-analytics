# AM Creator Analytics - Work Log

## 2026-05-17 - Mac Mini Recovery, Git Sync, and `www` Routing Investigation

### Summary
Recovered the Mac Mini preview deployment after the restart, rebuilt the production app, restored the app database path, pushed a clean code-only GitHub sync from the writable clone, and fixed the remaining public `www` hostname issue in the Cloudflare tunnel dashboard.

### Completed Tasks
- [x] Confirm Docker production stack health on the Mac Mini
- [x] Rebuild the production app image after fixing the marketing page build issue
- [x] Restore Prisma to read `DATABASE_URL` from environment configuration
- [x] Point the app at the dedicated application database through a local-only compose override
- [x] Push Prisma schema into the app database
- [x] Verify `https://amcreatoranalytics.com` responds successfully
- [x] Verify `/api/health` responds successfully through the public domain
- [x] Push clean code-only GitHub sync from writable clone (`99c11f5`)
- [x] Confirm local origin and nginx both support `www.amcreatoranalytics.com`
- [x] Confirm public `www` still fails at Cloudflare with `404`
- [x] Add missing `www.amcreatoranalytics.com` published application route in Cloudflare tunnel `amcamacmini`
- [x] Verify `https://www.amcreatoranalytics.com` loads successfully after the route fix
- [x] Verify `https://www.amcreatoranalytics.com/api/health` returns healthy JSON after the route fix

### Current Public State
| URL | Result |
|-----|--------|
| `https://amcreatoranalytics.com` | ✅ Redirects to `/marketing` |
| `https://www.amcreatoranalytics.com` | ✅ Loads successfully |
| `https://amcreatoranalytics.com/api/health` | ✅ Healthy |
| `https://www.amcreatoranalytics.com/api/health` | ✅ Healthy |

### Key Findings
- The `www` problem is not caused by the Next.js app or nginx.
- Local nginx is configured for both apex and `www`.
- Local cloudflared config files also include both hostnames.
- Root cause was the live Cloudflare tunnel having only one published application route for the apex hostname.
- The issue was resolved by adding the missing `www.amcreatoranalytics.com -> http://localhost:3000` published application route in the Cloudflare dashboard.

### Important File Paths
- Live project repo: `/Volumes/DA/am-creator-analytics`
- Writable clean clone: `/Users/amit/Documents/Codex/2026-05-16/important-when-working-on-this-project/am-creator-analytics-clean`
- Next-session context file: `/Users/amit/Documents/Codex/2026-05-16/important-when-working-on-this-project/IMPORTANT_NEXT_SESSION_CONTEXT_AM_CREATOR_ANALYTICS.md`

### Next Steps
- [ ] Request write access to `/Volumes/DA/am-creator-analytics` in a future session if persistent live-repo cleanup is needed
- [ ] Normalize the live repo remote on `/Volumes/DA/am-creator-analytics` if it still points at the stale GitHub URL

---

## 2026-05-01 - OpenSign Integration Testing Complete ✅

### Summary
Successfully tested all OpenSign integrations for AM Creator Analytics.

### Completed Tasks
- [x] Mirror OpenSign documentation (140 HTML files archived to `/home/awcreator/opensign_offline_docs/`)
- [x] Get OpenSign API credentials (MASTER_KEY: `XnAadwKxxByMr`)
- [x] Test contract creation via OpenSign API
- [x] Verify webhook endpoint `/api/webhooks/opensign` works
- [x] Test contract status updates (SENT → FULLY_EXECUTED)
- [x] Verify signing bonus logic (₹1,500 for creators with < 50,000 followers)
- [x] Test both scenarios: 
  - ✅ Followers = 50,000 → No bonus (correct)
  - ✅ Followers = 49,999 → Bonus triggered (correct)

### Test Results
| Test Case | Result |
|-----------|--------|
| Contract creation in OpenSign | ✅ (ID: ScE2Xlhy4u) |
| Webhook endpoint response | ✅ ({"success":true}) |
| Contract status update via webhook | ✅ (SENT → FULLY_EXECUTED) |
| Signing bonus trigger (49,999 followers) | ✅ (₹1,500 recorded) |
| Signing bonus skip (50,000 followers) | ✅ (No bonus, correct logic) |

### Environment Variables Updated
- `OPENSIGN_MASTER_KEY=XnAadwKxxByMr` (updated in `.env`)

### API Endpoints Tested
- `POST http://localhost:8081/app/classes/Contract` - Create contract
- `GET http://localhost:8081/app/classes/Contract/:id` - Get contract
- `POST http://localhost:3000/api/webhooks/opensign` - Webhook endpoint

### Database State
- Contract `cmomo8xye0003cpnvrjy45kp6` used for testing
- openSignDocumentId: `ScE2Xlhy4u`
### GitHub Repository Created & Pushed ✅
- **Repo URL:** https://github.com/aayamit/am-creator-analytics
- **Owner:** aayamit (token owner)
- **Branch:** master (pushed successfully)
- **Commit:** 02e7b26

### Next Steps
- [ ] Clean up test data
- [ ] Run full build verification
- [ ] Deploy to staging environment

---

## 2026-05-01 - UI Unification & Server Restart

### Summary
Fixed signup page to match login page exactly (Bloomberg McKinsey executive style), fixed Docker Compose Nango image, restarted all services, verified OpenSign integration.

### Completed Tasks
- [x] Fix signup page UI to match login page (grid background, gradient orb, no hover effects)
- [x] Remove all hover effects from signup page (role selector, buttons)
- [x] Fix docker-compose.yml Nango image (nangohq/nango-server:latest)
- [x] Add Nango environment variables (DB, Redis config)
- [x] Kill all running servers (Docker containers, Next.js)
- [x] Restart all services: PostgreSQL, MongoDB, OpenSign, Nango, Next.js
- [x] Verify OpenSign API key (MASTER_KEY: XnAadwKxxByMr)
- [x] Test OpenSign contract creation (new contract: GB18uoAYuZ)
- [x] Verify webhook endpoint (/api/webhooks/opensign) returns {success:true}
- [x] Build successful after signup page fixes

### Files Modified
- `app/(auth)/signup/page.tsx` - Rewrote to match login page UI exactly
- `docker-compose.yml` - Fixed Nango image, added environment variables

### Test Results
| Test Case | Result |
|-----------|--------|
| Signup page matches login page UI | ✅ (grid background, orb, no hovers) |
| Build after UI fixes | ✅ (npm run build passes) |
| OpenSign contract creation | ✅ (GB18uoAYuZ) |
| Webhook endpoint | ✅ ({success:true}) |
| All Docker services started | ✅ (Postgres, Mongo, OpenSign, Nango) |
| Next.js dev server | ✅ (running on port 3000) |

### Environment Notes
- OpenSign APP_ID: `opensign`
- OpenSign MASTER_KEY: `XnAadwKxxByMr`
- Signing bonus: ₹1,500 for creators with <50k followers

---

## 2026-05-01 - Project Cleanup (Previous Session)

### Summary
Cleaned up deployment files and removed unused files from the repository.

### Removed Files
- `deploy.sh`
- `nginx.conf`
- `next.config.prod.js`
- `start.sh`
- `DIGITALOCEAN_SETUP.md`
- `DEPLOYMENT.md`

### Commits
- Commit hash: `d6b847f` - "cleanup: remove deployment and unused files"

---

## 2026-05-17 - Marketing Shell Fix And Live App Rebuild

### Summary
Fixed the `/marketing` page so it no longer renders duplicate global chrome, increased logo visibility in the navbar, and pushed the change live by rebuilding only the app image and replacing only the `am-creator-app` container.

### Completed Tasks
- [x] Removed duplicate marketing layout shell that was re-rendering `NavBar` and `Footer`
- [x] Removed the extra inline marketing footer from `app/marketing/page.tsx`
- [x] Increased navbar logo frame size and switched it to a cropped responsive presentation for desktop and mobile
- [x] Rebuilt the app image from the clean writable repo copy
- [x] Replaced only the `am-creator-app` container without touching Postgres, Redis, Mongo, Nango, or nginx
- [x] Verified live browser result: `https://www.amcreatoranalytics.com/marketing` now shows `1` nav and `1` footer

### Files Modified
- `app/marketing/layout.tsx`
- `app/marketing/page.tsx`
- `components/NavBar.tsx`

### Deployment Notes
- The first clean-clone `docker compose up -d --build app` attempt failed because shared containers like `am-creator-postgres` already existed under the live stack.
- The first `up -d --no-deps app` attempt also failed because the existing `am-creator-app` container name was still occupied by the live stack.
- Working sequence:
  1. `docker compose -f docker-compose.prod.yml -f docker-compose.prod.local-env.yml --env-file /Volumes/DA/am-creator-analytics/.env.prod build app`
  2. `docker rm -f am-creator-app`
  3. `docker compose -f docker-compose.prod.yml -f docker-compose.prod.local-env.yml --env-file /Volumes/DA/am-creator-analytics/.env.prod up -d --no-deps app`
- This was executed through Docker Desktop's embedded terminal because direct socket access from the sandboxed shell stayed blocked.

### Verification
- Live browser DOM check after deploy:
  - `navs: 1`
  - `footers: 1`
  - logo render box at desktop breakpoint: about `208x44`
- Desktop snapshot saved at:
  - `/Users/amit/Documents/Codex/2026-05-16/important-when-working-on-this-project/marketing-desktop-fixed.png`

---

## 2026-05-17 - Branding Asset Rollout, Footer Mark Fix, and Auth Dark Mode Repair

### Summary
Replaced the public favicon/app icons with the supplied compact AM logo mark, switched the shared footer from a text badge to the AM mark image, verified the shared `Login` link across the public pages, rebuilt the login/signup screens to behave correctly in dark mode, and pushed the changes live by rebuilding only the app image and replacing only `am-creator-app`.

### Completed Tasks
- [x] Derive clean AM mark assets from the provided favicon-style source images
- [x] Add reusable `BrandMark` component for shared brand-mark rendering
- [x] Replace the footer's old text-only AM badge with the new image-based AM mark
- [x] Update favicon, Apple icon, and web manifest references to the new AM mark assets
- [x] Refresh the public navbar theme handling with `resolvedTheme`
- [x] Rebuild `/login` to use theme-token colors and dark-mode-safe surfaces
- [x] Rebuild `/signup` to use theme-token colors and dark-mode-safe surfaces
- [x] Rebuild the production app image from the clean writable repo copy
- [x] Replace only `am-creator-app` without touching shared services
- [x] Verify the shared `Login` link on `/`, `/marketing`, `/features`, `/how-it-works`, `/pricing`, `/case-studies`, `/about`, `/login`, and `/signup`
- [x] Verify footer brand mark and favicon links on `https://www.amcreatoranalytics.com/marketing`
- [x] Verify `/login` in light mode and dark mode
- [x] Verify `/signup` in light mode and dark mode

### Files Modified
- `app/(auth)/login/login-content.tsx`
- `app/(auth)/signup/page.tsx`
- `app/layout.tsx`
- `app/favicon.ico`
- `app/apple-icon.png`
- `app/icon.png`
- `components/BrandMark.tsx`
- `components/Footer.tsx`
- `components/NavBar.tsx`
- `public/assets/black_AM_mark.png`
- `public/assets/white_AM_mark.png`
- `public/icons/icon-192x192.png`
- `public/icons/icon-512x512.png`
- `public/site.webmanifest`

### Deployment Notes
- The same app-only deploy path that worked for the marketing-shell fix was used again through Docker Desktop's embedded terminal.
- Working sequence:
  1. `docker compose -f docker-compose.prod.yml -f docker-compose.prod.local-env.yml --env-file /Volumes/DA/am-creator-analytics/.env.prod build app`
  2. `docker rm -f am-creator-app`
  3. `docker compose -f docker-compose.prod.yml -f docker-compose.prod.local-env.yml --env-file /Volumes/DA/am-creator-analytics/.env.prod up -d --no-deps app`
- Final terminal result showed `Container am-creator-app Started`.

### Verification
- Marketing page live DOM check:
  - `navs: 1`
  - `footers: 1`
  - footer image alt: `AM Creator Analytics mark`
- Marketing page favicon/icon links present:
  - `/favicon.ico`
  - `/assets/black_AM_mark.png` for light mode
  - `/assets/white_AM_mark.png` for dark mode
  - `/apple-icon.png`
- Shared public nav audit:
  - `Login` link present on `/`, `/marketing`, `/features`, `/how-it-works`, `/pricing`, `/case-studies`, `/about`, `/login`, and `/signup`
- Auth theme verification:
  - `/login` verified in light mode (`html.light`) and dark mode (`html.dark`)
  - `/signup` verified in light mode (`html.light`) and dark mode (`html.dark`)

### Browser Artifacts
- `/Users/amit/Documents/Codex/2026-05-16/important-when-working-on-this-project/marketing-live-after-branding.png`
- `/Users/amit/Documents/Codex/2026-05-16/important-when-working-on-this-project/login-light-fixed.png`
- `/Users/amit/Documents/Codex/2026-05-16/important-when-working-on-this-project/login-dark-fixed.png`
- `/Users/amit/Documents/Codex/2026-05-16/important-when-working-on-this-project/signup-light-fixed.png`
- `/Users/amit/Documents/Codex/2026-05-16/important-when-working-on-this-project/signup-dark-fixed.png`
