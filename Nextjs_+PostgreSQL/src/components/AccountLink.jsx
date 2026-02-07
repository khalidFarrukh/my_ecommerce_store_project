"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";

export default function AccountLink() {
  const { status } = useSession();
  const pathname = usePathname();
  const isLoading = status === "loading";
  const selectedUrl =
    status === "authenticated"
      ? "/profile"
      : `/account?callbackUrl=${pathname}`;
  const startsWithAccount = pathname.startsWith("/account");
  return (
    <>
      {!startsWithAccount && (
        <Link
          className={`
        hidden
        lg:flex
        cursor-pointer
        text-[12px]
        font-semibold
        hover:text-black
        h-full
        items-center
        mr-6
       ${isLoading ? "pointer-events-none opacity-50" : ""}
      `}
          href={selectedUrl}
        >
          {status === "authenticated" ? "Account" : "Sign in"}
        </Link>
      )}
    </>
  );
}
