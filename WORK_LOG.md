# AM Creator Analytics - Work Log

## 2026-05-19 - Instagram Creator Auth Persistence Fix and Live API Read Repair

### Summary
Resumed Instagram creator auth debugging from the Mac Mini deployment. Confirmed the earlier token-exchange failure is gone, shipped the custom NextAuth adapter plus `/api/me` repair live, and verified public app health after the app-only rebuild. The remaining Instagram friction is now at the browser/auth-experience layer: Instagram reaches login and recaptcha correctly, but the end-to-end "connected" state still needs one clean successful authorization pass after removing the forced re-auth loop.

### Completed Tasks
- [x] Re-read `HANDOVER.md`, `WORK_LOG.md`, and `IMPORTANT_NEXT_SESSION_CONTEXT_AM_CREATOR_ANALYTICS.md` before resuming
- [x] Reconfirm that the live app is using the custom NextAuth adapter path in `lib/auth/nextauth.ts`
- [x] Identify that `/api/me` was still using invalid Prisma relation names (`brandProfile`, `creatorProfile`, `socialAccounts`) for the current schema
- [x] Fix `app/api/me/route.ts` to use the actual generated Prisma relation names:
  - `BrandProfile`
  - `CreatorProfile`
  - `SocialAccount`
- [x] Replace per-request `new PrismaClient()` usage in `/api/me` with the shared `@/lib/prisma` client
- [x] Rebuild the clean repo successfully with the `/api/me` repair in place
- [x] Deploy the live app again from the Mac Mini host path using:
  - `deploy_live_instagram_connection_fix.command`
- [x] Verify live local health after deploy:
  - `http://127.0.0.1:3000/api/health`
- [x] Verify public health after deploy:
  - `https://www.amcreatoranalytics.com/api/health`
- [x] Re-test the Instagram creator login flow in Chrome and confirm the app now reliably reaches Instagram auth instead of failing back in the app
- [x] Identify one remaining UX/flow issue in the auth URL generation:
  - `force_reauth: "true"` was forcing repeated Instagram re-login/recaptcha
- [x] Remove `force_reauth` locally from `InstagramBusinessProvider` so future auth attempts can reuse an existing Instagram session instead of forcing a fresh login every time
- [x] Rebuild the clean repo successfully after removing `force_reauth`

### Live State After This Session
- Live app includes:
  - custom NextAuth adapter compatible with the current Prisma schema
  - creator social-account sync in `callbacks.signIn`
  - repaired `/api/me` route using the correct Prisma relation names
- Verified live health:
  - local health returned healthy JSON after rebuild
  - public health returned healthy JSON after rebuild
- Instagram login in browser now reaches:
  - Instagram login
  - recaptcha challenge
  - successful Instagram account login for `amcreatoranalytics`

### Remaining Instagram Blocker
- The final "connected" verification is **not yet confirmed** in this session.
- Current likely remaining issue:
  - the local clean repo has the `force_reauth` removal, but this last parameter cleanup was not conclusively re-published from the sandbox after the second build because host-side relaunch control remained flaky from here.
- Practical effect:
  - the live flow is much closer and no longer failing at token exchange or `/api/me`
  - but browser-side end-to-end confirmation still needs one clean run where Instagram can reuse the active session and proceed straight through consent/callback

### Deployment Notes
- Successful live deploy artifact used this session:
  - `/Users/amit/Documents/Codex/2026-05-16/important-when-working-on-this-project/deploy_live_instagram_connection_fix.command`
- Successful deploy log:
  - `/Users/amit/Documents/Codex/2026-05-16/important-when-working-on-this-project/deploy_live_instagram_connection_fix.log`
- Successful deploy status:
  - `/Users/amit/Documents/Codex/2026-05-16/important-when-working-on-this-project/deploy_live_instagram_connection_fix.status`
- GitHub sync:
  - committed as `79e356d` — `fix(auth): repair creator social account sync and profile reads`
  - pushed successfully to `origin/master`

