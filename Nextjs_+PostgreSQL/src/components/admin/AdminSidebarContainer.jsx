"use client";

import { useSidebar } from "@/context/SidebarContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebarContainer() {
  const pathname = usePathname();
  const { closeSidebar } = useSidebar();

  return (
    <div className="w-full h-[calc(100vh-30px-40px-32px)] flex flex-col overflow-y-auto custom-scrollbar">
      <div className="grow flex flex-col justify-center">
        {/* Scrollable links area */}
        <nav className="mt-1 w-full flex flex-col gap-3 h-fit">
          <Link
            onClick={closeSidebar}
            href="/admin"
            className={`button1 px-3 py-1.5 ${
              pathname === "/admin" ? "button1_active" : ""
            }`}
          >
            Dashboard
          </Link>

          <Link
            onClick={closeSidebar}
            href="/admin/products"
            className={`button1 px-3 py-1.5 ${
              pathname.startsWith("/admin/products") ? "button1_active" : ""
            }`}
          >
            Products
          </Link>

          <Link
            onClick={closeSidebar}
            href="/admin/collections"
            className={`button1 px-3 py-1.5 ${
              pathname.startsWith("/admin/collections") ? "button1_active" : ""
            }`}
          >
            Collections
          </Link>

          <Link
            onClick={closeSidebar}
            href="/admin/orders"
            className={`button1 px-3 py-1.5 ${
              pathname.startsWith("/admin/orders") ? "button1_active" : ""
            }`}
          >
            Orders
          </Link>
        </nav>
      </div>
    </div>
  );
}
