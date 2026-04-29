/**
 * Admin Users Page
 * Manage users within the tenant
 */

import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, Search, Filter, Shield, UserX, UserCheck } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/nextauth';

export const metadata: Metadata = {
  title: 'Users | Admin | AM Creator Analytics',
  description: 'Manage tenant users',
};

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div>Unauthorized</div>;
  }

  // Fetch all users in the tenant
  const users = await prisma.user.findMany({
    where: { tenantId },
    include: {
      creatorProfile: true,
      brandProfile: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // Stats
  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    creators: users.filter(u => u.role === 'CREATOR').length,
    brands: users.filter(u => u.role === 'BRAND').length,
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return { bg: '#fef3c7', text: '#92400e' };
      case 'CREATOR': return { bg: '#dcfce7', text: '#166534' };
      case 'BRAND': return { bg: '#dbeafe', text: '#1e40af' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

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
      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '24px',
        '@media (min-width: 768px)': {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        },
      }}>
        <div>
          <h1 style={{
            color: '#1a1a2e',
            fontSize: '24px',
            fontWeight: 600,
            marginBottom: '4px',
            '@media (min-width: 768px)': {
              fontSize: '28px',
            },
          }}>
            Users
          </h1>
          <p style={{
            color: '#92400e',
            fontSize: '14px',
            margin: 0,
          }}>
            Manage users within your tenant
          </p>
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
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
          justifyContent: 'center',
          '@media (min-width: 768px)': {
            width: 'auto',
          },
        }}>
          <Plus size={16} /> Add User
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '12px',
        marginBottom: '24px',
        '@media (min-width: 768px)': {
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
        },
      }}>
        <StatCard title="Total Users" value={stats.total.toString()} color="#1a1a2e" icon={<Users size={20} />} />
        <StatCard title="Admins" value={stats.admins.toString()} color="#92400e" icon={<Shield size={20} />} />
        <StatCard title="Creators" value={stats.creators.toString()} color="#16a34a" icon={<UserCheck size={20} />} />
        <StatCard title="Brands" value={stats.brands.toString()} color="#2563eb" icon={<UserX size={20} />} />
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '24px',
        '@media (min-width: 768px)': {
          flexDirection: 'row',
          alignItems: 'center',
        },
      }}>
        <div style={{
          position: 'relative',
          flex: 1,
        }}>
          <Search size={16} style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#6b7280',
          }} />
          <input
            type="text"
            placeholder="Search users..."
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <button style={{
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
          width: '100%',
          '@media (min-width: 768px)': {
            width: 'auto',
          },
        }}>
          <Filter size={16} /> Filter
        </button>
      </div>

      {/* Users Table */}
      <Card style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        <CardHeader>
          <CardTitle style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600 }}>
            All Users ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent style={{ padding: 0 }}>
          {users.length === 0 ? (
            <div style={{
              padding: '48px 24px',
              textAlign: 'center',
              color: '#6b7280',
            }}>
              <p style={{ fontSize: '16px', marginBottom: '8px' }}>No users yet</p>
              <p style={{ fontSize: '14px' }}>Add users to your tenant to get started.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '800px',
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#f9fafb',
                    borderBottom: '2px solid #e5e7eb',
                  }}>
                    <th style={thStyle}>User</th>
                    <th style={thStyle}>Role</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Joined</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const roleColor = getRoleColor(user.role);
                    return (
                      <tr key={user.id} style={{
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background-color 0.2s',
                      }}>
                        <td style={tdStyle}>
                          <div>
                            <div style={{
                              color: '#1a1a2e',
                              fontSize: '14px',
                              fontWeight: 500,
                              marginBottom: '2px',
                            }}>
                              {user.name || 'No name'}
                            </div>
                            <div style={{
                              color: '#6b7280',
                              fontSize: '12px',
                            }}>
                              ID: {user.id.substring(0, 8)}...
                            </div>
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            backgroundColor: roleColor.bg,
                            color: roleColor.text,
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 500,
                          }}>
                            {user.role}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            color: '#1a1a2e',
                            fontSize: '14px',
                          }}>
                            {user.email}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            color: '#6b7280',
                            fontSize: '12px',
                          }}>
                            {new Date(user.createdAt).toLocaleDateString('en-IN')}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            backgroundColor: user.emailVerified ? '#dcfce7' : '#fef3c7',
                            color: user.emailVerified ? '#166534' : '#92400e',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 500,
                          }}>
                            {user.emailVerified ? 'VERIFIED' : 'PENDING'}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <div style={{
                            display: 'flex',
                            gap: '8px',
                          }}>
                            <button style={actionButtonStyle}>
                              Edit
                            </button>
                            {user.role !== 'ADMIN' && (
                              <button style={{
                                ...actionButtonStyle,
                                color: '#dc2626',
                              }}>
                                Remove
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, color, icon }: { title: string; value: string; color: string; icon: React.ReactNode }) {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '4px',
      }}>
        <div style={{
          color: '#6b7280',
          fontSize: '12px',
          fontWeight: 600,
          textTransform: 'uppercase' as const,
        }}>
          {title}
        </div>
        <div style={{ color: '#92400e' }}>{icon}</div>
      </div>
      <div style={{
        color: color,
        fontSize: '24px',
        fontWeight: 600,
      }}>
        {value}
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: 'left' as const,
  padding: '12px 16px',
  color: '#1a1a2e',
  fontSize: '12px',
  fontWeight: 600,
  textTransform: 'uppercase' as const,
};

const tdStyle = {
  padding: '16px',
  color: '#1a1a2e',
  fontSize: '14px',
};

const actionButtonStyle = {
  backgroundColor: 'transparent',
  border: '1px solid #e5e7eb',
  borderRadius: '4px',
  padding: '4px 8px',
  cursor: 'pointer',
  color: '#6b7280',
  fontSize: '12px',
};
