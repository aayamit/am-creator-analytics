# AM Creator Analytics - Docker & Deployment Context Guide
*Last Updated: 2026-05-03*  
*Project Path: /Volumes/DA/am-creator-analytics*  
*Git Repo: https://github.com/amitkumaraman/am-creator-analytics.git*

---

## 📌 Service & Container Reference
| Service Name       | Container Name       | Docker Image                     | Host Ports | Container Ports | Network       |
|---------------------|-----------------------|-----------------------------------|------------|-----------------|---------------|
| App (Next.js)       | am-creator-app        | Built from `Dockerfile.prod`      | 3000       | 3000            | app-network   |
| Nginx (SSL Proxy)   | am-creator-nginx      | `nginx:alpine`                    | 80, 443    | 80, 443         | app-network, bridge |
| Postgres (DB)       | am-creator-postgres   | `postgres:15-alpine`              | 5432       | 5432            | app-network   |
| Redis (Cache)       | am-creator-redis      | `redis:7-alpine`                  | 6379       | 6379            | app-network   |
| Nango (OAuth)       | am-creator-nango      | `nangohq/nango-server:hosted`     | 3005       | 3000            | app-network   |
| OpenSign Client     | opensign-client       | OpenSign client image              | 3001       | 3000            | separate network |
| OpenSign Mongo      | opensign-mongo        | `mongo:6-alpine`                  | 27017      | 27017           | separate network |

---

## 🚀 Correct Build & Start Process (Production)
*Uses `docker-compose.prod.yml` and `.env.prod`*

### Prerequisites
1. `.env.prod` exists with all required variables (see checklist below)
2. SSL certs generated at `nginx/ssl/cert.pem` and `nginx/ssl/key.pem` (self-signed, already present)
3. Cloudflare Tunnel running (ID: `6aaf5b9c-77de-4be9-83f0-60964b3a564c`, points to `localhost:3000`)
4. No host processes blocking port 3000 (check with `lsof -i :3000`)

### Build Commands
```bash
# Navigate to project root
cd /Volumes/DA/am-creator-analytics

# Build all services (force rebuild app image)
docker compose -f docker-compose.prod.yml --env-file .env.prod build --no-cache am-creator-app

# Build all services
docker compose -f docker-compose.prod.yml --env-file .env.prod build
```

### Start Commands
```bash
# Start all services in background
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d

# Start with force recreate (if config changed)
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --force-recreate
```

### Stop/Shutdown Commands
```bash
# Stop all services
docker compose -f docker-compose.prod.yml down

# Stop and remove volumes (⚠️ CAUTION: deletes database data)
docker compose -f docker-compose.prod.yml down -v
```

### Check Logs
```bash
# Check logs for all services
docker compose -f docker-compose.prod.yml logs -f

# Check logs for specific service (e.g., nango)
docker compose -f docker-compose.prod.yml logs -f am-creator-nango
```

---

## 🛠️ All Fixes Applied (2026-05-03)
### 1. Nango Container (Restart Loop Fixed)
**Issue**: Nango failed with `password authentication failed` due to wrong image, incorrect env vars, missing Postgres user.  
**Fixes**:
- Switched to correct image: `nangohq/nango-server:hosted`
- Set explicit env vars:  
  `NANGO_DB_HOST=postgres`, `NANGO_DB_PORT=5432`, `NANGO_DB_USER=nango`, `NANGO_DB_PASSWORD=nango`, `NANGO_DB_NAME=nango`
- Created `nango` user in Postgres:  
  ```sql
  CREATE USER nango WITH PASSWORD 'nango';
  CREATE DATABASE nango OWNER nango;
  GRANT ALL PRIVILEGES ON DATABASE nango TO nango;
  ```
- Added network aliases: Postgres has alias `nango-db`, Redis has alias `nango-redis`
- Removed redundant port 3006 mapping (Nango UI/API is accessible at `localhost:3005`)

### 2. Nginx Container (Restart Loop Fixed)
**Issue**: Missing SSL certs, wrong `proxy_pass` to `localhost:3000` (resolved to wrong container).  
**Fixes**:
- Generated self-signed SSL certs:  
  ```bash
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx/ssl/key.pem -out nginx/ssl/cert.pem
  ```
- Updated Nginx config to proxy to container name: `proxy_pass http://am-creator-app:3000;`
- Added Nginx to `app-network` Docker network

### 3. Main App Port 3000 Directory Listing Fixed
**Issue**: Python `http.server` was running on host port 3000, blocking Docker container.  
**Fix**: Killed Python process:  
```bash
kill $(lsof -t -i :3000)
```

### 4. Configuration Updates
- Updated persistent memory: Cloudflare Tunnel uses port 3000 (not 3002)
- Saved reusable Nango setup as skill `nango-self-hosted-setup`

---

## 📝 Environment Variables Checklist (`.env.prod`)
Ensure these are set in `/Volumes/DA/am-creator-analytics/.env.prod`:
```env
# Postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=amcreatoranalytics

# Nango
NANGO_DB_HOST=postgres
NANGO_DB_PORT=5432
NANGO_DB_USER=nango
NANGO_DB_PASSWORD=nango
NANGO_DB_NAME=nango
NANGO_ENCRYPTION_KEY=<base64-encoded-256-bit-key>
NANGO_ADMIN_KEY=<base64-encoded-key>
NANGO_CALLBACK_URL=http://localhost:3005/oauth/callback

# App
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/amcreatoranalytics
NEXTAUTH_SECRET=<secret>
NEXTAUTH_URL=https://amcreatoranalytics.com
PORT=3000

# Redis
REDIS_URL=redis://redis:6379
```

---

## 🔍 Common Troubleshooting
1. **Port 3000 shows directory listing**:  
   Check for host processes using port 3000: `lsof -i :3000`, kill non-Docker processes.
2. **Nango auth failure**:  
   Verify `nango` user exists in Postgres, check Nango logs: `docker logs am-creator-nango`.
3. **Nginx 502 Bad Gateway**:  
   Check Nginx logs, verify `am-creator-app` is running and attached to `app-network`.
4. **SSL errors**:  
   Regenerate certs if missing: `openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx/ssl/key.pem -out nginx/ssl/cert.pem`.

---

## 🌐 Cloudflare Tunnel Config
- Tunnel ID: `6aaf5b9c-77de-4be9-83f0-60964b3a564c`
- Service Type: HTTP
- Tunnel URL: `localhost:3000`
- Public Domain: `amcreatoranalytics.com`

---

## 📂 Key File Paths
| File/Directory | Path |
|----------------|------|
| Production Docker Compose | `/Volumes/DA/am-creator-analytics/docker-compose.prod.yml` |
| App Dockerfile | `/Volumes/DA/am-creator-analytics/Dockerfile.prod` |
| Nginx Config | `/Volumes/DA/am-creator-analytics/nginx/conf/default.conf` |
| SSL Certs | `/Volumes/DA/am-creator-analytics/nginx/ssl/` |
| Prod Env File | `/Volumes/DA/am-creator-analytics/.env.prod` |
| Nango Skill | `~/.hermes/skills/nango-self-hosted-setup/SKILL.md` |
---

*This file is the single source of truth for Docker setup, fixes, and deployment context for AM Creator Analytics.*