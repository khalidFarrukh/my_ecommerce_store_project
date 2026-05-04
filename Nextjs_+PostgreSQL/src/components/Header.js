"use client"
import Image from "next/image";
import { Laptop, MenuIcon, Moon, Search, ShoppingCart, Sun } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import Link from "next/link";
import CustomCartBox from "./smallCartBox";
import { useDispatch, useSelector } from "react-redux";
import { useSearchModal } from "@/context/SearchModalContext";
import { useCartButtonContext } from "@/context/CartButtonContext";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTheme } from "@/context/ThemeContext";
import { useWindowSizeContext } from "@/context/WindowSizeContext";
import { themeIcons, nextTheme } from "@/utils/staticVariables";
import { useSessionExpiry } from "@/context/SessionExpiryContext";
import { useAdminSidebar, useSidebar } from "@/context/SidebarContext";

export default function Header() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const { isCartBtnHovered, setIsCartBtnHovered } = useCartButtonContext();
  const { windowWidth } = useWindowSizeContext();
  // const { timeLeft, sessionData: session, sessionStatus: status } = useSessionExpiry();

  const cartState = useSelector(state => state.cart.cartState);
  const { isOpen, openSidebar } = useSidebar();

  const pathname = usePathname();

  const isLoading = status === "loading";
  const selectedUrl =
    session
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

  const { openSearchModal } = useSearchModal();

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
                  onClick={() => openSidebar()}
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
                  onClick={() => {
                    setTheme(nextTheme[theme] || "system");
                    localStorage.setItem("theme", nextTheme[theme]);
                  }}
                  className="cursor-pointer h-full hover:text-foreground"
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
                !pathname.startsWith("/admin") &&
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
                  `}
                    href={selectedUrl}
                  >
                    {session ? "Profile" : "Sign in"}
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
