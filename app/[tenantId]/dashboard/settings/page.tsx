import { Settings, User, Bell, CreditCard, Shield, Cookie, Download, Trash2 } from 'lucide-react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/nextauth';
import { prisma } from '@/lib/prisma';

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const session = await getServerSession(authOptions);

  // Fetch user's payout accounts
  const payoutAccounts = session?.user?.id
    ? await prisma.payoutAccount.findMany({
        where: { userId: session.user.id },
      })
    : [];

  const stripeAccount = payoutAccounts.find(acc => acc.type === 'STRIPE_CONNECT');

  // Fetch DPDPA status
  const user = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          consentGiven: true,
          consentDate: true,
          dataProcessingAgreed: true,
        },
      })
    : null;

  // Fetch DPDPA requests
  const dpdpaRequests = session?.user?.id
    ? await prisma.dPDPRRequest.findMany({
        where: { userId: session.user.id },
        orderBy: { requestedAt: 'desc' },
        take: 10,
      })
    : [];

  return (
    <div style={{
      backgroundColor: '#F8F7F4',
      minHeight: '100vh',
      padding: '16px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      '@media (min-width: 768px)': {
        padding: '32px',
      },
    }}>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{
          color: '#1a1a2e',
          fontSize: '24px',
          fontWeight: 600,
          marginBottom: '4px',
          '@media (min-width: 768px)': {
            fontSize: '28px',
          },
        }}>
          Settings
        </h1>
        <p style={{ color: '#92400e', fontSize: '14px', margin: 0 }}>
          Manage your account and preferences
        </p>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '16px',
        '@media (min-width: 768px)': {
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
        },
      }}>
        {/* Profile Settings */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <User size={20} style={{ color: '#92400e' }} />
            <h3 style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600, margin: 0 }}>
              Profile Settings
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', color: '#1a1a2e', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>
                Display Name
              </label>
              <input
                type="text"
                defaultValue={session?.user?.name || 'User'}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#1a1a2e', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>
                Email
              </label>
              <input
                type="email"
                defaultValue={session?.user?.email || ''}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
            <button style={{
              backgroundColor: '#1a1a2e',
              color: '#F8F7F4',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              alignSelf: 'flex-start',
            }}>
              Save Changes
            </button>
          </div>
        </div>

        {/* Stripe Connect Settings */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <CreditCard size={20} style={{ color: '#92400e' }} />
            <h3 style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600, margin: 0 }}>
              Payouts & Stripe Connect
            </h3>
          </div>

          {stripeAccount ? (
            <div>
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #86efac',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '16px',
              }}>
                <div style={{ color: '#16a34a', fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>
                  ✅ Stripe Account Connected
                </div>
                <div style={{ color: '#15803d', fontSize: '12px' }}>
                  Account ID: {stripeAccount.accountId}
                </div>
                <div style={{ color: '#15803d', fontSize: '12px' }}>
                  Status: {stripeAccount.status}
                </div>
              </div>

              <button
                onClick={() => {
                  fetch('/api/stripe/connect', { method: 'POST' })
                    .then(res => res.json())
                    .then(data => {
                      if (data.url) {
                        window.location.href = data.url;
                      }
                    });
                }}
                style={{
                  backgroundColor: '#92400e',
                  color: '#F8F7F4',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                {stripeAccount.status === 'PENDING' ? 'Complete Onboarding' : 'Manage Account'}
              </button>
            </div>
          ) : (
            <div>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
                Connect your Stripe account to receive payouts and signing bonuses.
              </p>
              <button
                onClick={() => {
                  fetch('/api/stripe/connect', { method: 'POST' })
                    .then(res => res.json())
                    .then(data => {
                      if (data.url) {
                        window.location.href = data.url;
                      } else {
                        alert('Stripe not configured. Add STRIPE_SECRET_KEY to .env');
                      }
                    });
                }}
                style={{
                  backgroundColor: '#1a1a2e',
                  color: '#F8F7F4',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  justifyContent: 'center',
                }}
              >
                <Cookie size={16} /> Connect Stripe Account
              </button>
            </div>
          )}
        </div>

        {/* DPDPA Compliance */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Shield size={20} style={{ color: '#92400e' }} />
            <h3 style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600, margin: 0 }}>
              DPDPA Compliance
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Consent Status */}
            <div style={{
              backgroundColor: user?.consentGiven ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${user?.consentGiven ? '#86efac' : '#fecaca'}`,
              borderRadius: '6px',
              padding: '12px',
            }}>
              <div style={{ 
                color: user?.consentGiven ? '#16a34a' : '#dc2626', 
                fontSize: '14px', 
                fontWeight: 500, 
                marginBottom: '4px' 
              }}>
                {user?.consentGiven ? '✅ Consent Given' : '⚠️ Consent Not Given'}
              </div>
              {user?.consentDate && (
                <div style={{ color: user?.consentGiven ? '#15803d' : '#991b1b', fontSize: '12px' }}>
                  Consent Date: {new Date(user.consentDate).toLocaleDateString('en-IN')}
                </div>
              )}
            </div>

            {/* DPDPA Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => {
                  fetch('/api/dpdpa', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      consentGiven: true,
                      dataProcessingAgreed: true,
                    }),
                  })
                    .then(res => res.json())
                    .then(data => {
                      if (data.success) {
                        alert('Consent updated successfully!');
                        window.location.reload();
                      }
                    });
                }}
                style={{
                  backgroundColor: '#1a1a2e',
                  color: '#F8F7F4',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Cookie size={16} /> Give Consent
              </button>

              <button
                onClick={() => {
                  fetch('/api/dpdpa', {
                    method: 'PUT',
                  })
                    .then(res => res.json())
                    .then(data => {
                      if (data.success) {
                        alert('Data export request submitted. You will receive an email when ready.');
                      }
                    });
                }}
                style={{
                  backgroundColor: '#f1f5f9',
                  color: '#1a1a2e',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Download size={16} /> Request Data Export
              </button>

              <button
                onClick={() => {
                  if (confirm('Are you sure you want to request data erasure? This will delete all your data.')) {
                    fetch('/api/dpdpa', {
                      method: 'DELETE',
                    })
                      .then(res => res.json())
                      .then(data => {
                        if (data.success) {
                          alert('Data erasure request submitted. Admin approval required.');
                        }
                      });
                  }
                }}
                style={{
                  backgroundColor: '#fef2f2',
                  color: '#dc2626',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #fecaca',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Trash2 size={16} /> Request Data Erasure
              </button>
            </div>

            {/* DPDPA Request History */}
            {dpdpaRequests.length > 0 && (
              <div>
                <h4 style={{ color: '#1a1a2e', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                  Request History
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {dpdpaRequests.map(req => (
                    <div
                      key={req.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '4px',
                        fontSize: '12px',
                      }}
                    >
                      <span style={{ color: '#1a1a2e' }}>{req.type} Request</span>
                      <span style={{
                        color: req.status === 'COMPLETED' ? '#16a34a' : '#92400e',
                        fontWeight: 500,
                      }}>
                        {req.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notification Settings */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Bell size={20} style={{ color: '#92400e' }} />
            <h3 style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600, margin: 0 }}>
              Notifications
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Email Notifications', desc: 'Receive updates via email' },
              { label: 'Contract Signed Alerts', desc: 'Get notified when contracts are signed' },
              { label: 'Campaign Updates', desc: 'Notifications about campaign performance' },
            ].map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: index < 2 ? '1px solid #f1f5f9' : 'none',
              }}>
                <div>
                  <div style={{ color: '#1a1a2e', fontSize: '14px', fontWeight: 500 }}>
                    {item.label}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '12px' }}>
                    {item.desc}
                  </div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={true}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Security Settings */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Shield size={20} style={{ color: '#92400e' }} />
            <h3 style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600, margin: 0 }}>
              Security
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button style={{
              backgroundColor: '#f1f5f9',
              color: '#1a1a2e',
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left',
            }}>
              Change Password
            </button>
            <button style={{
              backgroundColor: '#f1f5f9',
              color: '#1a1a2e',
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left',
            }}>
              Two-Factor Authentication
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
