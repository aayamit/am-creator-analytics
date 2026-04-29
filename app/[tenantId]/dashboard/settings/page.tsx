import { Settings, User, Bell, CreditCard, Shield } from 'lucide-react';

export default function SettingsPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  return (
    <div style={{
      backgroundColor: '#F8F7F4',
      minHeight: '100vh',
      padding: '32px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ color: '#1a1a2e', fontSize: '28px', fontWeight: 600, marginBottom: '4px' }}>
          Settings
        </h1>
        <p style={{ color: '#92400e', fontSize: '14px', margin: 0 }}>
          Manage your account and preferences
        </p>
      </header>

      {/* Settings Sections */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
      }}>
        {/* Profile Settings */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '24px',
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
                defaultValue="Admin User"
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
                defaultValue="admin@amcreator.com"
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

        {/* Notification Settings */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '24px',
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

        {/* Billing Settings */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <CreditCard size={20} style={{ color: '#92400e' }} />
            <h3 style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600, margin: 0 }}>
              Billing & Subscription
            </h3>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: '#1a1a2e', fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>
              Current Plan
            </div>
            <div style={{
              backgroundColor: '#f0fdf4',
              color: '#16a34a',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 500,
              display: 'inline-block',
            }}>
              Professional Plan (₹299/month)
            </div>
          </div>
          <button style={{
            backgroundColor: '#92400e',
            color: '#F8F7F4',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
          }}>
            Manage Subscription
          </button>
        </div>

        {/* Security Settings */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '24px',
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
              API Keys & Integrations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
