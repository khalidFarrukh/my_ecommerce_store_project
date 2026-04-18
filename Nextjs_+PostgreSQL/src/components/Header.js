"use client"
import Image from "next/image";
import SideBar from "@/components/sidebar";
import { Laptop, MenuIcon, Moon, Search, ShoppingCart, Sun } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import Link from "next/link";
import CustomCartBox from "./smallCartBox";
import { closeSidebar, openSidebar } from "@/store/sidebarSlice";
import { useDispatch, useSelector } from "react-redux";
import { useSearchModal } from "@/context/SearchModalContext";
import { useCartButtonContext } from "@/context/CartButtonContext";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTheme } from "@/context/ThemeContext";
import { useWindowSizeContext } from "@/context/WindowSizeContext";
import { themeIcons, nextTheme } from "@/utils/staticVariables";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { isCartBtnHovered, setIsCartBtnHovered } = useCartButtonContext();
  const { windowWidth } = useWindowSizeContext();

  const cartState = useSelector(state => state.cart.cartState);

  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isLoading = status === "loading";
  const selectedUrl =
    status === "authenticated"
      ? "/profile"
      : `/signIn?callbackUrl=${pathname}`;

  const cartItemsSize = React.useMemo(() => {
    let variantCount = 0;
    cartState.items.forEach(product => {
      variantCount += product.variants.length;
    });
    return variantCount;
  }, [cartState]);

  useEffect(() => {
    if (pathname === "/cart")
      setIsCartBtnHovered(false);
  }, [pathname])

  const dispatch = useDispatch();
  const { openSearchModal } = useSearchModal();

  // const nextTheme = {
  //   light: "dark",
  //   dark: "system",
  //   system: "light",
  // };

  // const themeIcons = {
  //   light: <Moon className="min-w-[20px] min-h-[20px] size-[20px]" />,
  //   dark: <Laptop className="min-w-[20px] min-h-[20px] size-[20px]" />,
  //   system: <Sun className="min-w-[20px] min-h-[20px] size-[20px]" />,
  // };
  return (
    <>
      <header
        className=
        {`
          z-50
          fixed
          w-full
          font-poppins
          h-[60px]
          text-[var(--myTextColorMain)]
          bg-background_1
          border-b
          border-myBorderColor
        `}
      >
        <nav
          className=
          {`
            
            w-full
            max-w-[1440px]
            h-full
            px-2.5
            w375:px-5
            mx-auto
          `}
        >
          <div
            className=
            {`
            w-full
            h-full
            relative
            mx-auto
            flex
            items-center
          `}
          >
            <div
              className="
              absolute
              left-0
              flex
              flex-row
              items-center
              gap-3
              w375:gap-5
              "
            >
              {
                windowWidth < 768 &&
                <button
                  onClick={() => dispatch(openSidebar())}
                  className=
                  {`
                cursor-pointer
                text-[12px]
                font-semibold
                h-full
                hover:text-foreground
              `}
                >
                  <MenuIcon className="min-w-[20px] min-h-[20px] size-[20px]" />
                </button>
              }

              {/* {
                windowWidth < 575 &&
                <Link
                  href="/"
                  className=
                  {`
                    mx-auto
                    text-base 
                    h-full
                    text-center
                    font-semibold
                    hover:text-foreground
                    flex
                    items-center
                  `}
                >
                  MEDUSA STORE
                </Link>
              } */}
              {
                windowWidth >= 768 &&
                <button
                  onClick={() => setTheme(nextTheme[theme] || "system")}
                  className="cursor-pointer h-full text-foreground"
                >
                  {themeIcons[theme] || <Laptop className="min-w-[20px] min-h-[20px] size-[20px]" />}
                </button>
              }
            </div>
            {
              // windowWidth >= 575 &&
              (
                <Link
                  href="/"
                  className=
                  {`
                    mx-auto
                    ${windowWidth >= 575 ? "text-lg" : "text-base"}
                    h-full
                    text-center
                    font-semibold
                    hover:text-foreground
                    flex
                    items-center
                  `}
                >
                  FK STORE
                </Link>
              )}
            <div
              className=
              {`
              absolute
              h-full
              right-0
              flex
              items-center
              gap-3
              w375:gap-5
            `}
            >
              <button
                type="button"
                onClick={openSearchModal}
                className={`
                  
                  cursor-pointer
                  text-[12px]
                  font-semibold
                  h-full
                  hover:text-foreground
                `}
              >
                <Search className="min-w-[20px] min-h-[20px] size-[20px]" />
              </button>
              {
                session?.user.role === "ADMIN" &&
                status === "authenticated" &&
                pathname !== "/admin" &&
                (
                  <Link
                    className=
                    {`
                      hidden
                      lg:flex
                      cursor-pointer
                      text-[12px]
                      font-semibold
                      hover:text-foreground
                      h-full
                      items-center
                      ${isLoading ? "pointer-events-none opacity-50" : ""}
                    `}
                    href={"/admin"}
                  >
                    Dashboard
                  </Link>
                )
              }
              {!["/signIn", "/signUp", "/forgotPassword", "/resetPassword", "/profile"].some((route) => pathname.startsWith(route)) &&
                windowWidth >= 768 &&
                (
                  <Link
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
                  `}
                    href={selectedUrl}
                  >
                    {status === "authenticated" ? "Profile" : "Sign in"}
                  </Link>
                )}

              {
                pathname !== "/cart" &&
                <>
                  <Link
                    href="/cart"
                    onMouseEnter={() => setIsCartBtnHovered(true)}
                    onMouseLeave={() => setIsCartBtnHovered(false)}
                    //onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className=
                    {`
                      cursor-pointer
                      font-semibold
                      text-[12px]
                      hover:text-foreground
                      h-full
                      flex items-center
                    `}
                  >
                    <ShoppingCart className="min-w-[20px] min-h-[20px] size-[20px]" />
                    {`(${cartItemsSize})`}
                  </Link>
                  <CustomCartBox />
                </>
              }
            </div>
          </div>
        </nav>
      </header >
    </>
  )
}
