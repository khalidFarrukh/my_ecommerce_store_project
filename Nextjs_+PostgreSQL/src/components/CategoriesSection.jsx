"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { convertTextStringToDashString } from "@/utils/utilities";

export default function CategoriesSection({ categories }) {
  const pathname = usePathname();
  const scrollRef = useRef(null);

  const not_allowed_on = ["/cart"];
  const canRenderCategories = React.useMemo(() => {
    return !not_allowed_on.includes(pathname);
  }, [pathname]);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
    canRenderCategories && (
      <section className="fixed font-poppins z-[49] top-[60px] w-full h-fit bg-background_1 border-b border-[var(--myBorderColor)]">
        <div className="max-w-[1440px] py-3 px-6 mx-auto">
          <h1
            className={`
          w-full
          text-[16px]
          text-[var(--myTextColorHeading)]
          font-medium
          mb-4
        `}
          >
            Categories
          </h1>
          <div className="relative">
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
                <div className="w-max flex gap-4 whitespace-nowrap mr-1">
                  {categories.map((category, index) => {
                    const cRoute = convertTextStringToDashString(category.name);
                    return (
                      <Link key={index} href={`/products/${cRoute}`}>
                        <div
                          className={`cursor-pointer px-3 py-1 button2 ${pathname === `/products/${cRoute}` ? "bg-foreground text-background_1" : "bg-background_1 text-foreground"}  hover:bg-foreground hover:text-background_1 transition-all delay-25`}
                        >
                          {category.name}
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
                    ></div>
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
      </section>
    )
  );
}
