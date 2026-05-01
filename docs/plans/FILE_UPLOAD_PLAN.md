# File Upload System with MinIO

## 📎 Overview
Self-hosted S3-compatible file storage using **MinIO** — saves ₹10K/month vs Cloudinary.

## 🚀 Quick Setup

### 1. Add MinIO to docker-compose.yml
```yaml
minio:
  image: minio/minio:latest
  ports:
    - "9000:9000"
    - "9001:9001"
  environment:
    MINIO_ROOT_USER: minioadmin
    MINIO_ROOT_PASSWORD: minioadmin
  command: server /data --console-address ":9001"
  volumes:
    - minio_data:/data
```

### 2. Install MinIO Client
```bash
npm install minio
```

### 3. Create Bucket
```bash
mc alias set myminio http://localhost:9000 minioadmin minioadmin
mc mb myminio/am-creator-uploads
```

## 📂 Features to Build
1. **File Upload API** (`/api/upload/route.ts`)
2. **File Upload Component** (`components/upload/file-upload.tsx`)
3. **Assets Page** (`app/[tenantId]/dashboard/assets/page.tsx`)
4. **Image Optimization** (Sharp.js)
5. **File Type Validation** (images, videos, PDFs)

## 💰 Cost Savings
- **MinIO (self-hosted)**: FREE (only storage costs)
- **Cloudinary**: ₹10K/month for 100GB
- **Savings**: **₹10K/month**

## 🔒 Security
- Signed URLs for uploads
- File type validation
- Size limits (10MB images, 100MB videos)
- Tenant isolation (files in tenant-specific folders)
