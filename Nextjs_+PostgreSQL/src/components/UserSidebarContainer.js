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


export default function UserSidebarContainer() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  // const { timeLeft, sessionData: session, sessionStatus: status } = useSessionExpiry();
  const { closeSidebar } = useSidebar();


  const pathname = usePathname();

  const selectedUrl =
    session
      ? "/profile"
      : `/signIn?callbackUrl=${pathname}`;


  return (

    <div className="w-full h-[calc(100vh-30px-40px-32px)] flex flex-col overflow-y-auto custom-scrollbar">

      <div className="grow flex flex-col justify-center">

        <nav className="mt-1 w-full flex flex-col gap-3 h-fit">

          {
            session?.user.role === "ADMIN" &&
            !pathname.startsWith("/admin") &&
            (
              <Link
                className=
                {`
                  flex
                  cursor-pointer
                  font-semibold
                  hover:text-foreground
                  h-full
                  items-center
                  w-full button1 border border-myBorderColor bg-background_2 p-3 rounded-md!
                `}
                href={"/admin"}
              >
                Dashboard
              </Link>
            )
          }

          {!["/signIn", "/signUp", "/forgotPassword", "/resetPassword", "/profile"].some((route) => pathname.startsWith(route)) &&
            (
              <Link
                onClick={() => closeSidebar()}
                className=
                {`
                    flex
                    cursor-pointer
                    font-semibold
                    hover:text-foreground
                    h-full
                    items-center
                    w-full button1 border border-myBorderColor bg-background_2 p-3 rounded-md!
                  `}
                href={selectedUrl}
              >
                {session ? "Profile" : "Sign in"}
              </Link>
            )}
          {/* </div> */}

          <button
            onClick={() => {
              setTheme(nextTheme[theme] || "system")
              localStorage.setItem("theme", nextTheme[theme])
            }}

            className="cursor-pointer button1 w-full flex justify-between border border-myBorderColor bg-background_2 p-3 rounded-md!">
            <span>Theme</span>
            <div
              className=" h-full text-foreground"
            >
              {themeIcons[theme] || <Laptop className="min-w-[20px] min-h-[20px] size-[20px]" />}
            </div>
          </button>
        </nav>
      </div>
    </div>
  );
}
