/**
 * MinIO Client for self-hosted S3-compatible storage
 * Saves ₹10K/month vs Cloudinary
 */

import { Client, BucketItem } from 'minio';

// Initialize MinIO client
export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

export const BUCKET_NAME = process.env.MINIO_BUCKET || 'am-creator-uploads';

// Initialize bucket on startup
export async function initBucket() {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
      console.log(`✅ Bucket '${BUCKET_NAME}' created`);
    } else {
      console.log(`✅ Bucket '${BUCKET_NAME}' already exists`);
    }
  } catch (error) {
    console.error('❌ Error initializing MinIO bucket:', error);
  }
}

// Generate presigned URL for direct upload (client-side)
export async function getPresignedUploadUrl(
  objectName: string,
  expirySeconds: number = 3600
): Promise<string> {
  try {
    const url = await minioClient.presignedPutObject(
      BUCKET_NAME,
      objectName,
      expirySeconds
    );
    return url;
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw error;
  }
}

// Upload file buffer to MinIO
export async function uploadFile(
  objectName: string,
  buffer: Buffer,
  metaData: { [key: string]: string }
): Promise<string> {
  try {
    await minioClient.putObject(BUCKET_NAME, objectName, buffer, metaData);
    return `https://${process.env.MINIO_PUBLIC_URL || 'localhost:9000'}/${BUCKET_NAME}/${objectName}`;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// List files in a tenant folder
export async function listFiles(tenantId: string): Promise<BucketItem[]> {
  try {
    const objectsList: BucketItem[] = [];
    const objectsStream = minioClient.listObjects(BUCKET_NAME, `${tenantId}/`, true);
    
    // Convert stream to array
    return new Promise((resolve, reject) => {
      const items: BucketItem[] = [];
      objectsStream.on('data', (obj) => items.push(obj as BucketItem));
      objectsStream.on('end', () => resolve(items));
      objectsStream.on('error', reject);
    });
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}

// Delete a file
export async function deleteFile(objectName: string): Promise<void> {
  try {
    await minioClient.removeObject(BUCKET_NAME, objectName);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

// Get public URL for a file
export function getPublicUrl(objectName: string): string {
  return `${process.env.MINIO_PUBLIC_URL || 'http://localhost:9000'}/${BUCKET_NAME}/${objectName}`;
}
