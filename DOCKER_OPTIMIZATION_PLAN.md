# Docker Optimization Plan (PM-16)

## 🎯 Overview
Optimize Docker setup for **production deployment**:
- **Multi-stage builds** (prisma generate, node_modules)
- **Alpine Linux** (smaller base images)
- **.dockerignore** (exclude node_modules, .next)
- **Health checks** (for docker-compose)
- **Volume mounts** (for persistent data)

## 📊 Current Image Sizes
- **Next.js app**: ~1.2GB (too big!)
- **Postgres**: 400MB
- **Redis**: 100MB
- **MinIO**: 200MB

## 🎯 Target Sizes
- **Next.js app**: ~200MB (multi-stage build)
- **Total stack**: <1GB

## 🛠️ Implementation

### 1. Update Dockerfile (Multi-stage Build)
```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.ts ./
EXPOSE 3000
CMD ["npm", "start"]
```

### 2. Update .dockerignore
```
node_modules
.next
.git
.env.local
*.md
```

### 3. Update docker-compose.yml (Health Checks)
```yaml
services:
  app:
    build: .
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## ✅ Next Steps
1. Create optimized Dockerfile
2. Update .dockerignore
3. Update docker-compose.yml
4. Test build: `docker-compose build`
5. Test run: `docker-compose up -d`
6. Check image sizes: `docker images`

## 📊 Success Metrics
- **Image Size**: <200MB for Next.js app
- **Build Time**: <5 minutes
- **Startup Time**: <30 seconds
- **Health Check**: Passes within 30s
