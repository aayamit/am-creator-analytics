import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";

export default async function DashboardHomePage({
  params,
}: {
  params: { tenantId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  // Redirect to the appropriate dashboard based on role
  const role = session.user.role;
  if (role === "CREATOR") {
    redirect(`/${params.tenantId}/dashboard/creators`);
  } else if (role === "BRAND") {
    redirect(`/${params.tenantId}/dashboard/brands`);
  } else {
    redirect(`/${params.tenantId}/dashboard/admin`);
  }
}
