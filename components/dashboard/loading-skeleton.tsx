import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function LoadingSkeleton() {
  return (
    <div style={{
      backgroundColor: '#F8F7F4',
      minHeight: '100vh',
      padding: '32px',
    }}>
      {/* Header skeleton */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          width: '300px',
          height: '32px',
          backgroundColor: '#e5e7eb',
          borderRadius: '4px',
          marginBottom: '8px',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }} />
        <div style={{
          width: '200px',
          height: '16px',
          backgroundColor: '#e5e7eb',
          borderRadius: '4px',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }} />
      </div>

      {/* KPI Cards skeleton */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px',
          }}>
            <div style={{
              width: '100%',
              height: '20px',
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              marginBottom: '12px',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }} />
            <div style={{
              width: '60%',
              height: '28px',
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              marginBottom: '8px',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }} />
            <div style={{
              width: '40%',
              height: '12px',
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }} />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '32px',
      }}>
        <div style={{
          width: '200px',
          height: '20px',
          backgroundColor: '#e5e7eb',
          borderRadius: '4px',
          marginBottom: '16px',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }} />
        <div style={{
          width: '100%',
          height: '300px',
          backgroundColor: '#e5e7eb',
          borderRadius: '4px',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }} />
      </div>

      {/* Table skeleton */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '24px',
      }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{
            display: 'flex',
            gap: '16px',
            padding: '12px 0',
            borderBottom: i < 5 ? '1px solid #f1f5f9' : 'none',
          }}>
            <div style={{
              flex: 1,
              height: '16px',
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }} />
            <div style={{
              width: '80px',
              height: '16px',
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }} />
            <div style={{
              width: '80px',
              height: '16px',
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }} />
          </div>
        ))}
      </div>

      {/* Add pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .5;
          }
        }
      `}</style>
    </div>
  );
}
