"use client"
import { ArrowLeft } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { nextTheme, themeIcons } from "@/utils/staticVariables";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useWindowSizeContext } from "@/context/WindowSizeContext";
import Link from "next/link";
import { useSessionExpiry } from "@/context/SessionExpiryContext";
import React from "react";
import { useSidebar } from "@/context/SidebarContext";


export default function SideBar({ children }) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const { isOpen, closeSidebar } = useSidebar();


  return (
    <aside className="font-poppins">
      {
        isOpen &&
        <div onClick={() => closeSidebar()} className="fixed w-full h-full bg-background_1/50 pointer-events-auto z-[99]">

        </div>
      }

      <div
        // ref={sideBarRef}
        className=
        {`
        z-[100]
        fixed
        transition-transform
        duration-500
        ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        w-[300px]
        p-4
        h-screen
        bg-background_1
        border-r
        border-myBorderColor
      `}
      >
        <div className="w-full h-screen flex flex-col gap-10">

          <div className="w-full h-[30px] flex justify-between items-center">
            <button
              onClick={() => closeSidebar()}
              className=
              {`
              group
              w-[30px]
              h-[30px]
              button1
              !rounded-full
              cursor-pointer
              flex
              items-center
              justify-center
            `}
            >
              <ArrowLeft />
            </button>
            {/* Sidebar title */}
            {
              session?.user?.role === "ADMIN" &&
              <div className="shrink-0">
                <span className="text-[30px] font-bold">Admin</span>
              </div>
            }
          </div>
          {children}
        </div>
      </div>
    </aside>
  );
}
