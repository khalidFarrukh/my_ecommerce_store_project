"use client";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

export default function PageContentWrapper({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const not_allowed_on = ["/cart"];
  const isValid = React.useMemo(() => {
    return !not_allowed_on.includes(pathname);
  }, [pathname]);

  return (
    <div
      className={`${isValid ? "pt-[calc(60px+98px)]" : "pt-[60px]"} font-poppins h-full bg-background_1`}
    >
      {/* offset for fixed header */}
      <div
        className="
          max-w-[1440px]
          px-6
          mx-auto
          flex
          flex-col
          text-myTextColorMain
        "
      >
        {children}
      </div>
    </div>
  );
}
