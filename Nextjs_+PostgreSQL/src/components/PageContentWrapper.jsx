"use client";
import { useCategoriesContext } from "@/context/CategoriesContext";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

export default function PageContentWrapper({ children, categories }) {
  const pathname = usePathname();
  const { areCategoriesOpen } = useCategoriesContext();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const not_allowed_on = [
    "/cart",
    "/checkout",
    "/signIn",
    "/signUp",
    "/forgotPassword",
    "/resetPassword",
  ];
  const isValid = React.useMemo(() => {
    return !not_allowed_on.includes(pathname) && !pathname.startsWith("/admin");
  }, [pathname]);

  const flex_center_allowed_on = [
    "/signIn",
    "/signUp",
    "/forgotPassword",
    "/resetPassword",
  ];
  const isValidFlexCenter = React.useMemo(() => {
    return flex_center_allowed_on.some((path) => pathname.includes(path));
  }, [pathname]);

  return (
    <main
      key={pathname}
      className={`flex-1 flex flex-col ${isValidFlexCenter ? "items-center justify-center" : ""} font-poppins bg-background_1`}
    >
      <div
        className={`${isValid ? (categories.length > 0 ? (areCategoriesOpen ? "pt-[calc(60px+98px)]" : "pt-[calc(60px+49px)]") : "pt-[60px]") : "pt-[60px]"} w-full transition-all duration-200`}
      >
        <div className="max-w-360 w-full px-2.5 w375:px-5 mx-auto flex flex-col text-myTextColorMain">
          {children}
        </div>
      </div>
    </main>
  );
}
