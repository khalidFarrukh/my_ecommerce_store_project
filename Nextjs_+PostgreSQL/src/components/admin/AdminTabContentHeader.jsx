"use client";
import { useFooter } from "@/context/FooterContext";

export default function AdminTabContentHeader({ heading, description }) {
  const { footerDistance } = useFooter();
  const safeFooterDistance = Math.max(0, footerDistance);

  return (
    <div
      // className={`sticky z-49 transition-all ${safeFooterDistance > 0 ? "-top-30 delay-100" : "top-15 delay-20"} mb-1 h-fit`}
      className={`sticky z-49 top-15 mb-1 h-fit`}
    >
      <div className="bg-background_1 pt-3 pb-5">
        <h1 className="text-2xl font-semibold">{heading}</h1>
        <p className="text-myTextColorMain text-sm">{description}</p>
      </div>
      <div className="relative">
        <div className="bg-background_1 border-t border-myBorderColor"></div>
        <div className="h-6 bg-linear-to-b from-background_1 from-10% to-transparent"></div>
      </div>
    </div>
  );
}
