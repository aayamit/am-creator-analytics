/**
 * Template Selector (Client Component)
 * Shows template gallery and handles template selection
 * Bloomberg × McKinsey design
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TemplateGallery from './template-gallery';

interface TemplateSelectorProps {
  tenantId: string;
}

export default function TemplateSelector({ tenantId }: TemplateSelectorProps) {
  const [showTemplates, setShowTemplates] = useState(false);

  const handleSelectTemplate = (templateId: string) => {
    // Navigate to create campaign with template ID
    window.location.href = `/${tenantId}/dashboard/campaigns/new?template=${templateId}`;
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '16px' 
      }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: 600, 
          color: '#1a1a2e', 
          margin: 0 
        }}>
          Start from Template
        </h2>
        <Button
          onClick={() => setShowTemplates(!showTemplates)}
          style={{
            backgroundColor: showTemplates ? '#1a1a2e' : 'transparent',
            color: showTemplates ? '#F8F7F4' : '#1a1a2e',
            border: '1px solid #1a1a2e',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          {showTemplates ? 'Hide Templates' : 'Browse Templates'}
        </Button>
      </div>
      <p style={{ color: '#6b7280', marginBottom: '16px', fontSize: '14px' }}>
        Choose a template to pre-fill campaign details and save time.
      </p>
      {showTemplates && (
        <div style={{ 
          backgroundColor: '#F8F7F4', 
          padding: '16px', 
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <TemplateGallery onSelectTemplate={handleSelectTemplate} />
        </div>
      )}
    </div>
  );
}
