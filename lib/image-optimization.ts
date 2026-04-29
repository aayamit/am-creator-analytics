/**
 * Image Optimization Utility
 * Uses Sharp for fast image processing
 * Saves bandwidth, improves Lighthouse scores
 */

import sharp from 'sharp';

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number; // 1-100
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

/**
 * Optimize an image buffer
 * Returns optimized buffer in specified format
 */
export async function optimizeImage(
  inputBuffer: Buffer,
  options: ImageOptimizationOptions = {}
): Promise<Buffer> {
  const {
    width,
    height,
    quality = 85,
    format = 'webp',
    fit = 'inside',
  } = options;

  let pipeline = sharp(inputBuffer);

  // Resize if dimensions provided
  if (width || height) {
    pipeline = pipeline.resize(width, height, { fit });
  }

  // Convert to desired format
  switch (format) {
    case 'webp':
      pipeline = pipeline.webp({ quality });
      break;
    case 'avif':
      pipeline = pipeline.avif({ quality });
      break;
    case 'jpeg':
      pipeline = pipeline.jpeg({ quality });
      break;
    case 'png':
      pipeline = pipeline.png({ quality });
      break;
  }

  return await pipeline.toBuffer();
}

/**
 * Get image metadata
 */
export async function getImageMetadata(inputBuffer: Buffer) {
  const metadata = await sharp(inputBuffer).metadata();
  return {
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    size: inputBuffer.length,
    aspectRatio: metadata.width && metadata.height
      ? metadata.width / metadata.height
      : undefined,
  };
}

/**
 * Generate blur placeholder (base64)
 * Useful for Next.js Image placeholder="blur"
 */
export async function generateBlurPlaceholder(
  inputBuffer: Buffer,
  width: number = 10
): Promise<string> {
  const placeholderBuffer = await sharp(inputBuffer)
    .resize(width)
    .webp({ quality: 20 })
    .toBuffer();

  return `data:image/webp;base64,${placeholderBuffer.toString('base64')}`;
}

/**
 * Create multiple sizes for responsive images
 */
export async function createResponsiveSizes(
  inputBuffer: Buffer,
  sizes: { width: number; suffix: string }[]
): Promise<{ suffix: string; buffer: Buffer; width: number }[]> {
  const results = await Promise.all(
    sizes.map(async ({ width, suffix }) => {
      const buffer = await sharp(inputBuffer)
        .resize(width, null, { fit: 'inside' })
        .webp({ quality: 85 })
        .toBuffer();

      return { suffix, buffer, width };
    })
  );

  return results;
}

/**
 * Example usage in API route:
 * 
 * import { optimizeImage } from '@/lib/image-optimization';
 * 
 * const file = req.file; // multer or formdata
 * const optimized = await optimizeImage(file.buffer, {
 *   width: 800,
 *   quality: 85,
 *   format: 'webp',
 * });
 * 
 * // Save optimized buffer to MinIO
 * await minioClient.putObject('am-creator', `images/${filename}.webp`, optimized);
 */
