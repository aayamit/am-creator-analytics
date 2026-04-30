/**
 * MinIO Helper
 * Upload files to self-hosted MinIO (S3-compatible)
 * Saves vs Cloudinary ($39/month)
 */

import * as Minio from 'minio';

// Initialize MinIO client
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

// Bucket name
const BUCKET_NAME = process.env.MINIO_BUCKET || 'am-creator-analytics';

/**
 * Ensure bucket exists
 */
async function ensureBucket() {
  const exists = await minioClient.bucketExists(BUCKET_NAME);
  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME, process.env.MINIO_REGION || 'us-east-1');
    console.log(`Created bucket: ${BUCKET_NAME}`);
  }
}

/**
 * Upload file to MinIO
 * @returns The object name (path) in the bucket
 */
export async function uploadFile(
  objectName: string,
  buffer: Buffer,
  metaData: { [key: string]: string }
): Promise<string> {
  await ensureBucket();

  await minioClient.putObject(
    BUCKET_NAME,
    objectName,
    buffer,
    buffer.length,
    metaData
  );

  // Return the path (for DB storage)
  return objectName;
}

/**
 * Get public URL for file (using presigned URL)
 * Note: For production, you might want to use a CDN or public bucket
 */
export async function getPublicUrl(
  objectName: string,
  expirySeconds = 604800 // 7 days
): Promise<string> {
  return minioClient.presignedGetObject(
    BUCKET_NAME,
    objectName,
    expirySeconds
  );
}

/**
 * List files in bucket with prefix
 */
export async function listFiles(
  prefix: string,
  recursive = true
): Promise<string[]> {
  const objectsList: string[] = [];
  const objectsStream = minioClient.listObjects(BUCKET_NAME, prefix, recursive);

  return new Promise((resolve, reject) => {
    objectsStream.on('data', (obj) => {
      if (obj.name) objectsList.push(obj.name);
    });
    objectsStream.on('end', () => resolve(objectsList));
    objectsStream.on('error', reject);
  });
}

/**
 * Delete file from MinIO
 */
export async function deleteFile(objectName: string): Promise<void> {
  await minioClient.removeObject(BUCKET_NAME, objectName);
}

/**
 * Get presigned URL for download (alias for getPublicUrl)
 */
export async function getPresignedUrl(
  objectName: string,
  expirySeconds = 604800
): Promise<string> {
  return getPublicUrl(objectName, expirySeconds);
}

// Export minio client as default
export default minioClient;

// Also export bucket name constant
export { BUCKET_NAME };
