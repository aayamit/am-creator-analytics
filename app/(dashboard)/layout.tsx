import type { Metadata } from "next";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";

export const metadata: Metadata = {
  title: "Dashboard | AM Creator Analytics",
  description: "Your analytics dashboard",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null; // Will redirect via middleware
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar role={session.user.role as "BRAND" | "CREATOR"} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
