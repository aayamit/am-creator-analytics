/**
 * Export Buttons Component (Simplified)
 * Excel/CSV export with tenantId
 * Bloomberg × McKinsey design
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';

interface ExportButtonsProps {
  tenantId: string;
  reportType?: 'campaigns' | 'creators' | 'payouts' | 'all';
  variant?: 'horizontal' | 'vertical';
}

export default function ExportButtons({
  tenantId,
  reportType = 'all',
  variant = 'horizontal',
}: ExportButtonsProps) {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = async (format: 'excel' | 'csv') => {
    setExporting(format);
    try {
      const endpoint = format === 'excel' ? 'excel' : 'csv';
      const url = `/api/reports/${endpoint}?tenantId=${tenantId}&type=${reportType}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Export failed');

      // Download file
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : `report.${format === 'excel' ? 'xlsx' : 'csv'}`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);

      alert(`Export successful! Downloaded as ${format.toUpperCase()}`);
    } catch (error) {
      alert('Export failed. Please try again later.');
    } finally {
      setExporting(null);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: variant === 'vertical' ? 'column' : 'row',
        gap: '8px',
      }}
    >
      <Button
        onClick={() => handleExport('excel')}
        disabled={exporting !== null}
        style={{
          backgroundColor: exporting === 'excel' ? '#92400e80' : '#92400e',
          color: '#F8F7F4',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <FileSpreadsheet size={16} />
        {exporting === 'excel' ? 'Exporting...' : 'Export to Excel'}
      </Button>

      <Button
        onClick={() => handleExport('csv')}
        disabled={exporting !== null}
        variant="outline"
        style={{
          borderColor: '#92400e',
          color: '#92400e',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <FileText size={16} />
        {exporting === 'csv' ? 'Exporting...' : 'Export to CSV'}
      </Button>
    </div>
  );
}
