import { auth } from "@/auth";
import AdminSidebarForAdminLayout from "@/components/admin/AdminSidebarForAdminLayout";

import { redirect } from "next/navigation";

export default async function AdminLayout({ children }) {
  const session = await auth();

  if (!session) {
    redirect("/signIn?callbackUrl=/admin&error=auth_required");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/?error=only_admin_allowed");
  }

  return (
    <div className="h-fit flex bg-background_1 md:gap-5">
      <AdminSidebarForAdminLayout />

      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}