import type { Metadata } from "next";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Dashboard | AM Creator Analytics",
  description: "Your analytics dashboard",
};

export default async function DashboardLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { tenantId: string };
}>) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null; // Will redirect via middleware
  }

  // Fetch tenant data for sidebar
  const tenant = await prisma.tenant.findUnique({
    where: { id: params.tenantId },
    select: { id: true, name: true, type: true },
  });

  if (!tenant) {
    return <div>Tenant not found</div>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8F7F4' }}>
      {/* Sidebar - hidden on mobile */}
      <div style={{
        display: 'none', // Hidden by default on mobile
        '@media (min-width: 768px)': {
          display: 'block',
        },
      } as React.CSSProperties}>
        <DashboardSidebar 
          role={session.user.role as "BRAND" | "CREATOR" | "AGENCY" | "ADMIN"}
          tenantId={params.tenantId}
          tenantName={tenant.name}
          tenantType={tenant.type}
        />
      </div>

      {/* Mobile header - shown on mobile only */}
      <div style={{
        display: 'block',
        '@media (min-width: 768px)': {
          display: 'none',
        },
      } as React.CSSProperties}>
        <MobileHeader tenantName={tenant.name} tenantId={params.tenantId} />
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        width: '100%',
        '@media (min-width: 768px)': {
          width: 'calc(100% - 250px)',
        },
      }}>
        <main style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px',
          '@media (min-width: 768px)': {
            padding: '32px',
          },
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}

function MobileHeader({ tenantName, tenantId }: { tenantName?: string; tenantId: string }) {
  return (
    <div style={{
      backgroundColor: '#1a1a2e',
      color: '#F8F7F4',
      padding: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #4b5563',
    }}>
      <div>
        <h1 style={{
          fontSize: '18px',
          fontWeight: 700,
          margin: 0,
          marginBottom: '4px',
        }}>
          {tenantName || 'AM Creator'}
        </h1>
        {tenantName && (
          <p style={{
            fontSize: '12px',
            color: '#9ca3af',
            margin: 0,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.05em',
          }}>
            {tenantName}
          </p>
        )}
      </div>
      <button style={{
        backgroundColor: '#92400e',
        color: '#F8F7F4',
        padding: '8px 12px',
        borderRadius: '6px',
        border: 'none',
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer',
      }}>
        Menu
      </button>
    </div>
  );
}
