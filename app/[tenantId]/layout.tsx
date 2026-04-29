import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { prisma } from "@/lib/prisma";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import { notFound, redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard | AM Creator Analytics",
  description: "Your analytics dashboard",
};

export default async function TenantLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { tenantId: string };
}>) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  // Fetch tenant data
  const tenant = await prisma.tenant.findUnique({
    where: { id: params.tenantId },
    select: { id: true, name: true, type: true },
  });

  if (!tenant) {
    notFound();
  }

  // Check if user belongs to this tenant
  if (session.user.tenantId !== params.tenantId) {
    redirect("/unauthorized");
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar 
        role={session.user.role as "BRAND" | "CREATOR" | "AGENCY" | "ADMIN"} 
        tenantId={params.tenantId}
        tenantName={tenant.name}
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
