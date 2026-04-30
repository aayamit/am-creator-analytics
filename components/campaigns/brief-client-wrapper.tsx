/**
 * Campaign Brief Client Wrapper
 * Client Component to avoid SSR issues with Yjs/WebSocket
 * Bloomberg × McKinsey design
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileEdit, Users } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import CollaborativeTextEditor from '@/components/collaboration/collaborative-text-editor';

// Dynamic import to disable SSR for Yjs components
const DynamicEditor = dynamic(
  () => Promise.resolve(CollaborativeTextEditor),
  { 
    ssr: false,
    loading: () => (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: '#92400e',
        fontSize: '14px',
      }}>
        Loading collaborative editor...
      </div>
    )
  }
);

interface BriefClientWrapperProps {
  campaignId: string;
  campaignName: string;
  tenantId: string;
  initialContent: string;
}

export default function BriefClientWrapper({
  campaignId,
  campaignName,
  tenantId,
  initialContent,
}: BriefClientWrapperProps) {
  const documentId = `campaign-brief-${campaignId}`;

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <div>
          <Link
            href={`/${tenantId}/dashboard/campaigns/${campaignId}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#1a1a2e',
              textDecoration: 'none',
              fontSize: '14px',
              marginBottom: '8px',
            }}
          >
            <ArrowLeft size={16} />
            Back to Campaign
          </Link>
          <h1 style={{
            margin: '0 0 8px 0',
            fontSize: '24px',
            fontWeight: 600,
            color: '#1a1a2e',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <FileEdit size={24} style={{ color: '#92400e' }} />
            {campaignName} — Brief
          </h1>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#92400e',
            opacity: 0.8,
          }}>
            Collaborative brief editor — changes sync in real-time
          </p>
        </div>
      </div>

      {/* Collaborative Editor */}
      <DynamicEditor
        documentId={documentId}
        initialContent={initialContent}
        username="User"
        label="Campaign Brief"
        height="600px"
      />

      {/* Info Card */}
      <div style={{ marginTop: '24px' }}>
        <Card style={{ backgroundColor: '#F8F7F4', border: '1px solid #92400e40' }}>
          <CardContent style={{ padding: '16px', fontSize: '14px', color: '#92400e' }}>
            <strong>💡 Tip:</strong> This brief is collaborative — multiple team members can edit simultaneously. 
            Changes are saved in real-time using our self-hosted Yjs WebSocket server (saves vs Google Docs API).
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