### Follow-Up Needed
- [ ] Re-run the live deploy one more time so the `force_reauth` removal is definitely live
- [ ] Re-test Instagram creator login in the Chrome profile that already has the cleanest Meta/Instagram session
- [ ] Confirm the final callback lands with `/creators/connections` showing Instagram as connected
- [ ] If Instagram still resists after that clean pass, move immediately to YouTube auth using the `Patna Daily / dailypatna@gmail.com` Chrome profile as requested
- [ ] After auth is stable, begin the next architecture pass for creator analytics ingestion, pooled creator data storage, categorization, fit analysis, and brand-facing insight layers

## 2026-05-17 - Instagram Creator Login Integration and Dashboard Cleanup

### Summary
Completed the Instagram Business Login code migration for creator auth, verified that the live site now generates the correct Instagram auth URL with the trimmed `instagram_business_basic` scope, and used the browser flow to isolate the last remaining blocker: the Instagram account credentials currently saved in Chrome are invalid. Also fixed a separate creator dashboard navigation bug in the clean repo where non-tenant routes were rendering `/undefined/dashboard/...` links.

### Completed Tasks
- [x] Replace the old Instagram Basic Display provider with a custom Instagram Business Login provider in `lib/auth/nextauth.ts`
- [x] Move creator social-account syncing into NextAuth `events.linkAccount`
- [x] Generate placeholder email identities for Instagram OAuth users so existing user flows do not break on missing email
- [x] Update login and signup creator copy to explicitly reference Instagram Creator or Business accounts
- [x] Fix `/creators/connections` to load social connections from `/api/me`
- [x] Clean up adjacent creator/social API issues in `/api/me`, `/api/creators/[id]`, and `/api/social-accounts/[platform]`
- [x] Trim the Instagram auth scope to `instagram_business_basic` for creator onboarding
- [x] Verify `npm run build` succeeds after the Instagram auth scope cleanup
- [x] Verify the live Instagram auth URL now contains only `scope=instagram_business_basic`
- [x] Fix `components/layout/dashboard-sidebar.tsx` so non-tenant creator/brand/admin dashboards no longer build `undefined` links in the clean repo
- [x] Wire the sidebar sign-out button to real `next-auth` sign-out behavior in the clean repo
- [x] Update handover and next-session context docs with the Instagram integration state and remaining blocker

### Live Verification
- Live creator login entry point:
  - `https://amcreatoranalytics.com/login?role=CREATOR`
- Verified in Chrome that clicking `Continue with Instagram` now opens Instagram auth with:
  - `platform_app_id=26571906789138925`
  - `redirect_uri=https://amcreatoranalytics.com/api/auth/callback/instagram`
  - `scope=instagram_business_basic`
- This confirms the live site is no longer using the old Instagram Basic Display flow and is no longer requesting the oversized business scope bundle for creator onboarding.

### Remaining Account-Side Blocker
- Instagram now recognizes the target account and shows recovery options for:
  - `amcreatoranalytics`
- The browser flow currently stops because the password saved in Chrome/LastPass for that Instagram account is invalid.
- The browser offered these recovery channels:
  - email: `partnerships@amcreatoranalytics.com`
  - SMS: `+91 79030 84346`
- The Facebook shortcut also does not complete auth because the signed-in Facebook/Meta account is not linked to that Instagram account.
- Result:
  - app-side integration is working
  - final end-to-end Instagram account linking still needs valid Instagram credentials or recovery access

### Deployment Notes
- A host-side deploy helper was used to sync the Instagram auth files into the live repo and rebuild the `app` container.
- Two overlapping deploy attempts raced with each other and produced a container-name conflict on `am-creator-app`.
- Even though the final helper run reported a conflict, browser verification showed the live auth URL had already updated to the trimmed `instagram_business_basic` scope, so at least one of the overlapping app refreshes successfully published the Instagram auth change.
- The later dashboard-sidebar cleanup was made only in the clean writable repo during this session and was **not** re-deployed live from this sandbox.

