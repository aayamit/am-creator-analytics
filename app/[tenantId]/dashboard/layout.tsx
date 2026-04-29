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
    // Handle tenant not found
    return <div>Tenant not found</div>;
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar 
        role={session.user.role as "BRAND" | "CREATOR" | "AGENCY" | "ADMIN"} 
        tenantId={params.tenantId}
        tenantName={tenant.name}
        tenantType={tenant.type}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
