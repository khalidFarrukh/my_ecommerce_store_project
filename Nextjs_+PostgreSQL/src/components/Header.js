"use client"
import Image from "next/image";
import SideBar from "@/components/sidebar";
import { MenuIcon } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import Link from "next/link";
import CustomCartBox from "./smallCartBox";
import { closeSidebar, openSidebar } from "@/store/sidebarSlice";
import { useDispatch } from "react-redux";

export default function Header() {
  const {
    isMenuOpen,
    setIsMenuOpen,
    isCartBtnHovered,
    setIsCartBtnHovered,
    isSearchBtnClicked,
    setIsSearchBtnClicked,
    menuBtnRef,
    isSearchBarOpen,
    setIsSearchBarOpen,
    accBtnRef,
    cartBtnRef

  } = useAppContext();

  const dispatch = useDispatch();
  return (
    <>
      <header
        className=
        {`
          z-[50]
          fixed
          w-full
          h-[60px]
          text-[var(--myTextColorNormal)]
          bg-white
          border-b
          border-[var(--myBorderColor)]
        `}
      >
        <nav
          className=
          {`
            z-[50]
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
              ref={menuBtnRef}
              onClick={() => dispatch(openSidebar())}
              className=
              {`
                absolute
                left-0
                cursor-pointer
                text-[12px]
                font-semibold
                hover:text-black
              `}
            >
              Menu
            </button>
            <Link
              href="/"
              className=
              {`
              mx-auto
              font-poppins
              text-[120%]
              font-semibold
              hover:text-black
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
              <Link
                href="/search"
                className=
                {`
                hidden
                lg:block
                cursor-pointer
                text-[12px]
                font-semibold
                hover:text-black
                mr-6
              `}
              >
                Search
              </Link>
              <Link
                href="/account"
                //onClick={() => setIsMenuOpen(!isMenuOpen)}
                className=
                {`
                hidden
                lg:flex
                cursor-pointer
                text-[12px]
                font-semibold
                hover:text-black
                h-full
                items-center
                mr-6
              `}
              >
                Account
              </Link>
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
                hover:text-black
                h-full
                flex items-center
              `}
              >
                {
                  "Cart (" +
                  0
                  + ")"
                }
              </Link>
              <CustomCartBox />
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}