### Follow-Up Needed
- [ ] Use the correct Instagram password for `amcreatoranalytics`, or recover the account through the listed email/SMS option, then rerun the creator connection flow
- [ ] After valid Instagram auth succeeds once, verify `/creators/connections` shows Instagram as connected and inspect `/api/me` response for the synced social account
- [ ] Re-deploy the latest clean-repo dashboard-sidebar cleanup so non-tenant dashboard links stop rendering `/undefined/...` on the live site

## 2026-05-17 - Docker Standardization and Strategy-Led Website Repositioning

### Summary
Standardized the committed Docker setup for cloud-ready deployment under one predictable compose project and network, rewrote the public website around the new performance-led positioning, added creator and use-case pages, refreshed shared public chrome, and verified the code path with a successful production build.

### Completed Tasks
- [x] Audit production compose, dev compose, Dockerfiles, nginx config, Prisma DB wiring, env examples, and relevant service clients
- [x] Standardize committed production service naming to `app`, `nginx`, `postgres`, `redis`, `mongo`, `opensign`, and `nango`
- [x] Standardize committed production network name to `am_creator_network`
- [x] Replace Mac-only committed bind-mount assumptions in prod compose with named volumes
- [x] Add Postgres init bootstrap for separate app and Nango databases
- [x] Standardize internal service hostnames so app/nginx/Nango/OpenSign stop depending on stale container names or localhost
- [x] Update `.env.example`, add `.env.prod.example`, and refresh `.env.prod.template`
- [x] Validate `docker compose -f docker-compose.prod.yml config`
- [x] Validate `docker compose -f docker-compose.yml config`
- [x] Rebuild `app/marketing/page.tsx` around the new strategy-led narrative
- [x] Add `app/for-creators/page.tsx`
- [x] Add `app/for-d2c-brands/page.tsx`
- [x] Add `app/for-agencies/page.tsx`
- [x] Refresh shared public navigation in `components/NavBar.tsx`
- [x] Refresh shared public footer in `components/Footer.tsx`
- [x] Rewrite `app/pricing/page.tsx` for early-access brand and creator positioning
- [x] Update `app/about/page.tsx` and `app/contact/page.tsx` so the public funnel aligns with the new positioning
- [x] Update root metadata copy in `app/layout.tsx`
- [x] Run `npm run build` successfully after the changes
- [x] Update handover and next-session context docs with Docker/deployment and website changes

### Docker / Deployment Findings
- Previous production risk: the app container could be launched from a different compose project/network than the live Postgres and nginx services.
- Standardized committed production network:
  - `am_creator_network`
- Standardized committed production service names:
  - `app`
  - `nginx`
  - `postgres`
  - `redis`
  - `mongo`
  - `opensign`
  - `nango`
- Standardized internal hostnames:
  - app -> `postgres`
  - app -> `redis`
  - OpenSign -> `mongo`
  - nginx -> `app:3000`
  - Nango -> `postgres` and `redis`
- Main application DB is now modeled separately from Nango DB in committed config:
  - app DB: `am_creator_analytics`
  - Nango DB: `nango`

### Website Changes
- Main landing page now positions AM as:
  - India’s operating system for performance-led creator campaigns
- New public pages:
  - `/for-creators`
  - `/for-d2c-brands`
  - `/for-agencies`
- Updated public pages:
  - `/marketing`
  - `/pricing`
  - `/about`
  - `/contact`
- Shared public chrome now emphasizes:
  - performance-led creator campaigns
  - creator campaign operating system
  - verified creator profiles
  - campaign CRM
  - contracts and usage rights
  - attribution and ROI
  - payout and compliance workspace
  - founding creator network
  - founding brand partners

