"use client"
import { ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { closeSidebar } from "@/store/sidebarSlice";
import { useTheme } from "@/context/ThemeContext";
import { nextTheme, themeIcons } from "@/utils/staticVariables";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useWindowSizeContext } from "@/context/WindowSizeContext";
import Link from "next/link";


export default function SideBar() {
  const { theme, setTheme } = useTheme();
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const dispatch = useDispatch();

  const { windowWidth } = useWindowSizeContext();

  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isLoading = status === "loading";
  const selectedUrl =
    status === "authenticated"
      ? "/profile"
      : `/signIn?callbackUrl=${pathname}`;


  return (
    <aside className="font-poppins">
      {
        isOpen &&
        <div onClick={() => dispatch(closeSidebar())} className="fixed w-full h-full bg-background_1/50 pointer-events-auto z-[99]">

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
        h-full
        bg-background_1
        border-r
        border-myBorderColor
      `}
      >
        <div className="w-full flex flex-col gap-10">

          <div className="w-full flex justify-end">
            <button
              onClick={() => dispatch(closeSidebar())}
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
          </div>
          <div className="w-full space-y-3">

            {/* <div className="w-full border border-myBorderColor bg-background_2 p-3 rounded-md"> */}
            {!["/signIn", "/signUp", "/forgotPassword", "/resetPassword", "/profile"].some((route) => pathname.startsWith(route)) &&
              (
                <Link
                  onClick={() => dispatch(closeSidebar())}
                  className=
                  {`
                    flex
                    cursor-pointer
                    text-[12px]
                    font-semibold
                    hover:text-foreground
                    h-full
                    items-center
                    ${isLoading ? "pointer-events-none opacity-50" : ""}
                    w-full border border-myBorderColor bg-background_2 p-3 rounded-md
                  `}
                  href={selectedUrl}
                >
                  {status === "authenticated" ? "Profile" : "Sign in"}
                </Link>
              )}
            {/* </div> */}

            <div className="w-full flex justify-between border border-myBorderColor bg-background_2 p-3 rounded-md">
              <span>Theme</span>
              <button
                onClick={() => {
                  setTheme(nextTheme[theme] || "system")
                  localStorage.set("theme", nextTheme[theme])
                }}
                className="cursor-pointer h-full text-foreground"
              >
                {themeIcons[theme] || <Laptop className="min-w-[20px] min-h-[20px] size-[20px]" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
