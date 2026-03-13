"use client";

import { useState } from "react";
// import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function AccountUI({ children }) {
  const searchParams = useSearchParams();

  // if middleware added callbackUrl (?callbackUrl=/profile)
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <div className="z-1 font-poppins relative w-full bg-background_1 my-6 flex flex-col items-center">
      <section className="w-full flex flex-col items-center">
        <div className="w-full max-w-100 h-fit flex flex-col gap-3 items-center">
          {children}
        </div>
      </section>
    </div>
  );
}
