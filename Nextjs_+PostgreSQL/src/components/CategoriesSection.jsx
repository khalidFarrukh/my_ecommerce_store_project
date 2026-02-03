"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CategoriesSection({ Categories }) {
  const scrollRef = useRef(null);

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
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState);

    return () => el.removeEventListener("scroll", updateScrollState);
  }, []);

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
    <section className="fixed z-[49] top-[60px] w-full h-fit bg-white">
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
            <div className="pr-4 flex-shrink-0">
              <button className="cursor-pointer px-3 py-1 rounded-2xl bg-black text-white">
                All
              </button>
            </div>

            {/* SCROLLER */}
            <div
              ref={scrollRef}
              className="w-full overflow-x-auto scrollbar-hide "
            >
              <div className="w-max flex gap-4 whitespace-nowrap mr-1">
                {Categories.map((category, index) => (
                  <button
                    key={index}
                    className="cursor-pointer px-3 py-1 rounded-2xl border bg-white text-black hover:bg-black hover:text-white transition-all delay-75"
                  >
                    {category}
                  </button>
                ))}
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
                          ml-[57px]
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
                            from-white
                            to-transparent
                          `}
                  ></div>
                  <button
                    onClick={scrollLeft}
                    className="pointer-events-auto cursor-pointer absolute z-10 size-[34px] rounded-full bg-black text-white flex justify-center items-center"
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
                            from-white
                            to-transparent
                          `}
                  ></div>
                  <button
                    onClick={scrollRight}
                    className="pointer-events-auto cursor-pointer absolute z-10 right-0 size-[34px] rounded-full bg-black text-white flex justify-center items-center"
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
  );
}
