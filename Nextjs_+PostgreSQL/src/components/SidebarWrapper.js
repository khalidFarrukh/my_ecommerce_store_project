"use client"
import { usePathname } from "next/navigation";
import SideBar from "./SideBar";
import UserSidebarContainer from "./UserSidebarContainer";
import AdminSidebarContainer from "./admin/AdminSidebarContainer";

export default function SidebarWrapper() {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");

  return (
    <SideBar>
      {isAdmin ? <AdminSidebarContainer /> : <UserSidebarContainer />}
    </SideBar>
  );
}