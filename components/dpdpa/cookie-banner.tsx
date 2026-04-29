'use client';

import { useState, useEffect } from 'react';
import { Cookie, Shield, Download, Trash2 } from 'lucide-react';

interface DPDPAStatus {
  consentGiven?: boolean;
  consentDate?: string;
  dataProcessingAgreed?: boolean;
  consentLogs?: any[];
  pendingRequests?: any[];
}

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [dpdpaStatus, setDpdpaStatus] = useState<DPDPAStatus | null>(null);

  useEffect(() => {
    // Check DPDPA status
    fetch('/api/dpdpa')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDpdpaStatus(data);
          if (!data.user?.consentGiven) {
            setShowBanner(true);
          }
        }
      });
  }, []);

  const handleConsent = async (given: boolean) => {
    try {
      const res = await fetch('/api/dpdpa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consentGiven: given,
          dataProcessingAgreed: given,
        }),
      });

      if (res.ok) {
        setShowBanner(false);
        // Refresh status
        const data = await res.json();
        setDpdpaStatus(data);
      }
    } catch (error) {
      console.error('Consent error:', error);
    }
  };

  if (!showBanner) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#1a1a2e',
      color: '#F8F7F4',
      padding: '16px',
      zIndex: 9999,
      boxShadow: '0 -4px 6px rgba(0, 0, 0, 0.1)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        '@media (min-width: 768px)': {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Cookie size={20} />
            <strong style={{ fontSize: '14px' }}>Your Privacy Matters</strong>
          </div>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
            We use cookies and process your data to provide you with a better experience. 
            You can choose to give or withdraw consent at any time.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => handleConsent(true)}
            style={{
              backgroundColor: '#92400e',
              color: '#F8F7F4',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Accept All
          </button>
          <button
            onClick={() => handleConsent(false)}
            style={{
              backgroundColor: 'transparent',
              color: '#F8F7F4',
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #F8F7F4',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
