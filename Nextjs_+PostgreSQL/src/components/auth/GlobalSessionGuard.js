"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function GlobalSessionGuard() {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const wasAuthenticated = useRef(false);
  const hasRedirectedAfterExpiry = useRef(false);

  useEffect(() => {
    // user is authenticated → reset flags
    if (status === "authenticated") {
      wasAuthenticated.current = true;
      hasRedirectedAfterExpiry.current = false;
      return;
    }

    // session expired → redirect ONLY ONCE
    if (
      status === "unauthenticated" &&
      wasAuthenticated.current &&
      !hasRedirectedAfterExpiry.current &&
      pathname !== "/account"
    ) {
      hasRedirectedAfterExpiry.current = true;

      router.push(`/account?callbackUrl=${pathname}`);
    }
  }, [status, pathname, router]);

  return null;
}



// "use client";

// import { useSession } from "next-auth/react";
// import { useEffect, useRef } from "react";
// import { useRouter, usePathname } from "next/navigation";

// export default function GlobalSessionGuard() {
//   const { status } = useSession();
//   const router = useRouter();
//   const pathname = usePathname();

//   const hasRedirected = useRef(false);

//   useEffect(() => {
//     if (status === "unauthenticated" && !hasRedirected.current) {
//       // do not trigger on initial unauthenticated state
//       if (pathname === "/account") return;

//       hasRedirected.current = true;

//       router.push(`/account?callbackUrl=${pathname}`);
//     }

//     if (status === "authenticated") {
//       hasRedirected.current = false;
//     }
//   }, [status, pathname, router]);

//   return null;
// }