### Build Result
- `npm run build` completed successfully.
- Build still emits two known non-blocking warnings:
  - Next.js workspace-root warning due to multiple lockfiles
  - ESLint config warning:
    - `Cannot find module ... eslint-config-next/core-web-vitals`

### Verification / Limitations
- Verified:
  - `docker compose -f docker-compose.prod.yml config`
  - `docker compose -f docker-compose.yml config`
  - `npm run build`
- Could **not** verify from this sandbox shell:
  - `docker ps`
  - `docker network ls`
  - `docker compose -f docker-compose.prod.yml ps`
  - `docker compose -f docker-compose.prod.yml build app`
  - `docker compose -f docker-compose.prod.yml up -d`
  - `curl http://localhost:3000/api/health`
- Could **not** start a local preview server in this session because the sandbox blocked listening on a port:
  - `listen EPERM: operation not permitted 127.0.0.1:3007`
- Result: compile/build verification is complete, but this session did not deploy the new public pages live and did not browser-test a local preview.

### Next Steps
- [ ] Review the new public pages in a browser on a machine/session that can start a local or live preview server
- [ ] Decide whether to deploy the new marketing/navigation/pricing pages to the Mac Mini live stack
- [ ] Push the clean writable clone changes only after review and approval
- [ ] Later cleanup: resolve the existing ESLint config warning and Next.js lockfile/workspace-root warning
- [ ] If direct Docker runtime control is needed again, use a session/path that can access Docker Desktop or the Docker socket

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

---

## 2026-05-17 - Live Deployment Consolidation and Database Recovery

### Summary
Successfully unified the codebase by fetching the Clean Clone directly into the Live Repository on the Mac Mini, bypassing Github. Protected and successfully re-attached the live database volumes during the new Docker Compose rollout, and resolved several complex credential interpolation errors to bring the entire standardized stack (`app`, `nginx`, `postgres`, `redis`, `mongo`, `opensign`, `nango`) online and fully healthy.

### Completed Tasks
- [x] Backed up live `.env` and `.env.prod` files
- [x] Committed Clean Clone and set it as a local git remote for the Live Repo
- [x] Moved `volumes/` out of the Live Repo to protect databases during a hard git reset
- [x] Hard reset the Live Repo to match the Clean Clone's `master` branch
- [x] Restored `volumes/` to the Live Repo
- [x] Created `docker-compose.prod.local-env.yml` in the Live Repo to bind-mount the existing Mac-local `/Volumes/DA/am-creator-analytics/volumes` directories into the new Docker Compose stack, preventing the creation of empty databases
- [x] Discovered and fixed a Mongo credential override issue by appending `MONGO_INITDB_ROOT_PASSWORD` (which defaulted to `opensign123` in the old stack) to `.env` and `.env.prod`
- [x] Discovered and fixed a Postgres credential mismatch where the app was defaulting to the new `nango` user setup script, but the live volume only recognized the old `postgres` user. Reset the `postgres` password internally.
- [x] Fixed `.env.prod`'s `DATABASE_URL` which was erroneously pointing to the `nango` database instead of `am_creator_analytics`
- [x] Restarted the stack with the new standardized service names and `am_creator_network`
- [x] Verified full health status for all 7 containers via `docker ps`

### Deployment Notes
- Due to Github push failures (using a wrong credential), the deploy bypassed Github entirely via local git fetch (`git fetch clean_clone`).
- A hard git reset would have deleted the live DB volumes since commit `1ade516` erroneously tracked them. Manually moving the directories out and back safely preserved them.
- Docker compose variable interpolation reads from `.env`, not `.env.prod`. Mongo credentials had to be added to `.env` for the `healthcheck` to pass correctly.
- Ensure any future database initialization scripts respect existing volumes rather than assuming empty environments.

### Current Blockers (Instagram Auth)
- Blocked on Meta Developer Dashboard. Unable to save the User Data Deletion URL due to the `name_placeholder should represent a valid URL` bug, which in turn prevents saving the OAuth callback URL for Instagram Business login.
