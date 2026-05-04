"use client";

import { useCategoriesContext } from "@/context/CategoriesContext";
import { usePathname } from "next/navigation";
import React from "react";

export default function NotFound({ message }) {
  const { areCategoriesOpen } = useCategoriesContext();
  const pathname = usePathname();
  return (
    <React.Fragment key={pathname}>
      <div className={`${areCategoriesOpen ? "min-h-[calc(100vh-60px-98px-176px-24px)] md:min-h-[calc(100vh-60px-98px-140px-24px)]" : "min-h-[calc(100vh-60px-48px-176px-24px)] md:min-h-[calc(100vh-60px-48px-140px-24px)]"} flex items-center justify-center bg-[red]`}>
        {message}
      </div>
    </React.Fragment>
  );
}