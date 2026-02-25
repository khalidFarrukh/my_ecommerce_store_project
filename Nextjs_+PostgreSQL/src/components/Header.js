"use client"
import Image from "next/image";
import SideBar from "@/components/sidebar";
import { MenuIcon } from "lucide-react";
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

export default function Header() {

  const { isCartBtnHovered, setIsCartBtnHovered } = useCartButtonContext();

  const cartState = useSelector(state => state.cart.cartState);

  const { status } = useSession();
  const pathname = usePathname();
  const isLoading = status === "loading";
  const selectedUrl =
    status === "authenticated"
      ? "/profile"
      : `/account?callbackUrl=${pathname}`;
  const startsWithAccount = pathname.startsWith("/account");

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
            px-6
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
            <button

              onClick={() => dispatch(openSidebar())}
              className=
              {`
                absolute
                left-0
                cursor-pointer
                text-[12px]
                font-semibold
                h-full
                hover:text-foreground
              `}
            >
              Menu
            </button>
            <Link
              href="/"
              className=
              {`
              mx-auto
              text-[19px]
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
            <div
              className=
              {`
              absolute
              h-full
              right-0
              flex
              items-center
            `}
            >
              <button
                type="button"
                onClick={openSearchModal}
                className=
                {`
                hidden
                lg:block
                cursor-pointer
                text-[12px]
                font-semibold
                h-full
                hover:text-foreground
                mr-6
              `}
              >
                Search
              </button>

              {!startsWithAccount && (
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
                    ${pathname !== "/cart" ? "mr-6" : ""}
                    ${isLoading ? "pointer-events-none opacity-50" : ""}
                  `}
                  href={selectedUrl}
                >
                  {status === "authenticated" ? "Account" : "Sign in"}
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
                    {`Cart (${cartItemsSize})`}
                  </Link>
                  <CustomCartBox />
                </>
              }
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}
