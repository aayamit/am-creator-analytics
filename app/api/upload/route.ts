/**
 * API Route: File Upload to MinIO
 * Handles file uploads (images, videos, PDFs) for creators/brands
 * Saves ₹10K/month vs Cloudinary
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/nextauth';
import { prisma } from '@/lib/prisma';
import { minioClient, BUCKET_NAME, uploadFile, listFiles, deleteFile, getPublicUrl } from '@/lib/minio';
import { Readable } from 'stream';

// Supported file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const ALLOWED_DOC_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    // 1. Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const tenantId = formData.get('tenantId') as string;
    const category = formData.get('category') as string || 'general'; // campaign, profile, asset

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 3. Validate file type
    const fileType = file.type;
    const isImage = ALLOWED_IMAGE_TYPES.includes(fileType);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(fileType);
    const isDoc = ALLOWED_DOC_TYPES.includes(fileType);

    if (!isImage && !isVideo && !isDoc) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // 4. Validate file size
    if (isImage && file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: 'Image too large (max 10MB)' }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large (max 100MB)' }, { status: 400 });
    }

    // 5. Convert to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 6. Generate unique filename
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const filename = `${tenantId}/${category}/${timestamp}-${file.name}`;

    // 7. Upload to MinIO
    const metaData = {
      'Content-Type': fileType,
      'Original-Name': file.name,
      'Uploaded-By': session.user.id,
    };

    const objectName = await uploadFile(filename, buffer, metaData);

    // 8. Save file record to database (optional)
    // await prisma.fileUpload.create({...});

    // 9. Return file URL
    const fileUrl = getPublicUrl(objectName);

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename: objectName,
      size: file.size,
      type: fileType,
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// List files for a tenant
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = request.nextUrl.searchParams.get('tenantId');
    if (!tenantId) {
      return NextResponse.json({ error: 'tenantId required' }, { status: 400 });
    }

    const files = await listFiles(tenantId);

    return NextResponse.json({
      success: true,
      files: files.map(f => ({
        name: f.name,
        size: f.size,
        lastModified: f.lastModified,
        url: getPublicUrl(f.name),
      })),
    });

  } catch (error: any) {
    console.error('List files error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Delete a file
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const objectName = request.nextUrl.searchParams.get('objectName');
    if (!objectName) {
      return NextResponse.json({ error: 'objectName required' }, { status: 400 });
    }

    await deleteFile(objectName);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
