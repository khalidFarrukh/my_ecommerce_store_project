"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function AccountLink() {
  const { status } = useSession();
  const pathname = usePathname();

  const selectedUrl =
    status === "authenticated"
      ? "/profile"
      : status === "loading"
        ? "#"
        : `/account?callbackUrl=${pathname}`;

  return (
    <Link
      className="
        hidden
        lg:flex
        cursor-pointer
        text-[12px]
        font-semibold
        hover:text-black
        h-full
        items-center
        mr-6
      "
      href={selectedUrl}
    >
      Account
    </Link>
  );
}
