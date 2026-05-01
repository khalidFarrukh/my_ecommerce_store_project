import { auth } from "@/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
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
    <div className="h-fit flex bg-background_1 gap-5">
      <AdminSidebar />

      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}