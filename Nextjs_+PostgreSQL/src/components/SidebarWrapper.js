"use client"
import { usePathname } from "next/navigation";
import UserSidebarContainer from "./UserSidebarContainer";
import AdminSidebarContainer from "./admin/AdminSidebarContainer";
import Sidebar from "./Sidebar";

export default function SidebarWrapper() {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");


  return (
    <Sidebar>
      {isAdmin ? <AdminSidebarContainer /> : <UserSidebarContainer />}
    </Sidebar>
  );
}