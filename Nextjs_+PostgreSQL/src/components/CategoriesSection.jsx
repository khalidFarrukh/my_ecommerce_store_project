"use client";

import React, { useRef, useState, useEffect, use } from "react";
import {
  Anchor,
  ArrowUp,
  ArrowUpIcon,
  ChevronLeft,
  ChevronRight,
  MoveUp,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { convertTextStringToDashString } from "@/utils/utilities";
import { useCategoriesContext } from "@/context/CategoriesContext";

export default function CategoriesSection({ categories }) {
  const pathname = usePathname();
  const scrollRef = useRef(null);

  const not_allowed_on = [
    "/cart",
    "/checkout",
    "/signIn",
    "/signUp",
    "/forgotPassword",
    "/resetPassword",
  ];
  const canRenderCategories = React.useMemo(() => {
    return (
      !not_allowed_on.some((path) => pathname.includes(path)) &&
      !pathname.startsWith("/admin")
    );
    // convert this !not_allowed_on.includes(pathname) such that we check if pathname includes any of the not_allowed_on paths, because currently if we are on /cart/anything it will show categories, which we don't want, we want to hide categories on all cart related pages, so we need to check if pathname includes any of the not_allowed_on paths
  }, [pathname]);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { areCategoriesOpen, setAreCategoriesOpen } = useCategoriesContext();

  const getScrollAmount = () => {
    const el = scrollRef.current;
    return el ? el.clientWidth * 0.25 : 0;
  };

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;

    const tolerance = 2; // pixels (safe for all DPRs)

    const maxScrollLeft = el.scrollWidth - el.clientWidth;

    setCanScrollLeft(el.scrollLeft > tolerance);
    setCanScrollRight(el.scrollLeft < maxScrollLeft - tolerance);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const resizeObserver = new ResizeObserver(() => {
      updateScrollState();
    });

    resizeObserver.observe(el);

    return () => resizeObserver.disconnect();
  }, [canRenderCategories]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState);

    return () => el.removeEventListener("scroll", updateScrollState);
  }, [canRenderCategories]);

  const scrollLeft = () => {
    const amount = getScrollAmount();
    if (!amount) return;
    scrollRef.current.scrollBy({ left: -amount, behavior: "smooth" });
  };

  const scrollRight = () => {
    const amount = getScrollAmount();
    if (!amount) return;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    canRenderCategories &&
    categories.length > 0 && (
      <section
        aria-label="Product categories"
        className={`fixed font-poppins text-[var(--myTextColorMain)] z-49 top-15 w-full h-fit bg-background_1 border-b border-myBorderColor`}
      >
        <div
          className={`w-full ${areCategoriesOpen ? "h-24.5" : "h-12.25"} transition-normal overflow-hidden duration-200`}
        >
          <div
            className="
          max-w-360
          px-2.5
          w375:px-5
          mx-auto
          "
          >
            <div className="hover:text-foreground pt-3 relative h-[48px] w-full bg-background_1 z-2">
              <button
                className={`text-[16px]\ font-medium mb-4 flex items-center gap-2 cursor-pointer`}
                onClick={() => {
                  setAreCategoriesOpen(!areCategoriesOpen);
                }}
              >
                Categories
                <span
                  className={`text-xl ${areCategoriesOpen ? "rotate-90" : "rotate-270"} transition-transform`}
                >
                  {"<"}
                </span>
              </button>
            </div>
            <div className={`absolute z-1 bottom-3`}>
              <div className="flex w-full items-center">
                {/* ALL button */}
                {/* 
              <Link href="/collections/all-products">
                <div className="pr-4 flex-shrink-0">
                  <div className="cursor-pointer px-3 py-1 rounded-2xl bg-black text-white">
                    All
                  </div>
                </div>
              </Link> */}
                {/* SCROLLER */}
                <div
                  ref={scrollRef}
                  className="w-full overflow-x-auto scrollbar-hide "
                >
                  <div className="w-max flex items-center gap-4 whitespace-nowrap mr-1">
                    {categories.map((category, index) => {
                      return (
                        <Link key={index} href={`/products/${category?._id}`}>
                          <div
                            className={`cursor-pointer  px-3 py-1 ${pathname === `/products/${category?._id}` ? "button1_active" : "button1"} transition-transform delay-25`}
                          >
                            {category?.name}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div
                className={`
                  pointer-events-none
                  absolute
                  top-0
                  right-0
                  flex
                  h-full
                  w-full
                  z-0                        
                `}
              >
                <div
                  className={`      
                    w-full
                    h-full
                    relative
                  `}
                >
                  {canScrollLeft && (
                    <>
                      <div
                        className={`
                          absolute
                          pointer-events-none
                          w-1/3
                          h-full
                          bg-gradient-to-r
                          from-background_1
                          to-transparent
                        `}
                      />
                      <button
                        onClick={scrollLeft}
                        className="pointer-events-auto cursor-pointer absolute z-10 size-[34px] rounded-full bg-foreground text-background_1 flex justify-center items-center"
                      >
                        <ChevronLeft />
                      </button>
                    </>
                  )}
                  {canScrollRight && (
                    <>
                      <div
                        className={`
                            absolute
                            pointer-events-none
                            right-0
                            w-1/3
                            h-full
                            bg-gradient-to-l
                            from-background_1
                            to-transparent
                          `}
                      ></div>
                      <button
                        onClick={scrollRight}
                        className="pointer-events-auto cursor-pointer absolute z-10 right-0 size-[34px] rounded-full bg-foreground text-background_1 flex justify-center items-center"
                      >
                        <ChevronRight />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  );
}
