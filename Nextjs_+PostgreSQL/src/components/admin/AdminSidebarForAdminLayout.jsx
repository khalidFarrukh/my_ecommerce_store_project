"use client";

import { useAdminSidebar } from "@/context/SidebarContext";
import { useWindowSizeContext } from "@/context/WindowSizeContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebarForAdminLayout() {
  const pathname = usePathname();
  const { windowWidth } = useWindowSizeContext();

  if (windowWidth < 768) return null;

  return (
    <aside className="w-56 border-r border-myBorderColor pr-5 sticky top-[calc(60px+20px)] h-[calc(100vh-60px-24px)] flex flex-col justify-center">
      <div className="h-fit ">
        {/* Sidebar title */}
        <div className="mb-6 shrink-0">
          <span className="text-[30px] mt-3 font-bold">Admin</span>
        </div>

        {/* Scrollable links area */}
        <nav className="flex flex-col gap-3 overflow-y-auto">
          <Link
            href="/admin"
            className={`button1 px-3 py-1.5 ${
              pathname === "/admin" ? "button1_active" : ""
            }`}
          >
            Dashboard
          </Link>

          <Link
            href="/admin/products"
            className={`button1 px-3 py-1.5 ${
              pathname.startsWith("/admin/products") ? "button1_active" : ""
            }`}
          >
            Products
          </Link>

          <Link
            href="/admin/collections"
            className={`button1 px-3 py-1.5 ${
              pathname.startsWith("/admin/collections") ? "button1_active" : ""
            }`}
          >
            Collections
          </Link>

          <Link
            href="/admin/orders"
            className={`button1 px-3 py-1.5 ${
              pathname.startsWith("/admin/orders") ? "button1_active" : ""
            }`}
          >
            Orders
          </Link>
        </nav>
      </div>
    </aside>
  );
}
