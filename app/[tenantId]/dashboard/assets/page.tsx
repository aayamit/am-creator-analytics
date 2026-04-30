/**
 * Assets Page - File Manager
 * Browse, upload, and manage files (images, videos, PDFs)
 * Powered by MinIO (saves Rs.10K/month vs Cloudinary)
 */

import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Upload, Search, Image, Video, FileText, Grid3X3, List, 
  Download, Trash2, Filter 
} from 'lucide-react';
import FileUpload from '@/components/upload/file-upload';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Assets | AM Creator Analytics',
  description: 'Manage your files and media',
};

interface Asset {
  name: string;
  size: number;
  lastModified: Date;
  url: string;
  type: 'image' | 'video' | 'document';
  category: string;
}

export default async function AssetsPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;

  // TODO: Fetch files from MinIO
  // const files = await listFiles(tenantId);
  
  // Mock data for now
  const assets: Asset[] = [
    {
      name: 'campaign-banner.jpg',
      size: 2048576,
      lastModified: new Date('2026-04-28'),
      url: '/placeholder.svg',
      type: 'image',
      category: 'campaign',
    },
    {
      name: 'intro-video.mp4',
      size: 52428800,
      lastModified: new Date('2026-04-27'),
      url: '/placeholder.svg',
      type: 'video',
      category: 'asset',
    },
    {
      name: 'contract-template.pdf',
      size: 1048576,
      lastModified: new Date('2026-04-26'),
      url: '/placeholder.svg',
      type: 'document',
      category: 'contract',
    },
  ];

  const stats = {
    total: assets.length,
    images: assets.filter(a => a.type === 'image').length,
    videos: assets.filter(a => a.type === 'video').length,
    documents: assets.filter(a => a.type === 'document').length,
    totalSize: assets.reduce((sum, a) => sum + a.size, 0),
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div style={{ backgroundColor: '#F8F7F4', minHeight: '100vh', padding: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#1a1a2e', marginBottom: '8px' }}>
          Assets
        </h1>
        <p style={{ color: '#92400e', opacity: 0.8 }}>
          Manage your files, images, and videos (stored on MinIO — saves Rs.10K/month)
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '24px',
        marginBottom: '32px',
      }}>
        <Card style={{ backgroundColor: 'white', border: '1px solid rgba(26,26,46,0.1)' }}>
          <CardHeader style={{ paddingBottom: '8px' }}>
            <CardTitle style={{ fontSize: '14px', color: '#92400e', fontWeight: 500 }}>
              Total Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ fontSize: '36px', fontWeight: 700, color: '#1a1a2e' }}>
              {stats.total}
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', border: '1px solid rgba(26,26,46,0.1)' }}>
          <CardHeader style={{ paddingBottom: '8px' }}>
            <CardTitle style={{ fontSize: '14px', color: '#92400e', fontWeight: 500 }}>
              <Image size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ fontSize: '36px', fontWeight: 700, color: '#1a1a2e' }}>
              {stats.images}
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', border: '1px solid rgba(26,26,46,0.1)' }}>
          <CardHeader style={{ paddingBottom: '8px' }}>
            <CardTitle style={{ fontSize: '14px', color: '#92400e', fontWeight: 500 }}>
              <Video size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Videos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ fontSize: '36px', fontWeight: 700, color: '#1a1a2e' }}>
              {stats.videos}
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'white', border: '1px solid rgba(26,26,46,0.1)' }}>
          <CardHeader style={{ paddingBottom: '8px' }}>
            <CardTitle style={{ fontSize: '14px', color: '#92400e', fontWeight: 500 }}>
              Storage Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ fontSize: '36px', fontWeight: 700, color: '#1a1a2e' }}>
              {formatSize(stats.totalSize)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Section */}
      <Card style={{ backgroundColor: 'white', border: '1px solid rgba(26,26,46,0.1)', marginBottom: '32px' }}>
        <CardHeader>
          <CardTitle style={{ fontSize: '18px', color: '#1a1a2e' }}>
            <Upload size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Upload Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload
            tenantId={tenantId}
            category="asset"
            onUploadComplete={(url, filename) => {
              console.log('Uploaded:', filename, url);
              // Refresh page or update state
            }}
            maxFiles={10}
          />
        </CardContent>
      </Card>

      {/* Files List */}
      <Card style={{ backgroundColor: 'white', border: '1px solid rgba(26,26,46,0.1)' }}>
        <CardHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <CardTitle style={{ fontSize: '18px', color: '#1a1a2e' }}>
              Files
            </CardTitle>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#92400e' }} />
                <Input
                  placeholder="Search files..."
                  style={{ paddingLeft: '36px', width: '250px' }}
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter size={16} style={{ marginRight: '8px' }} />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(26,26,46,0.1)' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#92400e', fontWeight: 600 }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#92400e', fontWeight: 600 }}>Type</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#92400e', fontWeight: 600 }}>Category</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#92400e', fontWeight: 600 }}>Size</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#92400e', fontWeight: 600 }}>Modified</th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '12px', color: '#92400e', fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid rgba(26,26,46,0.05)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {asset.type === 'image' && <Image size={20} className="text-blue-500" />}
                        {asset.type === 'video' && <Video size={20} className="text-purple-500" />}
                        {asset.type === 'document' && <FileText size={20} className="text-gray-500" />}
                        <span style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a2e' }}>
                          {asset.name}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1a1a2e' }}>
                      {asset.type}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        backgroundColor: asset.category === 'campaign' ? '#dbeafe' : 
                                           asset.category === 'asset' ? '#d1fae5' : '#fef3c7',
                        color: '#1a1a2e',
                      }}>
                        {asset.category}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1a1a2e' }}>
                      {formatSize(asset.size)}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1a1a2e' }}>
                      {asset.lastModified.toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" size="sm">
                          <Download size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" style={{ color: '#ef4444' }}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
